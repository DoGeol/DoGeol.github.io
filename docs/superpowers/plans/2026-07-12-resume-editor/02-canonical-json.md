# Task 2: 기준 JSON 이관과 asset 검증

**Parent plan:** [Resume Editor Implementation Plan](../2026-07-12-resume-editor.md)

**Deliverable:** 현재 TypeScript 상수의 모든 값을 strict canonical JSON으로 무손실 이관하고 public asset 누락을 build 전에 실패시킨다. `/resume`은 Task 3 전까지 기존 상수를 사용한다.

**Files:**

- Create: `src/app/(pages)/resume/_data/resume.json`
- Create: `src/app/(pages)/resume/_model/resume-data.ts`
- Create: `src/app/(pages)/resume/_model/resume-data.test.ts`
- Create: `scripts/check-resume-assets.mjs`
- Create: `scripts/check-resume-assets.test.ts`
- Temporary then delete: `scripts/migrate-resume-json.mts`
- Modify: `src/app/(pages)/resume/_infos/*.ts`
- Modify: `package.json`

**Interfaces:**

- Consumes: Task 1 schemas/types and current seven `_infos` modules
- Produces: `canonicalResumeData`, `getCanonicalResumeData()`
- Produces: `collectResumeAssetPaths()` and `assertResumeAssets(repositoryRoot, resume)`
- Constraint: generated JSON은 2칸 들여쓰기, UTF-8, 마지막 newline을 사용한다.

- [ ] **Step 1: migration 대상 import를 Node에서 안전하게 만든다**

일곱 `_infos/*.ts`의 interface import를 runtime import가 아닌 `import type`으로 바꾼다.

```ts
import type { IExperience } from '@/app/(pages)/resume/_components/experience/types'
```

Run: `pnpm typecheck`

Expected: PASS, public runtime과 렌더링 변화 없음.

- [ ] **Step 2: one-shot deterministic migration script를 작성한다**

`scripts/migrate-resume-json.mts`는 아래 relative `.ts` modules의 default export와 `SKILLS`를 import한다.

- `_infos/information`, `introduce`, `experience`, `projects`, `education`, `activity`, `license`
- `_components/common/skill.ts`
- `_model/resume-schema.ts`의 `resumeSchema`

Repo root/output을 `import.meta.url`로 계산하고 다음 helper를 사용한다.

```ts
const normalizeDate = (value: string) => value.replaceAll('.', '-')
const output = path.join(root, 'src/app/(pages)/resume/_data/resume.json')
const persistentId = (kind: string, ...indexes: number[]) =>
  `${kind}-${indexes.map((index) => index + 1).join('-')}`
```

Root mapping은 정확히 다음이다.

```ts
const resume = {
  schemaVersion: 1,
  templateId: 'classic',
  metadata: {
    title: 'Resume 편도걸',
    socialTitle: '프론트엔드 개발자 편도걸 이력서',
    description: '안녕하세요, 6년차 프론트엔드 개발자 편도걸 입니다.',
  },
  assets: {
    profileFront: '/profile/pdg-real.webp',
    profileBack: '/profile/pdg-profile.webp',
  },
  skillCatalog: SKILLS.map(({ name, type }) => ({ id: name, label: name, category: type })),
  sections: [
    informationSection,
    introduceSection,
    experienceSection,
    projectsSection,
    educationSection,
    activitySection,
    licensesSection,
  ],
}
```

Section mapping table:

| Target | Source mapping |
| --- | --- |
| information | ID `section-information`, `visible=isShow`, hardcoded safe headline `안녕하세요.\n프론트엔드 개발자 **편도걸**입니다.`, contact ID `contact-${source.id}`, `type/name→label/url→value/target` |
| introduce | ID `section-introduce`, `visible=isShow`, each `textList` row→`{ id: paragraph-{n}, text }`, normalized `latestUpdatedDate→updatedAt` |
| experience | ID `section-experience`, `isUsedTotalPeriod→showTotalPeriod`, item ID `experience-{n}`, logo path, summary rows→`service-summary-{company}-{row}`/`experience-summary-{company}-{row}` text items |
| history | ID `history-{company}-{history}`, normalized period/null end, working row→`history-work-{company}-{history}-{row}` text item, skill→`history-skill-{company}-{history}-{row}` reference |
| projects | ID `section-projects`, item ID `project-{n}`, normalized month/null end, work ID `project-work-{project}-{work}`, detail→`project-detail-{project}-{work}-{row}` text item |
| education | ID `section-education`, ID `education-{n}`, `title→school`, normalized months, `isGraduate→graduated`, other fields unchanged |
| activity | ID `section-activity`, ID `activity-{n}`, normalized months, other fields unchanged |
| licenses | ID `section-licenses`, ID `license-{n}`, `date→acquiredAt` normalized, other fields unchanged |

