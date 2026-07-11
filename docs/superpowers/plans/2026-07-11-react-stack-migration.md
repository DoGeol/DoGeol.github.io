# React Stack Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 현행 포트폴리오 디자인과 정적 라우트를 보존하면서 문서 하네스와 최신 React 스택을 구축한다.

**Architecture:** 루트 `AGENTS.md`는 짧은 라우터로 두고 세부 규칙과 Wiki를 `docs/`로 분리한다. 런타임은 Next.js App Router와 정적 export를 유지하며 pnpm, Flat Config, Vitest, Playwright를 하나의 검증 체계로 연결한다.

**Tech Stack:** Next.js 16.2.10, React 19.2.7, TypeScript 5.9.2, Tailwind CSS 4.3.2, Motion 12.42.2, ESLint 9.39.5, Vitest 4.1.10, Playwright 1.61.1

## Global Constraints

- `docs/agent/*.md`는 파일 전체를 Unicode code point 기준 300자 이하로 유지한다.
- 현행 `/`, `/blog`, `/resume`, `/old-resume`, 404의 UI·콘텐츠·라우트·정적 export를 보존한다.
- 일반 Wiki는 250줄 또는 12KB를 넘기기 전에 주제별로 분리하며 계획과 명세는 예외다.
- 설치 패키지는 현재 사용하거나 이번 검증에 필요한 항목으로 제한한다.
- 구현 완료 전 관련 Wiki와 계획 체크박스를 실제 상태에 맞게 갱신한다.
- 외부 쓰기와 배포는 수행하지 않는다.

---

### Task 1: 에이전트 라우터와 Wiki 기반 구축

**Files:**

- Create: `AGENTS.md`
- Create: `docs/README.md`
- Create: `docs/agent/workflow.md`
- Create: `docs/agent/harness.md`
- Create: `docs/agent/code.md`
- Create: `docs/agent/ui.md`
- Create: `docs/agent/wiki.md`
- Create: `docs/agent/verify.md`
- Create: `docs/explanation/architecture.md`
- Create: `docs/explanation/project-structure.md`
- Create: `docs/reference/routes.md`
- Create: `docs/reference/doc-map.md`
- Create: `docs/reference/adoption-matrix.md`
- Create: `docs/reference/stack/README.md`
- Create: `docs/reference/stack/core.md`
- Create: `docs/reference/stack/state-data.md`
- Create: `docs/reference/stack/forms-utilities.md`
- Create: `docs/reference/stack/testing.md`
- Create: `docs/reference/stack/optional.md`
- Create: `docs/how-to/development.md`
- Create: `docs/how-to/github-pages-deployment.md`
- Create: `docs/how-to/dependency-upgrade.md`
- Create: `docs/migrations/react-stack-2026.md`
- Modify: `README.md`
- Delete: `GEMINI.md`

**Interfaces:**

- Consumes: 승인된 설계 명세와 현재 저장소 구조
- Produces: Codex가 읽는 루트 라우터, 작업별 규칙, 사람이 탐색하는 Wiki

- [x] **Step 1: 루트 규칙과 300자 이하 세부 규칙을 작성한다**

`AGENTS.md`는 관련 문서를 읽으라는 명시적 링크만 유지한다. `docs/agent` 규칙은 workflow, harness, code, ui, wiki, verify 책임을 중복 없이 나눈다.

- [x] **Step 2: 프로젝트 구조와 기술 Wiki를 작성한다**

현재 `src/app`, `src/features`, `src/shared`, `public` 책임과 실제 라우트를 기록한다. 기술 카탈로그는 역할별 파일로 분리하고 각 패키지를 adopted, temporary, planned, deferred, removed 중 하나로 분류한다.

- [x] **Step 3: GEMINI.md 규칙을 이전하고 삭제한다**

App Router, Server Component 기본, strict TypeScript, kebab-case, Tailwind mobile-first, `img` 사용, Motion/CSS 구분, 검증 규칙만 유지한다. Next.js 15, Framer Motion, SWR, Atomic Design 강제, `mo:` 접두사 규칙은 폐기한다.

- [x] **Step 4: 문서 링크를 수동 검증한다**

Run: `find docs -type f -name '*.md' | sort`

