# GitHub Actions 품질 검사와 Pages 자동 배포 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PR과 `develop`에서 품질 검사를 실행하고 검증된 `main` 정적 export만 GitHub Pages에 자동 배포한다.

**Architecture:** 단일 GitHub Actions workflow의 `quality` job이 frozen install, 문서·코드·빌드·route 검증과 Pages artifact 생성을 담당한다. `deploy` job은 main의 push 또는 수동 실행에서만 `quality` 성공 후 공식 Pages Action으로 artifact를 게시한다.

**Tech Stack:** GitHub Actions, GitHub Pages, Node.js 22, pnpm 10.28.2, Next.js 16, Vitest, Playwright, actionlint, Dependabot

## Global Constraints

- 공개 저장소의 표준 `ubuntu-latest` runner만 사용한다.
- PR과 `develop`은 배포하지 않고 품질 검사만 실행한다.
- `main`의 push와 `main`에서 시작한 workflow dispatch만 배포한다.
- workflow 기본 권한은 `contents: read`이며 배포 job에만 `pages: write`, `id-token: write`를 부여한다.
- macOS screenshot 기준선은 로컬 `pnpm test:e2e`에서 유지하고 Linux CI에서는 `@visual` 테스트만 제외한다.
- Action은 2026-07-11 안정 release commit SHA로 고정한다.
- 현행 UI, route, `output: 'export'` 결과를 변경하지 않는다.

---

### Task 1: CI용 Playwright 계약과 legacy 배포 의존성 정리

**Files:**

- Create: `scripts/ci-contract.test.ts`
- Modify: `tests/e2e/routes.spec.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: 기존 `pnpm test:e2e`, `/resume` screenshot test, pnpm manifest
- Produces: `pnpm test:e2e:ci`, `@visual` tag, legacy `gh-pages`가 없는 manifest

- [x] **Step 1: CI script와 visual tag 계약 테스트를 작성한다**

`scripts/ci-contract.test.ts`를 다음 내용으로 만든다.

```ts
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const routesSpec = readFileSync(path.join(root, 'tests/e2e/routes.spec.ts'), 'utf8')

