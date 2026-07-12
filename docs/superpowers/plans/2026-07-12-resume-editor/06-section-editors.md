# Task 6: 전체 section editor

**Parent plan:** [Resume Editor Implementation Plan](../2026-07-12-resume-editor.md)

**Deliverable:** 내부 ID와 schema version을 제외한 모든 콘텐츠를 구조화 form으로 수정하고, 모든 object 반복 항목을 추가·삭제하며, section 표시 여부를 전환할 수 있다.

**Files:**

- Modify: `src/app/(dev)/resume-editor/_components/resume-editor.tsx`
- Modify: `src/app/(dev)/resume-editor/_model/default-items.ts`
- Modify: `src/app/(dev)/resume-editor/_model/default-items.test.ts`
- Create: `src/app/(dev)/resume-editor/_model/remove-skill.ts`
- Create: `src/app/(dev)/resume-editor/_model/remove-skill.test.ts`
- Create: `src/app/(dev)/resume-editor/_model/editor-labels.ts`
- Create: `src/app/(dev)/resume-editor/_components/fields/field-shell.tsx`
- Create: `src/app/(dev)/resume-editor/_components/fields/text-field.tsx`
- Create: `src/app/(dev)/resume-editor/_components/fields/select-field.tsx`
- Create: `src/app/(dev)/resume-editor/_components/fields/repeatable-text-field.tsx`
- Create: `src/app/(dev)/resume-editor/_components/fields/skill-reference-field.tsx`
- Create: `src/app/(dev)/resume-editor/_components/fields/nullable-date-field.tsx`
- Create: `src/app/(dev)/resume-editor/_components/document-settings-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/section-editor-list.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/section-card.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/information-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/introduce-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/experience-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/projects-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/education-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/activity-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/licenses-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/section-editors/section-editors.test.tsx`

**Interfaces:**

- Consumes: the single `FormProvider<ResumeDraft>` and stable item factories from Task 5
- Produces: accessible controlled section accordion and region focus contract
- Produces: `getResumeSectionLabel(type: ResumeSectionType): string`
- Produces: `removeSkillAndReferences(draft, skillId): { draft: ResumeDraft; removedReferenceCount: number }`
- Produces: object-array add/delete APIs; Task 7 adds reordering without changing these values
- Constraint: seven sections always remain present; section type/ID and item IDs are read-only.

- [ ] **Step 1: field primitive component tests를 먼저 작성한다**

`section-editors.test.tsx`의 test harness는 `useForm({ defaultValues: createResumeFixture() })`와 `FormProvider`를 사용한다. 각 field는 visible `<label>`, `aria-describedby`, inline error와 실제 RHF path를 가진다.

다음 동작을 실패 test로 작성한다.

- text/textarea를 수정하면 `getValues()`가 즉시 바뀐다.
- repeatable text에서 `항목 추가`, 수정, 삭제가 `{ id, text }[]`에 반영된다.
- nullable 종료일의 `현재 진행 중`을 켜면 값이 `null`, 끄면 오늘 날짜가 된다.
- 잘못된 field는 `aria-invalid="true"`이고 error ID와 연결된다.
- `removeSkillAndReferences(fixture, 'typescript')`는 원본을 mutate하지 않고 catalog와 모든 history reference를 제거한 clone과 참조 개수를 반환한다.

Run: `pnpm vitest run 'src/app/(dev)/resume-editor/_components/section-editors/section-editors.test.tsx' 'src/app/(dev)/resume-editor/_model/remove-skill.test.ts'`

Expected: FAIL because field components do not exist.

- [ ] **Step 2: typed field primitives를 구현한다**

모든 field component는 `name: FieldPath<ResumeDraft>`를 받고 `useFormContext<ResumeDraft>()`만 사용한다. `FieldShell`은 label, optional help, error message와 deterministic DOM ID를 연결한다.

- `TextField`: text, url, email, tel, date, month input와 multiline textarea를 지원한다.
- `SelectField`: literal option 목록만 받고 unknown value를 만들지 않는다.
- `RepeatableTextField`: `useFieldArray`와 text item factory로 stable ID가 있는 행을 다룬다.
- `SkillReferenceField`: catalog checkbox 선택을 `{ id, skillId }[]` append/remove로 변환하고 선택 순서를 표시한다.
- `NullableDateField`: checkbox와 date/month input을 묶고 null 전환 전 마지막 값을 보관한다.
- 새 항목을 추가하면 `requestAnimationFrame` 뒤 첫 input에 focus한다.
- content가 하나라도 있는 항목 삭제는 `window.confirm`, 완전히 빈 새 항목 삭제는 즉시 실행한다.
- catalog skill 삭제는 아래 pure helper 결과의 참조 개수를 confirm 문구에 표시한다. 확인 시 `reset(result.draft, { keepDefaultValues: true, keepTouched: true })` 후 `trigger()`하고 취소 시 값을 유지한다.

```ts
export const removeSkillAndReferences = (source: ResumeDraft, skillId: string) => {
  const draft = structuredClone(source)
  draft.skillCatalog = draft.skillCatalog.filter((skill) => skill.id !== skillId)
  let removedReferenceCount = 0
  for (const section of draft.sections) {
    if (section.type !== 'experience') continue
    for (const item of section.data.items) {
      for (const history of item.histories) {
        const before = history.skills.length
        history.skills = history.skills.filter((reference) => reference.skillId !== skillId)
        removedReferenceCount += before - history.skills.length
      }
    }
  }
  return { draft, removedReferenceCount }
}
```