Expected: 설계에 명시한 문서가 모두 출력되고 빈 문서가 없다.

- [x] **Step 5: 문서 기반 변경을 커밋한다**

```bash
git add AGENTS.md README.md docs GEMINI.md
git commit -m "docs: 에이전트 규칙과 프로젝트 위키 구축"
```

### Task 2: pnpm 단일화와 핵심 스택 업데이트

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `.nvmrc`
- Modify: `next.config.mjs`
- Modify: `tsconfig.json`
- Modify: `src/features/global-header/index.tsx`
- Delete: `package-lock.json`

**Interfaces:**

- Consumes: `docs/reference/adoption-matrix.md`의 adopted·temporary 목록
- Produces: 재현 가능한 pnpm 설치와 Next.js 16 런타임

- [x] **Step 1: package.json을 목표 버전과 검증 명령으로 갱신한다**

핵심 dependency는 Next.js 16.2.10, React 19.2.7, Day.js 1.11.21, Motion 12.42.2, next-themes 0.4.6을 사용한다. `immer`, `zustand`, `framer-motion`을 제거한다. `packageManager`는 실제 사용 pnpm 10 계열을 기록하고 Node 엔진은 jsdom 조건을 포함하도록 `>=22.13.0`으로 둔다. ESLint는 Next.js 하위 plugin peer 범위와 호환되는 9.39.5를 사용한다.

스크립트는 다음 책임을 제공한다.

```json
{
  "dev": "next dev",
  "build": "next build",
  "lint": "eslint . --max-warnings=0",
  "lint:fix": "eslint . --fix",
  "typecheck": "next typegen && tsc --noEmit",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "format": "prettier . --write --ignore-unknown",
  "format:check": "prettier . --check --ignore-unknown",
  "docs:check": "node scripts/check-docs.mjs",
  "check": "pnpm typecheck && pnpm lint && pnpm test && pnpm format:check && pnpm build"
}
```

- [x] **Step 2: package-lock.json을 제거하고 pnpm lockfile을 갱신한다**

Run: `pnpm install`

Expected: `pnpm-lock.yaml`이 새 버전을 해석하고 설치가 성공한다.

- [x] **Step 3: 깨끗한 설치를 검증한다**

Run: `pnpm install --frozen-lockfile`

Expected: lockfile 변경 없이 성공한다.

- [x] **Step 4: Motion import와 Next.js build를 검증한다**

`src/features/global-header/index.tsx`의 import를 `motion/react`로 바꾼다.

Run: `pnpm build`

Expected: Next.js 16.2.10으로 정적 export가 성공한다.

- [x] **Step 5: 핵심 스택 변경을 커밋한다**

```bash
git add package.json pnpm-lock.yaml package-lock.json .nvmrc next.config.mjs tsconfig.json src/features/global-header/index.tsx
git commit -m "chore: React 핵심 스택 업데이트"
```

### Task 3: ESLint Flat Config와 포맷 기준 정비

**Files:**

- Create: `eslint.config.mjs`
- Modify: `.prettierignore`
- Modify: `.prettierrc.js`
- Modify: `src/shared/ui/Accordion/Root.tsx`
- Delete: `.eslintrc.json`
- Format: existing supported source and documentation files

**Interfaces:**

- Consumes: Next.js 16과 ESLint 9 Flat Config
- Produces: `pnpm lint`, `pnpm format:check` 검증 명령

- [x] **Step 1: Next.js Flat Config를 작성한다**

`eslint-config-next/core-web-vitals`와 `eslint-config-next/typescript` 배열을 `defineConfig`로 결합하고 `.next`, `out`, `coverage`, worktree scratch 경로를 무시한다.

- [x] **Step 2: Prettier로 저장소를 일괄 포맷한다**

Run: `pnpm format`

Expected: 기존 18개 불일치 파일이 포맷되고 명령이 성공한다.

- [x] **Step 3: lint가 기존 Hook 경고를 실패로 처리하는지 확인한다**

Run: `pnpm lint`

Expected: Accordion Hook 의존성 경고 1건 때문에 `--max-warnings=0`으로 실패한다.

- [x] **Step 4: Accordion 타입과 effect 의존성을 최소 수정한다**

