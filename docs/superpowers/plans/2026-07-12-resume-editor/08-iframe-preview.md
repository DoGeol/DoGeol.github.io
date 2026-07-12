# Task 8: iframe 실제 프리뷰와 영역 선택

**Parent plan:** [Resume Editor Implementation Plan](../2026-07-12-resume-editor.md)

**Deliverable:** 실제 media query가 적용되는 same-origin iframe에서 draft를 보고, preview 영역 선택으로 대응 form을 열며, 장치 preset과 actual mode를 전환한다.

**Files:**

- Create: `src/app/(dev)/_shared/resume-preview-protocol.ts`
- Create: `src/app/(dev)/_shared/resume-preview-protocol.test.ts`
- Modify: `src/app/(dev)/resume-preview/page.dev.tsx`
- Create: `src/app/(dev)/resume-preview/_components/resume-preview-runtime.tsx`
- Create: `src/app/(dev)/resume-preview/_components/selectable-region-renderer.tsx`
- Create: `src/app/(dev)/resume-preview/_components/resume-preview-runtime.test.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/resume-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/preview/preview-frame.tsx`
- Create: `src/app/(dev)/resume-editor/_components/preview/preview-toolbar.tsx`
- Create: `src/app/(dev)/resume-editor/_components/preview/preview-stage.tsx`
- Create: `src/app/(dev)/resume-editor/_components/preview/preview-frame.test.tsx`
- Create: `src/app/(dev)/resume-editor/_model/preview-scale.ts`
- Create: `src/app/(dev)/resume-editor/_model/preview-scale.test.ts`
- Create: `src/app/(dev)/resume-editor/_model/preview-assets.ts`
- Create: `src/app/(dev)/resume-editor/_model/preview-assets.test.ts`
- Create: `tests/e2e/resume-editor.spec.ts`

**Interfaces:**

- Consumes: `ResumeDocument`, `ResumeRegionRenderer`, `ResumeDraft` and stable region index
- Produces: strict same-origin four-message protocol
- Produces: desktop `1440×1000`, tablet `768×1024`, mobile `390×844` presets
- Modes: `select` adds dev interaction; `actual` uses the plain renderer with no editor attributes.

- [ ] **Step 1: typed protocol의 실패 test를 작성한다**

Zod schema로 다음 exact message만 허용한다.

```ts
type EditorToPreviewMessage =
  | { type: 'RENDER_DRAFT'; draft: ResumeDraft; selectedRegionId: string | null }
  | { type: 'SET_PREVIEW_MODE'; mode: 'select' | 'actual' }

type PreviewToEditorMessage =
  | { type: 'PREVIEW_READY' }
  | { type: 'SELECT_REGION'; regionId: string; regionType: ResumeRegionType }
```

Test는 valid message accept 외에 다음을 모두 null로 거부하는지 검증한다.

- origin이 `window.location.origin`과 다름
- `event.source`가 expected `WindowProxy`와 다름
- unknown type 또는 extra key
- invalid draft, mode, region type, blank region ID

```ts
parseEditorToPreviewMessage(event, expectedOrigin, expectedSource)
parsePreviewToEditorMessage(event, expectedOrigin, expectedSource)
```

Run: `pnpm vitest run 'src/app/(dev)/_shared/resume-preview-protocol.test.ts'`

Expected: FAIL before implementation.

- [ ] **Step 2: strict protocol parser를 구현한다**

<!-- prettier-ignore -->
```ts
const editorToPreviewMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('RENDER_DRAFT'), draft: resumeDraftSchema, selectedRegionId: z.string().min(1).nullable() }).strict(),
  z.object({ type: z.literal('SET_PREVIEW_MODE'), mode: z.enum(['select', 'actual']) }).strict(),
])
const previewToEditorMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('PREVIEW_READY') }).strict(),
  z.object({ type: z.literal('SELECT_REGION'), regionId: z.string().min(1), regionType: z.enum(resumeRegionTypes) }).strict(),
])

const parseMessage = <Schema extends z.ZodType>(
  schema: Schema, event: MessageEvent, expectedOrigin: string, expectedSource: WindowProxy,
): z.infer<Schema> | null => {
  if (event.origin !== expectedOrigin || event.source !== expectedSource) return null
  const parsed = schema.safeParse(event.data)
  return parsed.success ? parsed.data : null
}

export const parseEditorToPreviewMessage = (event: MessageEvent, origin: string, source: WindowProxy) =>
  parseMessage(editorToPreviewMessageSchema, event, origin, source)
export const parsePreviewToEditorMessage = (event: MessageEvent, origin: string, source: WindowProxy) =>
  parseMessage(previewToEditorMessageSchema, event, origin, source)
```