- [ ] **Step 3: document settings와 모든 field mapping을 구현한다**

`DocumentSettingsEditor`는 아래 root fields를 제공한다.

| Group  | Editable fields                                                             |
| ------ | --------------------------------------------------------------------------- |
| 문서   | `templateId` select, metadata `title`, `socialTitle`, `description`         |
| 이미지 | `profileFront`, `profileBack` root-relative path                            |
| 기술   | skill `label`, `category`; add/delete; stable `id`는 생성 후 read-only 표시 |

`schemaVersion`은 format contract이므로 `1`을 badge로만 표시한다. 첫 버전 template option은 `classic` 하나지만 registry option 배열에서 렌더링한다.

각 section editor는 다음 field를 빠짐없이 제공한다.

| Section | Editable fields |
| --- | --- |
| information | `visible`, `headline`, contacts의 `type/label/value/target` |
| introduce | `visible`, paragraph text rows, `updatedAt` |
| experience | `visible`, `showTotalPeriod`, company `companyName/logoPath/serviceSummary/experienceSummary/employmentStatus`, history `department/role/startDate/endDate/works/skills` |
| projects | `visible`, project `title/startMonth/endMonth/companyName/summary`, work `title/details` |
| education | `visible`, `school/startMonth/endMonth/graduated/major/summary` |
| activity | `visible`, `title/startMonth/endMonth/summary` |
| licenses | `visible`, `title/acquiredAt/issuer` |

Summary, paragraph, work와 detail은 각 object의 `text`를 편집한다. Skill selection은 catalog ID를 checkbox로 보여주되 선택 시 reference ID도 생성한다. asset path는 upload/file picker 없이 text input만 제공한다.

- [ ] **Step 4: section accordion과 selection contract test를 작성한다**

다음 case를 독립 test로 추가한다.

```tsx
await user.click(screen.getByRole('switch', { name: 'Experience 표시' }))
expect(getDraft().sections[2].visible).toBe(false)

await user.click(screen.getByRole('button', { name: '회사 추가' }))
expect(getDraft().sections[2].data.items).toHaveLength(2)
expect(document.activeElement).toHaveAccessibleName('회사명')
```

- 모든 section heading과 표시 switch가 있다.
- section toggle button은 `aria-expanded`를 정확히 갱신한다.
- text/skill-reference, contact, skill, company/history, project/work, education, activity, license add/delete가 대응 배열만 바꾼다.
- 참조 중인 catalog skill 삭제 취소는 전체 draft를 유지하고, 확인은 catalog와 모든 reference를 함께 제거한다.
- 내용 있는 항목 삭제 취소 시 값이 유지되고 확인 시 삭제된다.
- selected nested ID를 넘기면 부모 section을 열고 `[data-editor-region-id]` 요소로 scroll한 뒤 첫 field를 focus한다.
- 선택된 item 삭제 후 selection은 부모 section ID로 이동한다.

Run: `pnpm vitest run 'src/app/(dev)/resume-editor/_components/section-editors/section-editors.test.tsx'`

Expected: FAIL before the section components are implemented.

- [ ] **Step 5: accessible section editor list를 구현한다**

`SectionEditorList`는 root section field array의 현재 순서를 그대로 사용하고 exhaustive switch로 전용 editor를 고른다. `SectionCard` contract는 다음과 같다.

```ts
const sectionLabels: Record<ResumeSectionType, string> = {
  information: '기본 정보',
  introduce: '소개',
  experience: '경력',
  projects: '프로젝트',
  education: '학력',
  activity: '활동',
  licenses: '자격증',
}
export const getResumeSectionLabel = (type: ResumeSectionType) => sectionLabels[type]
```

```ts
interface SectionCardProps {
  regionId: string
  title: string
  expanded: boolean
  selected: boolean
  onExpandedChange: (expanded: boolean) => void
}
```

- heading 안의 `<button>`에 `aria-expanded`, `aria-controls`를 둔다.
- 표시 switch와 향후 drag handle 영역은 accordion toggle과 별도 button이다.
- wrapper에 `data-editor-region-id={regionId}`를 둔다.
- nested item card에도 동일한 region attribute와 stable `key={item.id}`를 둔다.
- `ResumeEditor`가 `selectedRegionId`와 open section ID set을 소유한다.
- selection 변경 시 `buildEditorRegionIndex(getValues())`로 최신 path를 찾고 부모 section을 연 뒤 region scroll/focus를 수행한다.
- section 숨김은 데이터를 삭제하지 않고 preview에서만 제외한다.

`useFieldArray`는 sections를 포함한 모든 object array(text/skill reference 포함)에 사용한다. `field.id`는 JSON stable ID로 보존하고 RHF key는 `keyName: 'formKey'`로 분리한다.

- [ ] **Step 6: 전체 editor component와 strict 검증을 통과시킨다**

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_components'
pnpm vitest run 'src/app/(dev)/resume-editor/_model'
pnpm typecheck
pnpm lint
```

Expected: all section types, add/delete/visible/focus tests PASS. `any`, array-index React key와 uncontrolled/controlled warning이 없다.

- [ ] **Step 7: Task 6을 커밋한다**

```bash
git add src/app/\(dev\)/resume-editor
git commit -m "feat(resume): 전체 섹션 구조화 편집 지원"
```