describe('CI contract', () => {
  it('Linux CI에서는 visual screenshot test만 제외한다', () => {
    expect(packageJson.scripts['test:e2e:ci']).toBe('playwright test --grep-invert @visual')
    expect(routesSpec).toContain("test('/resume 현행 디자인을 유지한다 @visual'")
  })

  it('legacy gh-pages 배포 계약을 사용하지 않는다', () => {
    expect(packageJson.scripts).not.toHaveProperty('predeploy')
    expect(packageJson.scripts).not.toHaveProperty('deploy')
    expect(packageJson.devDependencies).not.toHaveProperty('gh-pages')
  })
})
```

- [x] **Step 2: 계약 테스트가 실패하는지 확인한다**

Run: `pnpm test scripts/ci-contract.test.ts`

Expected: `test:e2e:ci`가 없고 기존 deploy script와 `gh-pages`가 있어 2개 테스트가 실패한다.

- [x] **Step 3: E2E CI script와 visual tag를 추가한다**

`package.json` scripts에 아래 항목을 추가하고 `predeploy`, `deploy`를 삭제한다.

```json
"test:e2e:ci": "playwright test --grep-invert @visual"
```

`tests/e2e/routes.spec.ts`의 screenshot test 이름을 다음처럼 변경한다.

```ts
test('/resume 현행 디자인을 유지한다 @visual', async ({ page }) => {
```

- [x] **Step 4: legacy dependency와 lockfile을 제거한다**

Run: `pnpm remove -D gh-pages`

Expected: `package.json` devDependencies와 `pnpm-lock.yaml`에서 `gh-pages` 및 전용 하위 dependency가 제거된다.

- [x] **Step 5: 계약과 두 E2E 경로를 검증한다**

Run: `pnpm test scripts/ci-contract.test.ts && pnpm test:e2e:ci && pnpm test:e2e`

Expected: 계약 2개, CI route 10개, 전체 E2E 12개가 성공한다.

- [x] **Step 6: CI 실행 계약을 커밋한다**

```bash
git add package.json pnpm-lock.yaml tests/e2e/routes.spec.ts scripts/ci-contract.test.ts
git commit -m "test: CI용 Playwright 검증 경로 분리"
```

---

### Task 2: 품질 검사와 Pages 배포 workflow 구축

**Files:**

- Modify: `scripts/ci-contract.test.ts`
- Create: `.github/workflows/quality-and-deploy.yml`

**Interfaces:**

- Consumes: Task 1의 `pnpm test:e2e:ci`, `pnpm check`, Next.js `out/`
- Produces: `quality` job, main 전용 `deploy` job, `github-pages` artifact

- [ ] **Step 1: workflow 구조 계약 테스트를 추가한다**

`scripts/ci-contract.test.ts`에 다음 테스트를 추가한다.

```ts
it('main 배포를 quality 성공과 공식 Pages Actions로 제한한다', () => {
  const workflow = readFileSync(path.join(root, '.github/workflows/quality-and-deploy.yml'), 'utf8')

  expect(workflow).toContain('pull_request:')
  expect(workflow).toContain('branches: [main, develop]')
  expect(workflow).toContain('pnpm test:e2e:ci')
  expect(workflow).toContain('needs: quality')
  expect(workflow).toContain("github.ref == 'refs/heads/main'")
  expect(workflow).toContain('pages: write')
  expect(workflow).toContain('id-token: write')
  expect(workflow).toContain('path: ./out')
  expect(workflow).not.toMatch(/uses: [^\n]+@v\d/)
})
```

- [ ] **Step 2: workflow 파일 부재로 테스트가 실패하는지 확인한다**

Run: `pnpm test scripts/ci-contract.test.ts`

Expected: `.github/workflows/quality-and-deploy.yml`을 읽지 못해 실패한다.

- [ ] **Step 3: 품질 검사와 배포 workflow를 작성한다**

`.github/workflows/quality-and-deploy.yml`을 다음 내용으로 만든다.

```yaml
name: Quality and Deploy

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}

jobs:
  quality:
    name: Quality
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - name: Checkout
        uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
      - name: Set up pnpm
        uses: pnpm/action-setup@0ebf47130e4866e96fce0953f49152a61190b271 # v6.0.9
      - name: Set up Node.js
        uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Check documentation
        run: pnpm docs:check
      - name: Check code and build
        run: pnpm check
      - name: Install Chromium
        run: pnpm exec playwright install --with-deps chromium
      - name: Run route E2E tests
        run: pnpm test:e2e:ci
      - name: Verify static export
        if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
        run: >-
          test -f out/index.html && test -f out/blog.html && test -f out/resume.html && test -f out/old-resume.html && test -f out/404.html
      - name: Configure Pages
        if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
        uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6.0.0
      - name: Upload Pages artifact
        if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
        uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5.0.0
        with:
          path: ./out

  deploy:
    name: Deploy
    if: >-
      github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch')
    needs: quality
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 # v5.0.0
```

- [ ] **Step 4: 계약 테스트와 workflow 구문을 검증한다**

Run: `pnpm test scripts/ci-contract.test.ts`

Expected: 3개 계약 테스트가 성공한다.

Run: `command -v actionlint >/dev/null || brew install actionlint; actionlint .github/workflows/quality-and-deploy.yml`

Expected: actionlint 1.7.12가 출력 없이 성공한다.

- [ ] **Step 5: workflow를 커밋한다**

```bash
git add .github/workflows/quality-and-deploy.yml scripts/ci-contract.test.ts
git commit -m "ci: 품질 검사와 Pages 자동 배포 추가"
```

---

### Task 3: Action 업데이트와 운영 Wiki 구성

**Files:**

- Create: `.github/dependabot.yml`
- Modify: `docs/how-to/development.md`
- Modify: `docs/how-to/github-pages-deployment.md`
- Modify: `docs/reference/doc-map.md`
- Modify: `docs/reference/stack/testing.md`
- Modify: this plan

**Interfaces:**

- Consumes: Task 2 workflow 이름과 trigger, Task 1 E2E script
- Produces: 주간 Action 업데이트와 개발·배포 운영 절차

- [ ] **Step 1: Dependabot 설정을 작성한다**

`.github/dependabot.yml`을 다음 내용으로 만든다.

```yaml
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: '09:00'
      timezone: Asia/Seoul
    groups:
      github-actions:
        patterns:
          - '*'
    open-pull-requests-limit: 5
```

- [ ] **Step 2: 개발 가이드에 CI 검증 경계를 기록한다**

`docs/how-to/development.md`의 검증 절에 다음 내용을 반영한다.

```markdown
`pnpm test:e2e:ci`는 Linux CI에서 macOS screenshot을 제외한 route 10개를 검증한다. 현행 디자인 기준선까지 확인하려면 macOS에서 `pnpm test:e2e`를 실행한다.
```

- [ ] **Step 3: 배포 가이드를 Actions 방식으로 교체한다**

`docs/how-to/github-pages-deployment.md`에 아래 계약을 기록한다.

```markdown
- PR과 `develop` push는 `Quality` job만 실행한다.
- `main` push는 `Quality` 성공 후 `Deploy` job이 `out/`을 게시한다.
- 재배포는 Actions의 `Quality and Deploy` workflow에서 `main`을 선택해 수동 실행한다.
- 실패 시 실패 job의 log를 확인하고 같은 commit을 재실행한다.
```

로컬 `pnpm deploy`와 `gh-pages` 브랜치 게시 설명은 제거한다.

- [ ] **Step 4: 문서 연결과 테스트 참조를 갱신한다**

`docs/reference/doc-map.md`에서 workflow 변경 시 `development.md`, `github-pages-deployment.md`, `stack/testing.md`를 확인하도록 명시한다. `docs/reference/stack/testing.md`에는 `test:e2e:ci`가 visual test만 제외한다는 내용을 추가한다.

- [ ] **Step 5: YAML과 문서를 검증한다**

Run: `actionlint .github/workflows/quality-and-deploy.yml && pnpm docs:check && pnpm format:check`

Expected: workflow 오류, 깨진 문서 링크, format 불일치 없이 성공한다.

- [ ] **Step 6: 운영 설정과 Wiki를 커밋한다**

```bash
git add .github/dependabot.yml docs
git commit -m "docs: Actions 배포 운영 절차 정리"
```

---

### Task 4: 로컬 전체 회귀 검증

**Files:**

- Modify: this plan
- Modify: `.superpowers/sdd/progress.md` (ignored recovery ledger)

**Interfaces:**

- Consumes: Task 1~3의 manifest, workflow, 문서
- Produces: 원격 반영 전에 검증된 feature branch

- [ ] **Step 1: frozen install을 확인한다**

Run: `pnpm install --frozen-lockfile`

Expected: lockfile 변경 없이 exit code 0으로 끝난다.

- [ ] **Step 2: 전체 문서·코드·빌드 검증을 실행한다**

Run: `pnpm docs:check && pnpm check`

Expected: 문서 검사, typecheck, lint, 단위 테스트, format, 정적 build가 성공한다.

- [ ] **Step 3: CI와 로컬 E2E를 모두 실행한다**

Run: `pnpm test:e2e:ci && pnpm test:e2e`

Expected: CI route 10개와 전체 desktop/mobile 12개가 성공한다.

- [ ] **Step 4: workflow와 정적 export를 확인한다**

Run: `actionlint .github/workflows/quality-and-deploy.yml && test -f out/index.html && test -f out/blog.html && test -f out/resume.html && test -f out/old-resume.html && test -f out/404.html`

Expected: 출력 없이 성공한다.

- [ ] **Step 5: 로컬 검증 결과를 커밋한다**

```bash
git add docs/superpowers/plans/2026-07-11-github-actions-pages.md
git commit -m "docs: Actions 로컬 검증 결과 기록"
```

- [ ] **Step 6: 브랜치 차이를 검토한다**

Run: `git diff --check develop...HEAD && git status --short && git log --oneline --decorate develop..HEAD`

Expected: whitespace 오류와 미커밋 파일이 없고 설계·계약·workflow·문서 커밋만 표시된다.

---

### Task 5: 원격 CI와 Pages 자동 배포 전환

**Files:**

- External: GitHub PR `codex/github-actions-pages` → `develop`
- External: GitHub PR `develop` → `main`
- External: repository Pages setting
- External: `https://dogeol.github.io/`

**Interfaces:**

- Consumes: Task 4에서 검증한 branch와 GitHub Actions workflow
- Produces: 성공한 PR quality check, workflow Pages source, 배포된 main site

- [ ] **Step 1: feature branch를 push하고 develop PR을 만든다**

```bash
git push -u origin codex/github-actions-pages
gh pr create \
  --base develop \
  --head codex/github-actions-pages \
  --title "ci: GitHub Pages 자동 배포 구축" \
  --body "## 변경\n- PR과 develop 품질 검사\n- main 검증 후 Pages 자동 배포\n- Actions 업데이트와 운영 Wiki\n\n## 검증\n- pnpm docs:check\n- pnpm check\n- pnpm test:e2e:ci\n- pnpm test:e2e\n- actionlint"
```

Expected: develop 대상 PR URL이 반환된다.

- [ ] **Step 2: PR quality check를 확인한다**

Run: `gh pr checks --watch --fail-fast`

Expected: `Quality` check가 성공한다. 실패하면 log를 확인해 feature branch에서 수정하고 다시 검증한다.

- [ ] **Step 3: feature PR을 develop에 병합한다**

Run: `gh pr merge --merge`

Expected: PR이 merged 상태가 되고 원격 feature branch가 삭제된다.

- [ ] **Step 4: develop의 push quality를 확인한다**

```bash
RUN_ID=$(gh run list --workflow "Quality and Deploy" --branch develop --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN_ID" --exit-status
```

Expected: develop push의 `Quality`가 성공하고 `Deploy`는 skip된다.

- [ ] **Step 5: develop에서 main으로 승격할 PR을 만든다**

```bash
gh pr create \
  --base main \
  --head develop \
  --title "chore: React 스택 마이그레이션과 자동 배포 적용" \
  --body "## 변경\n- React 핵심 스택 마이그레이션\n- 프로젝트 Wiki와 검증 하네스\n- GitHub Actions 품질 검사와 Pages 자동 배포\n\n## 배포\nmain 병합 후 공식 Pages workflow가 정적 export를 자동 게시합니다."
```

Expected: main 대상 PR URL이 반환된다.

- [ ] **Step 6: main PR quality를 확인하고 Pages source를 전환한다**

Run: `gh pr checks --watch --fail-fast`

Expected: `Quality` check가 성공한다.

Run: `gh api --method PUT repos/DoGeol/DoGeol.github.io/pages -f build_type=workflow`

Expected: 오류 없이 Pages 게시 소스가 workflow로 바뀐다.

- [ ] **Step 7: main PR을 병합하고 배포 workflow를 확인한다**

```bash
gh pr merge --merge
RUN_ID=$(gh run list --workflow "Quality and Deploy" --branch main --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN_ID" --exit-status
```

Expected: main 실행의 `Quality`와 `Deploy`가 모두 성공한다.

- [ ] **Step 8: Pages 설정과 공개 사이트를 검증한다**

```bash
gh api repos/DoGeol/DoGeol.github.io/pages --jq '{build_type, status, html_url}'
curl --fail --silent --show-error --location https://dogeol.github.io/ >/dev/null
```

Expected: `build_type`은 `workflow`, `status`는 `built`, 사이트 응답은 HTTP 성공이다.

- [ ] **Step 9: 완료 결과를 Wiki와 계획에 기록한다**

메인 checkout의 `develop`에서 원격 병합을 받은 뒤 `docs/how-to/github-pages-deployment.md`에 아래 문장을 추가한다.

```markdown
2026-07-11에 main Actions의 `Quality`와 `Deploy` 성공, Pages `build_type: workflow`, 공개 URL 응답을 확인했다.
```

이 계획의 완료된 체크박스를 실제 상태대로 표시하고 다음 명령으로 기록한다.

```bash
git -C /Users/pdg/WebstormProjects/DoGeol.github.io pull --ff-only origin develop
git -C /Users/pdg/WebstormProjects/DoGeol.github.io add docs
git -C /Users/pdg/WebstormProjects/DoGeol.github.io commit -m "docs: Pages 자동 배포 검증 결과 기록"
git -C /Users/pdg/WebstormProjects/DoGeol.github.io push origin develop
```