Employment mapping은 `retire→retired`, `recommended_retire→recommended-retired`, `employed→employed`다. 모든 section은 source `isShow`를 `visible`로 쓴다. Script 마지막에 `resumeSchema.parse(resume)`를 실행한 뒤에만 아래처럼 쓴다.

```ts
await mkdir(path.dirname(output), { recursive: true })
await writeFile(output, `${JSON.stringify(resumeSchema.parse(resume), null, 2)}\n`, 'utf8')
```

Run: `node --experimental-strip-types scripts/migrate-resume-json.mts`

Expected: JSON 생성 후 script를 삭제한다. `git diff`로 기존 text가 모두 포함됐는지 확인한다.

- [ ] **Step 3: canonical loader의 실패 test를 작성한다**

```ts
expect(canonicalResumeData.sections.map(({ type }) => type)).toEqual([
  'information',
  'introduce',
  'experience',
  'projects',
  'education',
  'activity',
  'licenses',
])
expect(
  canonicalResumeData.sections.find((section) => section.type === 'experience')?.data.items,
).toHaveLength(5)
expect(
  canonicalResumeData.sections.find((section) => section.type === 'projects')?.data.items,
).toHaveLength(9)
expect(
  canonicalResumeData.sections.find((section) => section.type === 'education')?.data.items,
).toHaveLength(1)
expect(
  canonicalResumeData.sections.find((section) => section.type === 'activity')?.data.items,
).toHaveLength(1)
expect(
  canonicalResumeData.sections.find((section) => section.type === 'licenses')?.data.items,
).toHaveLength(2)
expect(canonicalResumeData.skillCatalog).toHaveLength(57)

const first = getCanonicalResumeData()
first.metadata.title = '변경'
expect(getCanonicalResumeData().metadata.title).toBe('Resume 편도걸')
```

Contact 두 개, 회사/프로젝트 첫·마지막 title, 숨겨진 education, 빈 activity/project optional summary도 sentinel assertion으로 추가한다.

Run: `pnpm vitest run 'src/app/(pages)/resume/_model/resume-data.test.ts'`

Expected: FAIL because loader does not exist.

- [ ] **Step 4: parse-on-import loader를 구현한다**

```ts
import rawResume from '@/app/(pages)/resume/_data/resume.json'
import { resumeSchema, type ResumeData } from './resume-schema'

export const canonicalResumeData: ResumeData = resumeSchema.parse(rawResume)
export const getCanonicalResumeData = (): ResumeData => structuredClone(canonicalResumeData)
```

Run: `pnpm vitest run 'src/app/(pages)/resume/_model/resume-data.test.ts'`

Expected: PASS. Invalid canonical JSON은 module load/build 자체를 실패시킨다.

- [ ] **Step 5: 실패하는 asset validator test를 작성한다**

Temporary repository root 아래 `public/profile/front.webp`만 만든 fixture로 검증한다.

```ts
expect(collectResumeAssetPaths(fixture)).toEqual([
  '/profile/front.webp',
  '/profile/back.webp',
  '/company/logo/company.webp',
])
expect(() => assertResumeAssets(tempRoot, fixture)).toThrow(/profile\/back\.webp/)
```

추가 case: 모든 파일 존재, `../` traversal, absolute filesystem path, duplicate URL dedupe, 누락 파일 여러 개를 한 오류로 보고.

Run: `pnpm vitest run scripts/check-resume-assets.test.ts`

Expected: FAIL because validator does not exist.

- [ ] **Step 6: asset validator와 CLI를 구현한다**

`collectResumeAssetPaths`는 root profile 두 개와 experience `logoPath`를 입력 순서대로 수집하고 중복을 제거한다. `assertResumeAssets`는 각 값이 root-relative인지 확인하고 다음 경로가 `publicRoot` 내부인지 검사한다.

```js
const publicRoot = path.resolve(repositoryRoot, 'public')
const candidate = path.resolve(publicRoot, assetPath.slice(1))
const isInside = candidate.startsWith(`${publicRoot}${path.sep}`)
```

CLI main은 repo의 canonical JSON을 `readFileSync`/`JSON.parse`로 읽고 현재 asset 전체를 검사한다. `import.meta.url` main guard로 test import 때 실행하지 않는다.

`package.json`을 갱신한다.

```json
{
  "check:resume-assets": "node scripts/check-resume-assets.mjs",
  "build": "pnpm check:resume-assets && next build"
}
```

- [ ] **Step 7: 전체 검증과 Task 2 commit을 수행한다**

```bash
pnpm vitest run scripts/check-resume-assets.test.ts 'src/app/(pages)/resume/_model/resume-data.test.ts'
pnpm check:resume-assets
pnpm test
git add package.json src/app/\(pages\)/resume/_data src/app/\(pages\)/resume/_model src/app/\(pages\)/resume/_infos scripts/check-resume-assets.mjs scripts/check-resume-assets.test.ts
git commit -m "feat(resume): 이력서 JSON 원본 추가"
```
