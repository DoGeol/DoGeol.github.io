# Task 1: 스키마와 의존성

**Parent plan:** [Resume Editor Implementation Plan](../2026-07-12-resume-editor.md)

**Deliverable:** 모든 후속 task가 공유하는 exact strict/draft Zod schema와 inferred TypeScript type이 테스트를 통과한다.

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/app/(pages)/resume/_model/resume-schema.ts`
- Create: `src/app/(pages)/resume/_model/resume-schema.test.ts`
- Create: `src/test/fixtures/resume.ts`

**Interfaces:**

- Produces: `resumeSchema`, `resumeDraftSchema`
- Produces: `ResumeData`, `ResumeDraft`, `ResumeSection`, `ResumeSectionType`
- Produces: all seven section types, `ResumeTextItem`, `ResumeSkillReference`, skill/template types
- Constraint: draft와 strict의 TypeScript shape는 같고, draft는 작성 중 빈 string을 보존한다.

- [ ] **Step 1: 검증된 버전으로 dependency를 설치한다**

```bash
pnpm add zod@4.4.3 react-hook-form@7.81.0 @hookform/resolvers@5.4.0 @dnd-kit/core@6.3.1 @dnd-kit/sortable@10.0.0 @dnd-kit/utilities@3.2.2
```

Expected: dependencies와 lockfile이 갱신되고 React 19/Node 22 peer warning이 없다.

- [ ] **Step 2: mutable valid fixture factory를 만든다**

`createResumeFixture(): ResumeDraft`는 호출마다 새 object를 반환한다. `as const` singleton은 mutation test를 readonly로 만들므로 사용하지 않는다. 아래 값과 모든 section type을 정확히 포함한다.

<!-- prettier-ignore -->
```ts
export const createResumeFixture = (): ResumeDraft => ({
  schemaVersion: 1,
  templateId: 'classic',
  metadata: { title: 'Resume 테스트', socialTitle: '개발자 테스트 이력서', description: '테스트 이력서입니다.' },
  assets: { profileFront: '/profile/pdg-real.webp', profileBack: '/profile/pdg-profile.webp' },
  skillCatalog: [{ id: 'typescript', label: 'TypeScript', category: 'frontend' }],
  sections: [
    {
      id: 'section-information', type: 'information', visible: true,
      data: {
        headline: '안녕하세요.\n개발자 **테스트**입니다.',
        contacts: [{ id: 'contact-email', type: 'email', label: '메일', value: 'test@example.com', target: '_self' }],
      },
    },
    {
      id: 'section-introduce', type: 'introduce', visible: true,
      data: { paragraphs: [{ id: 'paragraph-1', text: '소개' }], updatedAt: '2026-07-12' },
    },
    {
      id: 'section-experience', type: 'experience', visible: true,
      data: {
        showTotalPeriod: true,
        items: [
          {
            id: 'experience-1', companyName: '회사', logoPath: '/company/logo/laud.webp',
            serviceSummary: [{ id: 'service-summary-1', text: '서비스' }],
            experienceSummary: [{ id: 'experience-summary-1', text: '경험' }], employmentStatus: 'retired',
            histories: [
              {
                id: 'history-1', department: '개발팀', role: '개발자',
                startDate: '2024-01-01', endDate: '2024-12-31',
                works: [{ id: 'history-work-1', text: '업무' }],
                skills: [{ id: 'history-skill-1', skillId: 'typescript' }],
              },
            ],
          },
        ],
      },
    },
    {
      id: 'section-projects', type: 'projects', visible: true,
      data: {
        items: [
          {
            id: 'project-1', title: '프로젝트', startMonth: '2024-01', endMonth: '2024-02',
            companyName: '회사', summary: '요약',
            works: [{ id: 'project-work-1', title: '역할', details: [{ id: 'project-detail-1', text: '상세' }] }],
          },
        ],
      },
    },
    {
      id: 'section-education', type: 'education', visible: true,
      data: {
        items: [
          {
            id: 'education-1', school: '학교', startMonth: '2018-01', endMonth: '2020-01',
            graduated: true, major: '전공', summary: '요약',
          },
        ],
      },
    },
    {
      id: 'section-activity', type: 'activity', visible: true,
      data: {
        items: [{ id: 'activity-1', title: '활동', startMonth: '2020-01', endMonth: '2020-02', summary: '요약' }],
      },
    },
    {
      id: 'section-licenses', type: 'licenses', visible: true,
      data: {
        items: [{ id: 'license-1', title: '자격증', acquiredAt: '2020-06-26', issuer: '기관' }],
      },
    },
  ],
})
```

- [ ] **Step 3: 실패하는 schema test를 작성한다**

Array `find`와 explicit guard로 discriminated union을 좁혀 다음을 각각 독립 test로 작성한다.

```ts
expect(resumeSchema.parse(createResumeFixture())).toMatchObject({ schemaVersion: 1 })