`any[]`를 `string[]`으로 바꾸고 `onChange`를 effect 의존성에 포함한다. 렌더링 markup과 기존 toggle 동작은 바꾸지 않는다.

- [x] **Step 5: lint와 format check를 다시 실행한다**

Run: `pnpm lint && pnpm format:check`

Expected: 경고와 포맷 오류 없이 성공한다.

- [ ] **Step 6: 도구 설정을 커밋한다**

```bash
git add -A eslint.config.mjs .eslintrc.json .prettierignore .prettierrc.js src
git commit -m "chore: lint와 format 검증 체계 전환"
```

### Task 4: Accordion 동작 테스트

**Files:**

- Create: `src/shared/ui/Accordion/Root.test.tsx`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Interfaces:**

- Consumes: `motion/react`, Vitest, Testing Library
- Produces: 기존 Accordion 동작을 고정하는 component 테스트

- [ ] **Step 1: Accordion onChange 회귀 테스트를 작성한다**

초기 values 전달과 item toggle 후 `onChange`가 현재 string 배열을 받는 테스트를 작성한다.

- [ ] **Step 2: 기존 Accordion 동작을 확인한다**

Run: `pnpm vitest run src/shared/ui/Accordion/Root.test.tsx`

Expected: 초기 values와 toggle callback 테스트가 통과한다.

- [ ] **Step 3: 단위 테스트와 lint를 검증한다**

Run: `pnpm vitest run src/shared/ui/Accordion/Root.test.tsx && pnpm lint`

Expected: 테스트와 lint가 경고 없이 성공한다.

- [ ] **Step 4: 코드 변경을 커밋한다**

```bash
git add src/features/global-header src/shared/ui/Accordion src/test vitest.config.ts
git commit -m "refactor: Motion과 Accordion 상태 처리 정비"
```

### Task 5: 문서 하네스 검사기를 TDD로 구현

**Files:**

- Create: `scripts/check-docs.test.ts`
- Create: `scripts/check-docs.mjs`
- Modify: `.gitignore`

**Interfaces:**

- Consumes: `AGENTS.md`, `docs/agent`, 일반 Wiki Markdown
- Produces: `checkDocs(root): DocCheckResult`와 `pnpm docs:check`

- [ ] **Step 1: 실패하는 문서 검사 테스트를 작성한다**

테스트 fixture를 임시 디렉터리에 만들고 다음을 검증한다.

```ts
expect(result.errors).toContainEqual(expect.stringContaining('300자'))
expect(result.errors).toContainEqual(expect.stringContaining('깨진 링크'))
expect(result.warnings).toContainEqual(expect.stringContaining('12KB'))
```

- [ ] **Step 2: 테스트 실패를 확인한다**

Run: `pnpm vitest run scripts/check-docs.test.ts`

Expected: `checkDocs` 모듈이 없어 실패한다.

- [ ] **Step 3: 최소 검사기를 구현한다**

`checkDocs(root)`는 에이전트 문서 Unicode 길이, 상대 Markdown 링크, 일반 Wiki 250줄·12KB soft limit을 검사한다. CLI 실행 시 오류가 있으면 exit code 1, 경고만 있으면 exit code 0을 반환한다.

- [ ] **Step 4: 테스트와 실제 문서를 검증한다**

Run: `pnpm vitest run scripts/check-docs.test.ts && pnpm docs:check`

Expected: 테스트가 통과하고 실제 문서에 오류가 없다.

- [ ] **Step 5: 진행 원장을 Git에서 제외한다**

`.gitignore`에 `/.superpowers/sdd/`를 추가하고 `.superpowers/sdd/progress.md`는 작업 복구용으로만 유지한다.

- [ ] **Step 6: 문서 검사기를 커밋한다**

```bash
git add scripts .gitignore package.json docs
git commit -m "test: 문서 하네스 검증 추가"
```

### Task 6: 핵심 로직 단위 테스트 추가

**Files:**

- Create: `src/app/(pages)/resume/_components/experience/utils.test.ts`
- Create: `src/features/highlighted-text/index.test.tsx`

**Interfaces:**

- Consumes: 현재 경력 계산과 강조 표시 API
- Produces: 마이그레이션 전후 동일 동작을 보장하는 단위 테스트

