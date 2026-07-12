# Task 3: 공용 template renderer 전환

**Parent plan:** [Resume Editor Implementation Plan](../2026-07-12-resume-editor.md)

**Deliverable:** `/resume`이 canonical JSON과 template registry만 사용하면서 기존 desktop/mobile screenshot을 그대로 유지한다.

**Files:**

- Create: `src/app/(pages)/resume/_model/resume-region.ts`
- Create: `src/app/(pages)/resume/_templates/classic.tsx`
- Create: `src/app/(pages)/resume/_templates/registry.tsx`
- Create: `src/app/(pages)/resume/_templates/registry.test.tsx`
- Modify: `src/app/(pages)/resume/page.tsx`
- Modify: `src/app/(pages)/resume/_components/**/*.tsx`
- Modify: `src/app/(pages)/resume/_components/experience/utils.ts`
- Modify: `src/app/(pages)/resume/_components/experience/utils.test.ts`
- Modify: `src/features/highlighted-text/index.tsx`
- Modify: `src/features/highlighted-text/index.test.tsx`
- Delete: `src/app/(pages)/resume/_infos/*.ts`
- Delete: section-local duplicate `types.ts` files and `src/app/(pages)/resume/_components/common/skill.ts`

**Interfaces:**

- Consumes: `ResumeData`, section types and `canonicalResumeData` from Tasks 1–2
- Produces: `resumeRegionTypes`, `ResumeRegion`, `ResumeRegionRenderer`, plain renderer
- Produces: `ResumeDocument({ resume, renderRegion? }): ReactElement`
- Produces: `getResumeTemplate(templateId)` and `resumeTemplateOptions`
- Constraint: production page passes no editor renderer and emits no editor attributes or event handlers.

- [ ] **Step 1: 실패하는 formatting·template tests를 작성한다**

`highlighted-text/index.test.tsx`에 newline과 강조 결합 test를 추가한다.

```tsx
render(<HighlightedText text={'안녕하세요.\n개발자 **테스트**입니다.'} />)
expect(screen.getByText('테스트').tagName).toBe('STRONG')
expect(container.querySelectorAll('br')).toHaveLength(1)
```

`registry.test.tsx`는 strict parse한 fixture로 다음을 검증한다.

<!-- prettier-ignore -->
```tsx
const resume = resumeSchema.parse(createResumeFixture())
render(<ResumeDocument resume={resume} />)
expect(screen.getByText('Experience')).toBeVisible()
expect(screen.getByText('프로젝트')).toBeVisible()

const regions: string[] = []
const renderRegion: ResumeRegionRenderer = ({ id, children }) => {
  regions.push(id)
  expect(typeof children.type).toBe('string')
  return children
}
render(<ResumeDocument resume={resume} renderRegion={renderRegion} />)
expect(regions).toEqual(expect.arrayContaining([
  'section-information', 'contact-email', 'paragraph-1', 'section-experience', 'experience-1',
  'service-summary-1', 'history-1', 'history-work-1', 'history-skill-1', 'project-1',
  'project-work-1', 'project-detail-1', 'education-1', 'activity-1', 'license-1',
]))

expect(() => getResumeTemplate('unknown' as never)).toThrow(/template/i)
```

```bash
pnpm vitest run src/features/highlighted-text/index.test.tsx 'src/app/(pages)/resume/_templates/registry.test.tsx'
```

Expected: FAIL because template and region modules do not exist and newline is not rendered.

- [ ] **Step 2: template-neutral region 계약을 구현한다**

<!-- prettier-ignore -->
```tsx
import type { HTMLAttributes, ReactElement } from 'react'

export const resumeRegionTypes = [
  'section', 'contact', 'experience', 'history', 'project', 'project-work',
  'education', 'activity', 'license', 'text', 'skill-reference',
] as const
export type ResumeRegionType = (typeof resumeRegionTypes)[number]

export interface ResumeRegion {
  id: string
  type: ResumeRegionType
  label: string
  children: ReactElement<HTMLAttributes<HTMLElement>>
}

export type ResumeRegionRenderer = (region: ResumeRegion) => ReactElement

export const plainResumeRegionRenderer: ResumeRegionRenderer = ({ children }) => children
```

이 module에는 `use client`, DOM event, `data-*` marker와 dev import를 넣지 않는다.

- [ ] **Step 3: 기존 section을 props 기반으로 바꾼다**

각 index component에서 `_infos` import를 제거하고 다음 signature를 사용한다.

| Component | Props |
| --- | --- |
| `Information` | `section: InformationSection`, `assets: ResumeData['assets']`, `renderRegion` |
| `Introduce` | `section: IntroduceSection`, `renderRegion` |
| `Experience` | `section: ExperienceSection`, `skillCatalog: SkillDefinition[]`, `renderRegion: ResumeRegionRenderer` |
| `Project` | `section: ProjectsSection`, `renderRegion: ResumeRegionRenderer` |
| `Education` | `section: EducationSection`, `renderRegion` |
| `Activity` | `section: ActivitySection`, `renderRegion` |
| `License` | `section: LicensesSection`, `renderRegion` |

Nested component type는 schema에서 indexed access로 가져온다.

```ts
type ExperienceItem = ExperienceSection['data']['items'][number]
type HistoryItem = ExperienceItem['histories'][number]
type ProjectItemData = ProjectsSection['data']['items'][number]
```

필드 mapping은 다음과 같다.