Run: `pnpm vitest run 'src/app/(dev)/_shared/resume-preview-protocol.test.ts'`. Expected: PASS.

- [ ] **Step 3: scale과 asset field mapping의 실패 test를 작성한다**

```ts
expect(calculatePreviewScale({ width: 720, height: 700 }, { width: 1440, height: 1000 })).toBe(0.5)
expect(calculatePreviewScale({ width: 1600, height: 1200 }, { width: 1440, height: 1000 })).toBe(1)

expect(collectPreviewAssets(createResumeFixture())).toEqual(
  expect.arrayContaining([
    { fieldPath: 'assets.profileFront', url: '/profile/pdg-real.webp' },
    { fieldPath: 'sections.2.data.items.0.logoPath', url: '/company/logo/laud.webp' },
  ]),
)
```

Scale은 `min(1, availableWidth / viewportWidth, availableHeight / viewportHeight)`이며 음수/0/NaN 입력은 명시적 오류다. Asset collector는 root assets와 experience logo의 현재 form path를 반환한다.

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_model/preview-scale.test.ts' 'src/app/(dev)/resume-editor/_model/preview-assets.test.ts'
```

- [ ] **Step 4: scale과 asset collector를 구현한다**

<!-- prettier-ignore -->
```ts
interface Size { width: number; height: number }

export const calculatePreviewScale = (available: Size, viewport: Size) => {
  const values = [available.width, available.height, viewport.width, viewport.height]
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new Error('프리뷰 크기는 0보다 큰 유한수여야 합니다')
  }
  return Math.min(1, available.width / viewport.width, available.height / viewport.height)
}

export type ResumeAssetFieldPath =
  | 'assets.profileFront' | 'assets.profileBack'
  | `sections.${number}.data.items.${number}.logoPath`
interface PreviewAsset { fieldPath: ResumeAssetFieldPath; url: string }

