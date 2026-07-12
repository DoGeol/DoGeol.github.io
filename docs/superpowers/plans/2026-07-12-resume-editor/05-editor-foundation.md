# Task 5: form, session과 export 기반

**Parent plan:** [Resume Editor Implementation Plan](../2026-07-12-resume-editor.md)

**Deliverable:** 편집기가 canonical JSON으로 시작하고, 한 탭의 초안을 복원하며, strict validation을 통과한 값만 `resume.json`으로 내려받는다.

**Files:**

- Modify: `src/app/(dev)/resume-editor/page.dev.tsx`
- Create: `src/app/(dev)/resume-editor/_components/resume-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/editor-toolbar.tsx`
- Create: `src/app/(dev)/resume-editor/_components/editor-tabs.tsx`
- Create: `src/app/(dev)/resume-editor/_components/error-summary.tsx`
- Create: `src/app/(dev)/resume-editor/_model/draft-storage.ts`
- Create: `src/app/(dev)/resume-editor/_model/draft-storage.test.ts`
- Create: `src/app/(dev)/resume-editor/_model/export-resume.ts`
- Create: `src/app/(dev)/resume-editor/_model/export-resume.test.ts`
- Create: `src/app/(dev)/resume-editor/_model/editor-region-index.ts`
- Create: `src/app/(dev)/resume-editor/_model/editor-region-index.test.ts`
- Create: `src/app/(dev)/resume-editor/_model/default-items.ts`
- Create: `src/app/(dev)/resume-editor/_model/default-items.test.ts`
- Create: `src/app/(dev)/resume-editor/_components/resume-editor.test.tsx`

**Interfaces:**

- Consumes: `ResumeData`, `ResumeDraft`, strict/draft schema and canonical clone
- Produces: one `useForm<ResumeDraft>` owner under `ResumeEditor`
- Produces: versioned session envelope and validated export API
- Produces: stable region ID → current `FieldPath<ResumeDraft>` index
- Constants: storage key `resume-editor:draft:v1`, debounce `300ms`, filename `resume.json`

- [ ] **Step 1: 실패하는 storage·export test를 작성한다**

Storage test는 injected `Storage`를 사용해 valid round-trip, 잘못된 JSON, version mismatch, draft shape mismatch와 clear를 각각 검증한다.

```ts
writeResumeDraft(sessionStorage, createResumeFixture(), new Date('2026-07-12T00:00:00.000Z'))
expect(readResumeDraft(sessionStorage)).toEqual({
  status: 'restored',
  draft: createResumeFixture(),
  savedAt: '2026-07-12T00:00:00.000Z',
})

sessionStorage.setItem(RESUME_DRAFT_STORAGE_KEY, '{broken')
expect(readResumeDraft(sessionStorage)).toEqual({ status: 'discarded' })
expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()
```

Export test는 blank draft가 issue path와 함께 실패하고 valid 값이 deterministic JSON을 만드는지 검증한다.

```ts
const result = serializeResumeForExport(createResumeFixture())
expect(result).toEqual({
  success: true,
  data: expect.any(Object),
  json: `${JSON.stringify(createResumeFixture(), null, 2)}\n`,
})
```

Run:

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_model/draft-storage.test.ts' 'src/app/(dev)/resume-editor/_model/export-resume.test.ts'
```

Expected: FAIL because model files do not exist.

- [ ] **Step 2: versioned session boundary를 구현한다**

```ts
const resumeDraftEnvelopeSchema = z
  .object({
    schemaVersion: z.literal(1),
    savedAt: z.iso.datetime(),
    draft: resumeDraftSchema,
  })
  .strict()

export const RESUME_DRAFT_STORAGE_KEY = 'resume-editor:draft:v1'

export type ResumeDraftReadResult =
  | { status: 'empty' }
  | { status: 'restored'; draft: ResumeDraft; savedAt: string }
  | { status: 'discarded' }