- [ ] **Step 1: 경력 기간 테스트를 작성한다**

종료일이 있는 단일 경력, 여러 회사 합산, 회사 표시 기간을 고정 날짜 fixture로 검증한다.

- [ ] **Step 2: 강조 표시 테스트를 작성한다**

`**텍스트**`가 strong으로 렌더링되고 일반 문자열이 그대로 유지되는지 검증한다.

- [ ] **Step 3: 단위 테스트를 실행한다**

Run: `pnpm test`

Expected: 모든 단위·컴포넌트 테스트가 성공한다.

- [ ] **Step 4: 테스트를 커밋한다**

```bash
git add src
git commit -m "test: 이력서 핵심 렌더링 회귀 검증 추가"
```

### Task 7: Playwright 라우트·시각 회귀 검증

**Files:**

- Create: `playwright.config.ts`
- Create: `tests/e2e/routes.spec.ts`
- Create: `tests/e2e/routes.spec.ts-snapshots/*`

**Interfaces:**

- Consumes: Next.js dev server와 정적 페이지 라우트
- Produces: desktop/mobile 라우트와 screenshot 기준선

- [ ] **Step 1: 주요 라우트 smoke test를 작성한다**

`/`, `/blog`, `/resume`, `/old-resume`, 존재하지 않는 경로를 열고 정상 heading 또는 404 문구를 확인한다.

- [ ] **Step 2: desktop과 mobile screenshot assertion을 추가한다**

`/resume`을 Chromium desktop과 mobile viewport에서 `toHaveScreenshot`으로 검증한다. animation을 비활성화하고 color scheme을 고정한다.

- [ ] **Step 3: Chromium을 설치하고 기준 screenshot을 생성한다**

Run: `pnpm exec playwright install chromium && pnpm test:e2e --update-snapshots`

Expected: 모든 route test가 통과하고 snapshot 파일이 생성된다.

- [ ] **Step 4: snapshot을 다시 검증한다**

Run: `pnpm test:e2e`

Expected: 갱신 없이 모든 E2E test가 통과한다.

- [ ] **Step 5: E2E 검증을 커밋한다**

```bash
git add playwright.config.ts tests package.json pnpm-lock.yaml
git commit -m "test: 주요 페이지 시각 회귀 검증 추가"
```

### Task 8: Wiki 최신화와 전체 완료 검증

**Files:**

- Modify: `docs/reference/adoption-matrix.md`
- Modify: `docs/reference/stack/*.md`
- Modify: `docs/explanation/project-structure.md`
- Modify: `docs/how-to/development.md`
- Modify: `docs/how-to/github-pages-deployment.md`
- Modify: `docs/migrations/react-stack-2026.md`
- Modify: this plan

**Interfaces:**

- Consumes: 실제 package manifest, source tree, test/build output
- Produces: 현재 코드와 일치하는 Wiki와 완료 증거

- [ ] **Step 1: 설치·보류·제거 상태를 실제 manifest와 대조한다**

Run: `pnpm list --depth 0`

Expected: Wiki의 adopted, temporary, deferred, removed 분류와 일치한다.

- [ ] **Step 2: 전체 검증을 실행한다**

Run: `pnpm docs:check && pnpm check && pnpm test:e2e`

Expected: 모든 명령이 exit code 0으로 끝난다.

- [ ] **Step 3: 정적 export 파일을 확인한다**

Run: `test -f out/index.html && test -f out/blog.html && test -f out/resume.html && test -f out/old-resume.html && test -f out/404.html`

Expected: 명령이 출력 없이 성공한다.

- [ ] **Step 4: 완료 문서를 갱신한다**

마이그레이션 문서에 최종 버전, 검증 명령, 기존 경고 해소 여부, 보류 항목을 기록한다. 이 계획의 완료된 단계 체크박스를 실제 상태대로 표시한다.

- [ ] **Step 5: 최종 문서 변경을 커밋한다**

```bash
git add docs
git commit -m "docs: React 스택 마이그레이션 결과 최신화"
```

- [ ] **Step 6: 전체 브랜치 차이를 검토한다**

Run: `git diff --check && git status --short && git log --oneline --decorate -12`

Expected: whitespace 오류가 없고 의도한 파일과 커밋만 표시된다.