export const collectPreviewAssets = (draft: ResumeDraft): PreviewAsset[] => {
  const assets: PreviewAsset[] = [
    { fieldPath: 'assets.profileFront', url: draft.assets.profileFront },
    { fieldPath: 'assets.profileBack', url: draft.assets.profileBack },
  ]
  draft.sections.forEach((section, sectionIndex) => {
    if (section.type !== 'experience') return
    section.data.items.forEach((item, itemIndex) => assets.push({
      fieldPath: `sections.${sectionIndex}.data.items.${itemIndex}.logoPath`, url: item.logoPath,
    }))
  })
  return assets
}
```

Step 3 command가 PASS인지 확인한다.

- [ ] **Step 5: selectable preview runtime component test를 작성한다**

Mock parent window와 `MessageEvent`로 다음 흐름을 검증한다.

- mount 후 parent에게 `PREVIEW_READY`를 정확한 origin으로 보낸다.
- valid `RENDER_DRAFT`를 받으면 새 title/company를 렌더링한다.
- select mode의 `experience-1` click/Enter는 `SELECT_REGION`을 보낸다.
- nested region click은 propagation을 막아 가장 구체적인 ID만 보낸다.
- actual mode에는 `[data-preview-region-id]`, outline과 interactive tabindex가 없다.
- invalid source/origin/message는 DOM과 selection을 바꾸지 않는다.

Run: `pnpm vitest run 'src/app/(dev)/resume-preview/_components/resume-preview-runtime.test.tsx'`

Expected: FAIL because runtime does not exist.

- [ ] **Step 6: preview runtime과 selection renderer를 구현한다**

`page.dev.tsx`는 canonical clone을 Client Component에 전달한다.

```tsx
export default function ResumePreviewPage() {
  return (
    <main className="h-full w-full">
      <ResumePreviewRuntime initialResume={getCanonicalResumeData()} />
    </main>
  )
}
```

Runtime은 draft, mode와 selected ID state를 갖고 `window.parent`에서 온 valid message만 반영한다. `select` mode renderer는 `isValidElement(children)`이면 `cloneElement`로 아래 props를 넣어 markup hierarchy를 보존한다.

```tsx
{
  'data-preview-region-id': region.id,
  'data-preview-region-type': region.type,
  tabIndex: 0,
  'aria-label': `${region.label} 편집`,
  onClick: selectRegion,
  onKeyDown: selectOnEnterOrSpace,
}
```

기존 `className`과 handler를 보존해 merge한다. Select handler는 `preventDefault()`와 `stopPropagation()`으로 contact link 이동과 부모 region 중복 선택을 막고 stable ID를 보낸다. selected region만 primary outline/label, 나머지는 hover outline을 보인다. `actual` mode는 `plainResumeRegionRenderer`를 넘겨 wrapper, data attribute와 handler를 전혀 만들지 않는다.

- [ ] **Step 7: parent frame의 실패 component test를 작성한다**

Fake iframe contentWindow, `ResizeObserver`, fake timer로 검증한다.

- iframe title은 `실제 이력서 프리뷰`, src는 `/resume-preview`다.
- READY 전에는 message를 보내지 않고 READY 후 latest draft와 mode를 보낸다.
- draft 변경은 `useDeferredValue` 이후 `resumeDraftSchema`를 통과한 값만 보낸다.
- SELECT_REGION을 받으면 selected ID callback을 한 번 호출한다.
- preset button이 iframe의 실제 width/height attribute와 stage scale을 바꾼다.
- 3초간 READY가 없으면 오류와 `다시 연결` button을 보여준다.
- retry는 iframe key를 바꾸고 handshake timer를 다시 시작한다.

Run: `pnpm vitest run 'src/app/(dev)/resume-editor/_components/preview/preview-frame.test.tsx'`

Expected: FAIL before parent preview components exist.

- [ ] **Step 8: parent frame, toolbar와 asset validation을 구현한다**

`PreviewFrame`은 iframe ref와 ready state를 소유하고 listener에서 exact origin/source parser를 사용한다. `postMessage`의 target origin도 `window.location.origin`으로 고정한다.

- `PreviewToolbar`는 three viewport radio buttons, `선택 모드`/`실제 화면` toggle, 현재 scale을 제공한다.
- `PreviewStage`는 `ResizeObserver` 결과로 scale을 계산하고 fixed-size iframe의 CSS `scale()` 값에 넣으며 `transform-origin: top left`를 적용한다.
- iframe은 preset width/height 자체를 가지므로 `tablet:` media query가 실제로 바뀐다.
- `ResumeEditor`의 watched draft는 `useDeferredValue`를 거쳐 frame에 전달한다.
- SELECT_REGION 수신 시 stable ID를 유지하고 Task 6 selection contract가 최신 path로 accordion scroll/focus를 수행한다. ID가 삭제됐으면 부모 section으로 fallback한다.
- asset URL마다 `Image`를 preload하고 실패 시 collector의 field path에 `type: 'asset'` RHF error를 설정한다. 성공하면 asset type error만 clear하며 effect cleanup/token으로 이전 URL의 늦은 결과를 무시한다. preview image에는 fallback 배경/alt text가 표시된다.
- mode/preset은 UI state라 session envelope과 exported JSON에 넣지 않는다.

- [ ] **Step 9: 양방향 E2E gate를 추가한다**

`tests/e2e/resume-editor.spec.ts`에 desktop project만 우선 작성한다.

```ts
test('form과 실제 preview를 양방향으로 연결한다', async ({ page }) => {
  await page.goto('/resume-editor')
  const preview = page.frameLocator('iframe[title="실제 이력서 프리뷰"]')
  await expect(preview.getByText('Experience')).toBeVisible()
  await page.getByLabel('회사명').first().fill('프리뷰 테스트 회사')
  await expect(preview.getByText('프리뷰 테스트 회사')).toBeVisible()
  await preview.locator('[data-preview-region-id="experience-1"]').click()
  await expect(page.getByLabel('회사명').first()).toBeFocused()
})
```

Run:

```bash
pnpm vitest run 'src/app/(dev)/_shared' 'src/app/(dev)/resume-preview' 'src/app/(dev)/resume-editor'
pnpm exec playwright test tests/e2e/resume-editor.spec.ts --project=desktop-chromium
pnpm typecheck
pnpm lint
```

- [ ] **Step 10: Task 8을 커밋한다**

```bash
git add src/app/\(dev\) tests/e2e/resume-editor.spec.ts
git commit -m "feat(resume): 실제 viewport 프리뷰와 영역 선택 연결"
```