export const readResumeDraft = (storage: Storage): ResumeDraftReadResult => {
  const raw = storage.getItem(RESUME_DRAFT_STORAGE_KEY)
  if (raw === null) return { status: 'empty' }
  try {
    const parsed = resumeDraftEnvelopeSchema.safeParse(JSON.parse(raw))
    if (parsed.success) {
      return {
        status: 'restored',
        draft: structuredClone(parsed.data.draft),
        savedAt: parsed.data.savedAt,
      }
    }
  } catch {
    // 아래에서 손상된 현재-tab 초안을 제거한다.
  }
  storage.removeItem(RESUME_DRAFT_STORAGE_KEY)
  return { status: 'discarded' }
}

export const writeResumeDraft = (storage: Storage, draft: unknown, now = new Date()) => {
  const envelope = {
    schemaVersion: 1 as const,
    savedAt: now.toISOString(),
    draft: resumeDraftSchema.parse(draft),
  }
  storage.setItem(RESUME_DRAFT_STORAGE_KEY, JSON.stringify(envelope))
  return envelope.savedAt
}

export const clearResumeDraft = (storage: Storage) => storage.removeItem(RESUME_DRAFT_STORAGE_KEY)
```

localStorage, cookie와 repository write API는 만들지 않는다.

- [ ] **Step 3: strict export boundary를 구현한다**

`serializeResumeForExport(input: unknown)`은 discriminated result를 반환한다.

```ts
type ResumeExportResult =
  { success: true; data: ResumeData; json: string } | { success: false; issues: z.ZodIssue[] }

export const serializeResumeForExport = (input: unknown): ResumeExportResult => {
  const parsed = resumeSchema.safeParse(input)
  return parsed.success
    ? { success: true, data: parsed.data, json: `${JSON.stringify(parsed.data, null, 2)}\n` }
    : { success: false, issues: parsed.error.issues }
}

export const downloadResumeJson = (json: string, ownerDocument: Document) => {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json;charset=utf-8' }))
  const anchor = ownerDocument.createElement('a')
  try {
    anchor.href = url
    anchor.download = 'resume.json'
    anchor.hidden = true
    ownerDocument.body.append(anchor)
    anchor.click()
  } finally {
    anchor.remove()
    URL.revokeObjectURL(url)
  }
}
```

Test에서는 `URL.createObjectURL`, `HTMLAnchorElement.prototype.click`을 spy한다.

- [ ] **Step 4: region index와 새 항목 factory test를 작성한다**

`buildEditorRegionIndex(createResumeFixture())` 결과가 다음 path를 내는지 검증한다.

```ts
const index = buildEditorRegionIndex(createResumeFixture())
expect(index.get('section-experience')).toBe('sections.2')
expect(index.get('experience-1')).toBe('sections.2.data.items.0')
expect(index.get('history-1')).toBe('sections.2.data.items.0.histories.0')
expect(index.get('history-work-1')).toBe('sections.2.data.items.0.histories.0.works.0')
expect(index.get('history-skill-1')).toBe('sections.2.data.items.0.histories.0.skills.0')
expect(index.get('project-work-1')).toBe('sections.3.data.items.0.works.0')
expect(index.get('project-detail-1')).toBe('sections.3.data.items.0.works.0.details.0')
```

Paragraph, summary, contact, project, education, activity와 license ID도 실제 path에 mapping되고 unknown ID는 `undefined`인지 추가 검증한다.

`createDefaultItem(type, createId)`와 `createSkillReference(skillId, createId)`는 다음 값을 만든다. Production default ID factory는 `crypto.randomUUID`, test는 deterministic function을 주입한다.

| Type            | Draft default                                               |
| --------------- | ----------------------------------------------------------- |
| text            | `{ id, text: '' }`                                          |
| skill reference | `{ id, skillId }` (선택된 catalog ID 필수)                  |
| contact         | email, 빈 label/value, `_self`                              |
| catalog skill   | 빈 label, `frontend`; generated ID는 read-only              |
| experience      | 빈 company/logo/summaries/histories, `employed`             |
| history         | 빈 department/role/start date, null end, 빈 works/skills    |
| project         | 빈 title/start/company/summary/works, null end              |
| project work    | 빈 title/details                                            |
| education       | 빈 school/start/major/summary, null end, `graduated: false` |
| activity        | 빈 title/start/summary, null end                            |
| license         | 빈 title/acquiredAt/issuer                                  |

모든 결과가 대응 draft shape를 통과하고 ID가 index/label에 의존하지 않는지 test한다. 섹션 factory는 만들지 않는다.

Run:

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_model/editor-region-index.test.ts' 'src/app/(dev)/resume-editor/_model/default-items.test.ts'
```