const duplicate = createResumeFixture()
duplicate.sections[1] = structuredClone(duplicate.sections[0])
expect(() => resumeSchema.parse(duplicate)).toThrow(/section type.*중복|누락/i)

const reversed = createResumeFixture()
const experience = reversed.sections.find((section) => section.type === 'experience')
if (!experience) throw new Error('fixture experience section 누락')
experience.data.items[0].histories[0].endDate = '2023-12-31'
expect(() => resumeSchema.parse(reversed)).toThrow(/종료일/i)

const missingSkill = createResumeFixture()
const missingSkillExperience = missingSkill.sections.find(
  (section) => section.type === 'experience',
)
if (!missingSkillExperience) throw new Error('fixture experience section 누락')
missingSkillExperience.data.items[0].histories[0].skills[0].skillId = 'missing'
expect(() => resumeSchema.parse(missingSkill)).toThrow(/기술/i)

const blankDraft = createResumeFixture()
const blankExperience = blankDraft.sections.find((section) => section.type === 'experience')
if (!blankExperience) throw new Error('fixture experience section 누락')
blankExperience.data.items[0].companyName = ''
expect(resumeDraftSchema.parse(blankDraft)).toBeTruthy()
expect(() => resumeSchema.parse(blankDraft)).toThrow(/회사명/i)
```

추가 test: unknown template/extra key, global duplicate ID, missing section, invalid contact, non-root asset path, blank draft date, reversed month와 null end date.

Run: `pnpm vitest run 'src/app/(pages)/resume/_model/resume-schema.test.ts'`

Expected: FAIL because `resume-schema.ts` does not exist.

- [ ] **Step 4: exact primitive와 object shape를 구현한다**

모든 `z.object`는 `.strict()`로 unknown field를 거부한다. Primitive factory는 다음 계약을 사용한다.

```ts
const idSchema = z.string().trim().min(1)
const text = (strict: boolean, label: string) =>
  strict ? z.string().trim().min(1, `${label}을 입력해 주세요`) : z.string()
const optionalText = z.string()
const date = (strict: boolean) => (strict ? z.iso.date() : z.union([z.literal(''), z.iso.date()]))
const month = (strict: boolean) =>
  strict
    ? z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    : z.string().regex(/^(|\d{4}-(0[1-9]|1[0-2]))$/)
const assetPath = (strict: boolean) =>
  strict
    ? z
        .string()
        .trim()
        .regex(/^\/(?!\/)(?!.*\.\.).+/)
    : z.union([
        z.literal(''),
        z
          .string()
          .trim()
          .regex(/^\/(?!\/)(?!.*\.\.).+/),
      ])