- `visible`이 false면 section component는 `null`을 반환한다.
- `logoPath`를 `<img src>`에 직접 전달하고 profile front/back은 기존 circle의 inline `backgroundImage`로 전달한다. 이미지 fallback 배경과 한국어 accessible label을 둔다.
- contact URL은 `type`에 따라 `mailto:`/`tel:` prefix를 붙인다.
- `startDate/endDate`, `startMonth/endMonth`, `acquiredAt`은 기존 화면의 점 표기로 format한다.
- 모든 text item은 `.text`를 기존 위치에 표시하고 skill badge는 `skillCatalog.find(({ id }) => id === reference.skillId)`의 label/category를 사용한다.
- 모든 React key는 content text나 array index 대신 persistent `id`를 사용한다.
- 각 section과 모든 object row(text/skill reference 포함)는 custom component 바깥이 아니라 자신의 실제 host root(`<article>`, `<section>`, `<li>`, `<p>`)에서 `renderRegion`을 호출한다. 따라서 preview가 clone한 props가 DOM까지 전달된다.
- map return은 `<Fragment key={item.id}>`로 감싸 DOM wrapper 없이 stable key를 둔다. Contact는 valid `<li><a /></li>` 구조에서 `<li>`를 region host로 사용한다.

`Information`의 headline은 `dangerouslySetInnerHTML` 대신 다음처럼 렌더링한다.

```tsx
<h2 className={headlineClasses}>
  <HighlightedText text={section.data.headline} className="font-bold" useUnderline={false} />
</h2>
```

`HighlightedText`는 line별 기존 `**...**` parser를 적용하고 line 사이에 `<br />`를 넣는다. 임의 HTML string은 그대로 text로 표시한다.

- [ ] **Step 4: classic template과 registry를 구현한다**

`classic.tsx`는 section array 순서대로 exhaustive switch하고 `renderRegion`을 각 component에 전달한다.

<!-- prettier-ignore -->
```tsx
export interface ResumeTemplateProps {
  resume: ResumeData
  renderRegion?: ResumeRegionRenderer
}

export const ClassicResume = ({
  resume,
  renderRegion = plainResumeRegionRenderer,
}: ResumeTemplateProps) => (
  <section className="mx-auto flex max-w-6xl min-w-xs flex-col space-y-6 py-8">
    {resume.sections.map((section) => {
      return (
        <Fragment key={section.id}>
          {renderClassicSection(section, resume, renderRegion)}
        </Fragment>
      )
    })}
  </section>
)
```

`renderClassicSection`는 hidden section을 `null`로 반환하고 `assertNever`를 사용한다. 각 section component가 자신의 root를 `type: 'section'`으로 감싸며 모든 object 반복 항목도 Step 3의 region type과 stable ID를 쓴다.

Registry는 component와 한국어 label을 함께 소유해 편집기 template select가 registry에서 파생되게 한다.

```tsx
type ResumeTemplateComponent = ComponentType<ResumeTemplateProps>
const resumeTemplates: Record<
  ResumeTemplateId,
  { label: string; Component: ResumeTemplateComponent }
> = {
  classic: { label: '기본 이력서', Component: ClassicResume },
}

export const resumeTemplateOptions = Object.entries(resumeTemplates).map(([value, { label }]) => ({
  value: value as ResumeTemplateId,
  label,
}))

export const getResumeTemplate = (templateId: ResumeTemplateId) => {
  const registration = resumeTemplates[templateId]
  if (!registration) throw new Error(`지원하지 않는 이력서 template: ${templateId}`)
  return registration.Component
}

export const ResumeDocument = (props: ResumeTemplateProps) => {
  const Template = getResumeTemplate(props.resume.templateId)
  return <Template {...props} />
}
```

- [ ] **Step 5: `/resume`를 canonical JSON으로 전환한다**

`page.tsx`에서 section component import를 모두 제거한다.

```tsx
import { canonicalResumeData } from '@/app/(pages)/resume/_model/resume-data'
import { ResumeDocument } from '@/app/(pages)/resume/_templates/registry'

export async function generateMetadata(
  _: PageProps<'/resume'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previous = await parent
  return {
    title: canonicalResumeData.metadata.title,
    openGraph: {
      ...previous.openGraph,
      title: canonicalResumeData.metadata.socialTitle,
      description: canonicalResumeData.metadata.description,
    },
    twitter: {
      ...previous.twitter,
      title: canonicalResumeData.metadata.socialTitle,
      description: canonicalResumeData.metadata.description,
    },
  }
}

export default function Page() {
  return <ResumeDocument resume={canonicalResumeData} />
}
```

현재 page처럼 top-level `description`은 parent 값을 상속하고 JSON description은 기존 Open Graph/Twitter에만 사용한다. 모든 component import가 schema type을 사용하면 `_infos/*.ts`, section-local `types.ts`와 `common/skill.ts`를 삭제한다. `experience/utils.ts`는 indexed type으로 변경하고 기존 결과를 유지한다.

- [ ] **Step 6: unit과 public visual regression을 통과시킨다**

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm exec playwright test tests/e2e/routes.spec.ts --grep '/resume 현행 디자인을 유지한다' --project=desktop-chromium
pnpm exec playwright test tests/e2e/routes.spec.ts --grep '/resume 현행 디자인을 유지한다' --project=mobile-chromium
```

Expected: 모든 test PASS. 기존 `resume-desktop`과 `resume-mobile` snapshot은 갱신하지 않는다. 차이가 나면 renderer markup/class/date formatting을 수정한다.

- [ ] **Step 7: Task 3을 커밋한다**

```bash
git add src/app/\(pages\)/resume src/features/highlighted-text
git commit -m "refactor(resume): JSON 기반 template renderer 전환"
```