Expected: FAIL, 구현 후 PASS. Region index는 section 순서가 바뀔 때마다 다시 만들며 ID 자체는 바꾸지 않는다.

- [ ] **Step 5: responsive form shell의 실패하는 component test를 작성한다**

`resume-editor.test.tsx`는 fake timers와 user-event를 사용해 다음을 검증한다.

- canonical title이 `이력서 제목` input에 보인다.
- input 변경 후 299ms에는 저장하지 않고 300ms 뒤 sessionStorage envelope을 저장한다.
- remount하면 같은 tab의 draft title을 복원한다.
- 손상되거나 version이 다른 초안은 제거하고 `초안을 복구할 수 없어 원본을 불러왔습니다` 안내를 보인다.
- `초안 초기화` 클릭 후 canonical 값으로 reset하고 storage key를 제거한다.
- blank title에서 `JSON 내보내기`를 누르면 error summary와 field error가 보이고 download하지 않는다.
- valid form은 `resume.json` download를 한 번 호출한다.

Run: `pnpm vitest run 'src/app/(dev)/resume-editor/_components/resume-editor.test.tsx'`

Expected: FAIL because the editor components do not exist.

- [ ] **Step 6: RHF를 단독 state owner로 하는 editor shell을 구현한다**

`ResumeEditor`만 `useForm<ResumeDraft>`를 호출한다.

```tsx
const form = useForm<ResumeDraft>({
  defaultValues: initialResume,
  resolver: zodResolver(resumeSchema),
  mode: 'onBlur',
})
```

- mount effect는 `restored`면 `reset(draft)`와 savedAt 상태를 설정하고, `discarded`면 canonical을 유지하면서 복구 실패 안내를 표시한다.
- `useWatch({ control })` 결과는 hydration 완료 뒤 300ms debounce로 sessionStorage에 저장한다.
- 첫 storage read/reset이 끝나기 전에는 canonical 값을 storage에 쓰지 않는다.
- `FormProvider` 아래에 metadata title/socialTitle/description field, toolbar와 pane을 둔다.
- Client root에 `data-resume-editor-client-marker="resume-editor-client-only-marker"`를 두어 production scan이 client bundle 누출도 탐지하게 한다.
- desktop은 좌측 편집 pane과 우측 `프리뷰 준비 중` pane을 동시에 표시한다.
- mobile은 `편집`/`프리뷰` tab 중 하나만 표시하며 tab button은 `aria-selected`를 가진다.
- submit success에서 serializer와 downloader를 호출하고, invalid callback은 첫 error path에 `setFocus`한 뒤 error summary heading으로 안내한다.
- reset은 confirm 후 storage를 지우고 `structuredClone(initialResume)`으로 form을 reset한다.

`page.dev.tsx`는 Server Component로 유지한다.

```tsx
export default function ResumeEditorPage() {
  return <ResumeEditor initialResume={getCanonicalResumeData()} />
}
```

- [ ] **Step 7: Task 5 회귀 검증과 커밋을 수행한다**

```bash
pnpm vitest run 'src/app/(dev)/resume-editor'
pnpm typecheck
pnpm lint
git add src/app/\(dev\)/resume-editor
git commit -m "feat(resume): 편집기 form과 JSON export 기반 추가"
```