```

Enums:

- template: `classic`
- section: `information|introduce|experience|projects|education|activity|licenses`
- skill category: `frontend|app|backend|devops|analysis|collaboration|etc`
- contact type: `email|tel|site|github`; target: `_self|_blank`
- employment: `retired|employed|recommended-retired`

Exact field shape (`[]` means an array, `?` is not used; all keys exist):

| Object | Fields |
| --- | --- |
| root | `schemaVersion: 1`, `templateId`, `metadata`, `assets`, `skillCatalog[]`, `sections[7]` |
| metadata | `title`, `socialTitle`, `description` text |
| assets | `profileFront`, `profileBack` asset path |
| skill | `id`, `label`, `category` |
| information | `headline`, contacts `{ id,type,label,value,target }[]` |
| text item | `id,text`; paragraphs, summaries, works와 details에서 재사용 |
| skill reference | `id,skillId`; catalog stable ID를 참조 |
| introduce | `paragraphs: text item[]`, `updatedAt: date` |
| experience item | `id,companyName,logoPath,serviceSummary: text item[],experienceSummary: text item[],employmentStatus,histories[]` |
| history | `id,department,role,startDate,endDate: date | null,works: text item[],skills: skill reference[]` |
| project | `id,title,startMonth,endMonth: month | null,companyName: optionalText,summary: optionalText,works[]` |
| project work | `id,title,details: text item[]` |
| education | `id,school,startMonth,endMonth: month | null,graduated,major,summary` |
| activity | `id,title,startMonth,endMonth: month | null,summary: optionalText` |
| license | `id,title,acquiredAt,issuer` |

각 section object는 `id`, 해당 `z.literal` type, `visible`, `data`를 가지며 일곱 schema를 `z.discriminatedUnion('type', sectionSchemas)`로 결합한다. 모든 반복 가능한 text/skill row도 ID가 있는 object라서 예외 없이 stable React key와 DnD identity로 쓴다.

- [ ] **Step 5: root invariant와 inferred type을 구현한다**

Draft와 strict 모두 section type 일곱 개가 정확히 한 번씩 있고 모든 section/object item ID가 document 전체에서 unique인지 검사한다. Strict에서만 required text, skill reference, asset path, 일/월 시작≤종료를 검사한다. Contact value는 email=`z.email()`, tel=`^[+0-9][0-9 -]+$`, site/github=`http:` 또는 `https:` URL로 검증한다. 모든 issue는 실제 array path를 가진다.

```ts
export const resumeDraftSchema = createResumeSchema({ strict: false })
export const resumeSchema = createResumeSchema({ strict: true })
export type ResumeDraft = z.infer<typeof resumeDraftSchema>
export type ResumeData = z.infer<typeof resumeSchema>
export type ResumeSection = ResumeData['sections'][number]
export type ResumeSectionType = ResumeSection['type']
export type ResumeTemplateId = ResumeData['templateId']
export type SkillDefinition = ResumeData['skillCatalog'][number]
export type SkillCategory = SkillDefinition['category']
export type InformationSection = Extract<ResumeSection, { type: 'information' }>
export type IntroduceSection = Extract<ResumeSection, { type: 'introduce' }>
export type ExperienceSection = Extract<ResumeSection, { type: 'experience' }>
export type ProjectsSection = Extract<ResumeSection, { type: 'projects' }>
export type EducationSection = Extract<ResumeSection, { type: 'education' }>
export type ActivitySection = Extract<ResumeSection, { type: 'activity' }>
export type LicensesSection = Extract<ResumeSection, { type: 'licenses' }>
export type ResumeTextItem = IntroduceSection['data']['paragraphs'][number]
export type ResumeSkillReference =
  ExperienceSection['data']['items'][number]['histories'][number]['skills'][number]
```

- [ ] **Step 6: 검증과 Task 1 commit을 수행한다**

```bash
pnpm vitest run 'src/app/(pages)/resume/_model/resume-schema.test.ts'
pnpm typecheck
pnpm lint
git add package.json pnpm-lock.yaml src/app/\(pages\)/resume/_model src/test/fixtures/resume.ts
git commit -m "feat(resume): 이력서 데이터 스키마 추가"
```
