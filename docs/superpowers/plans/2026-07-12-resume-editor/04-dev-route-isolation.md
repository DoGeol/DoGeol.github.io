# Task 4: 개발 전용 route와 production 격리

**Parent plan:** [Resume Editor Implementation Plan](../2026-07-12-resume-editor.md)

**Deliverable:** `/resume-editor`와 `/resume-preview`가 `pnpm dev`에서만 열리고 production `out/`에는 route HTML, route 문자열과 marker가 전혀 남지 않는다.

**Files:**

- Modify: `next.config.mjs`
- Modify: `package.json`
- Create: `src/app/(dev)/resume-editor/page.dev.tsx`
- Create: `src/app/(dev)/resume-preview/page.dev.tsx`
- Create: `scripts/check-static-export.mjs`
- Create: `scripts/check-static-export.test.ts`

**Interfaces:**

- Consumes: `canonicalResumeData` and `ResumeDocument` from Tasks 2–3
- Produces: development-only `/resume-editor`, `/resume-preview`
- Produces: `collectForbiddenStaticExportFiles()` and `assertDevelopmentRoutesExcluded()`
- Marker: `resume-editor-dev-only-marker`는 dev route DOM에만 존재한다.
- Constraint: public layout, sitemap, navigation과 production page에서 dev route를 import하거나 link하지 않는다.

- [ ] **Step 1: 실패하는 static export 검사 test를 작성한다**

`scripts/check-static-export.test.ts`는 `mkdtemp`, `mkdir`, `writeFile`, `rm`으로 임시 `out` tree를 만들고 다음 세 case를 검증한다.

```ts
it('일반 public export를 허용한다', async () => {
  await writeExport('index.html', '<main>public</main>')
  expect(() => assertDevelopmentRoutesExcluded(tempRoot)).not.toThrow()
})

it.each([
  ['resume-editor.html', '<main>editor</main>'],
  ['_next/static/chunks/editor.js', 'resume-editor-dev-only-marker'],
  ['_next/static/chunks/shared.js', 'resume-editor-client-only-marker'],
])('%s에 dev 산출물이 있으면 거부한다', async (file, content) => {
  await writeExport(file, content)
  expect(() => assertDevelopmentRoutesExcluded(tempRoot)).toThrow(/development-only/i)
})
```

Run: `pnpm vitest run scripts/check-static-export.test.ts`

Expected: FAIL because `check-static-export.mjs` does not exist.

- [ ] **Step 2: 검사 가능한 production 격리 script를 구현한다**

`check-static-export.mjs`는 `out/`을 재귀 순회해 모든 regular file의 상대 경로를 검사한다. Content 검색은 `.html`, `.js`, `.css`, `.json`, `.txt`, `.xml`만 UTF-8로 읽고 아래 token이 있으면 모든 위반을 한 오류로 보고한다.

<!-- prettier-ignore -->
```js
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const forbiddenTokens = [
  'resume-editor', 'resume-preview', 'resume-editor-dev-only-marker',
  'resume-editor-client-only-marker', 'resume-editor:draft:v1', 'PREVIEW_READY',
]
const textExtensions = new Set(['.html', '.js', '.css', '.json', '.txt', '.xml'])

const listFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const absolute = path.join(directory, entry.name)
  return entry.isDirectory() ? listFiles(absolute) : entry.isFile() ? [absolute] : []
})

export const collectForbiddenStaticExportFiles = (outputDirectory) => {
  if (!existsSync(outputDirectory)) throw new Error(`정적 export가 없습니다: ${outputDirectory}`)
  return listFiles(outputDirectory).flatMap((file) => {
    const relative = path.relative(outputDirectory, file).split(path.sep).join('/')
    const content = textExtensions.has(path.extname(file)) ? readFileSync(file, 'utf8') : ''
    return forbiddenTokens
      .filter((token) => relative.includes(token) || content.includes(token))
      .map((token) => ({ file: relative, token }))
  })
}

export const assertDevelopmentRoutesExcluded = (outputDirectory) => {
  const violations = collectForbiddenStaticExportFiles(outputDirectory)
  if (violations.length === 0) return
  const details = violations.map(({ file, token }) => `- ${file}: ${token}`).join('\n')
  throw new Error(`Development-only 산출물이 포함되었습니다:\n${details}`)
}

const isMain = process.argv[1]
  ? import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
  : false
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  assertDevelopmentRoutesExcluded(path.join(root, 'out'))
  console.log('Development-only static export 검사 통과')
}
```

Run: `pnpm vitest run scripts/check-static-export.test.ts`

Expected: PASS.

- [ ] **Step 3: Next development phase에서만 `.dev.tsx`를 page extension으로 등록한다**

`next.config.mjs`를 config factory로 바꾼다.

```js
import createMDX from '@next/mdx'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

const basePageExtensions = ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']
const withMDX = createMDX()

export default (phase) =>
  withMDX({
    output: 'export',
    pageExtensions:
      phase === PHASE_DEVELOPMENT_SERVER ? ['dev.tsx', ...basePageExtensions] : basePageExtensions,
  })
```

`page.dev.tsx` 이외 파일에 `dev.tsx` suffix를 사용하지 않는다. `next typegen`과 production build는 두 route를 인식하지 않아야 한다.

- [ ] **Step 4: 최소 dev route entry를 만든다**

Editor route는 이후 task가 교체할 명확한 shell과 marker를 제공한다.

```tsx
export default function ResumeEditorPage() {
  return (
    <main data-testid="resume-editor-dev-only-marker">
      <h1>이력서 편집기</h1>
    </main>
  )
}
```

Preview route는 처음부터 public renderer를 사용해 integration 경계를 확인한다.

```tsx
import { canonicalResumeData } from '@/app/(pages)/resume/_model/resume-data'
import { ResumeDocument } from '@/app/(pages)/resume/_templates/registry'

export default function ResumePreviewPage() {
  return <ResumeDocument resume={canonicalResumeData} />
}
```

두 route에 `generateStaticParams`, metadata, public navigation entry를 추가하지 않는다.

- [ ] **Step 5: build contract에 격리 검사를 연결한다**

`package.json` scripts를 다음으로 변경한다.

```json
{
  "check:static-export": "node scripts/check-static-export.mjs",
  "build": "pnpm check:resume-assets && next build && pnpm check:static-export"
}
```

Run:

```bash
pnpm typecheck
pnpm build
```

Expected: build PASS, `out/` 검사 PASS. 다음 직접 확인도 모두 빈 결과여야 한다.

```bash
find out -iname '*resume-editor*' -o -iname '*resume-preview*'
rg -l 'resume-editor-dev-only-marker|resume-editor|resume-preview' out
```

- [ ] **Step 6: development route smoke test를 수행한다**

Run in terminal 1: `pnpm dev`

Run in terminal 2:

```bash
curl --fail http://localhost:3000/resume-editor
curl --fail http://localhost:3000/resume-preview
```

Expected: editor response에 `이력서 편집기`, preview response에 `Experience`가 있다. 기존 `/resume`도 200이다.

- [ ] **Step 7: Task 4를 커밋한다**

```bash
git add next.config.mjs package.json scripts/check-static-export.mjs scripts/check-static-export.test.ts src/app/\(dev\)
git commit -m "build(resume): 편집기 route를 개발 환경으로 격리"
```
