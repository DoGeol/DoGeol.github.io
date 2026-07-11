# 커스텀 컴포넌트 문서 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Accordion과 Input을 shadcn형 정보 구조로 탐색·미리보기·복사할 수 있는 정적 MDX 컴포넌트 카탈로그를 구축한다.

**Architecture:** 타입 manifest와 MDX loader가 정적 route를 만들고, build-time source allowlist와 Shiki가 실제 TSX source를 표시한다. Server Component는 콘텐츠와 highlighting을 담당하고 Client Component는 dialog, tab, clipboard 상호작용만 담당한다.

**Tech Stack:** Next.js 16.2.10, React 19.2.7, Tailwind CSS 4.3.2, @next/mdx 16.2.10, MDX 3.1.1, Shiki 4.3.1, Vitest, Testing Library, Playwright

## Global Constraints

- 기존 Accordion·Input source와 API를 변경하지 않는다.
- 기존 페이지 UI, route, screenshot과 `output: 'export'`를 유지한다.
- 검색, registry, CLI, Storybook, 신규 UI component를 추가하지 않는다.
- client state는 mobile dialog, preview tab, clipboard feedback에만 사용한다.
- 문서·route·sitemap·test를 같은 작업에서 갱신한다.

---

### Task 1: MDX 기반과 타입 카탈로그

**Files:** `package.json`, `pnpm-lock.yaml`, `next.config.mjs`, `mdx-components.tsx`, `src/features/component-docs/model/*`

**Interfaces:** `ComponentDoc`, `componentDocs`, `getComponentDoc`, `getAdjacentDocs`, `SourceId`, `readSource`

- [ ] manifest test에서 slug·section 중복, 두 문서 순서, unknown slug를 먼저 실패시킨다.
- [ ] `@next/mdx@16.2.10`, `@mdx-js/loader@3.1.1`, `@mdx-js/react@3.1.1`, `@types/mdx@2.0.14`, `shiki@4.3.1`을 설치한다.
- [ ] Next MDX wrapper와 `mdx-components.tsx`를 구성한다.
- [ ] Accordion·Input metadata와 MDX dynamic import를 가진 readonly manifest를 구현한다.
- [ ] source ID allowlist가 실제 component/example 경로만 읽도록 구현하고 path escape를 허용하지 않는다.
- [ ] manifest·source test와 frozen install을 통과시킨 뒤 `feat: MDX 컴포넌트 카탈로그 기반 추가`로 커밋한다.

### Task 2: 문서 셸과 반응형 탐색

**Files:** `src/app/(pages)/components/layout.tsx`, `page.tsx`, `src/features/component-docs/ui/navigation/*`, `globals.css`

**Interfaces:** `DocsHeader`, `DocsSidebar`, `MobileDocsNav`, `OnThisPage`, `ComponentCard`

- [ ] navigation test에서 current link, category, dialog open/close/Escape/focus 복귀를 먼저 실패시킨다.
- [ ] sticky header와 desktop 3열 layout, skip link, active navigation을 구현한다.
- [ ] mobile은 native `dialog`와 text Menu/Close button으로 sidebar를 제공한다.
- [ ] `/components` index에 소개와 Accordion·Input card를 구현한다.
- [ ] light/dark focus, border, prose, code theme styles를 현행 token으로 추가한다.
- [ ] UI test와 접근성 query를 통과시킨 뒤 `feat: 컴포넌트 문서 탐색 셸 추가`로 커밋한다.

### Task 3: Preview·source·copy primitives

**Files:** `src/features/component-docs/ui/code/*`, `src/features/component-docs/lib/highlight.ts`, example registry

**Interfaces:** `ComponentPreview({ sourceId, children })`, `SourceCode({ sourceIds })`, `CodeTabs`, `CopyButton`

- [ ] test에서 Preview/Code tab, clipboard success/failure, aria-live message를 먼저 실패시킨다.
- [ ] server wrapper가 allowlist source를 읽고 Shiki dual-theme HTML을 생성한다.
- [ ] client tabs는 preview/code만 전환하고 copy button은 code string만 clipboard에 쓴다.
- [ ] 실패 시 `복사 실패`, 성공 시 `복사됨`을 2초 동안 표시하며 code는 항상 선택 가능하게 둔다.
- [ ] component test를 통과시킨 뒤 `feat: 컴포넌트 미리보기와 소스 복사 추가`로 커밋한다.

### Task 4: Accordion·Input MDX 콘텐츠

**Files:** `_content/*.mdx`, `_examples/*.tsx`, `[slug]/page.tsx`

**Interfaces:** `generateStaticParams`, `generateMetadata`, `dynamicParams = false`, MDX section components

- [ ] static params·metadata·unknown slug test를 먼저 작성한다.
- [ ] dynamic page가 manifest MDX를 render하고 header, TOC, adjacent links를 조합하게 한다.
- [ ] Accordion basic/single/rounded 예제와 Usage·Props·Source·Known limitations를 작성한다.
- [ ] Input size/disabled/password/Enter 예제와 Usage·Props·Source·Known limitations를 작성한다.
- [ ] 실제 example file source가 Preview code에 표시되도록 source registry를 완성한다.
- [ ] content contract test와 build를 통과시킨 뒤 `feat: Accordion과 Input 문서 추가`로 커밋한다.

### Task 5: 라우트·Wiki·E2E 연결

**Files:** `public/sitemap.xml`, 프로젝트 Wiki, `tests/e2e/routes.spec.ts`

**Interfaces:** 세 공개 route와 새 component docs Playwright flow

- [ ] sitemap에 components index와 두 detail canonical URL을 추가한다.
- [ ] route, project structure, testing, development Wiki에 MDX 카탈로그와 추가 절차를 기록한다.
- [ ] E2E에 세 route heading, desktop sidebar navigation, mobile dialog navigation을 추가한다.
- [ ] `/components/accordion` desktop/mobile visual snapshot을 `@visual`로 추가한다.
- [ ] docs check, E2E CI, full visual E2E를 통과시킨 뒤 `test: 컴포넌트 문서 회귀 검증 추가`로 커밋한다.

### Task 6: 전체 검증과 전달

**Files:** 이 계획, ignored progress ledger

- [ ] `pnpm install --frozen-lockfile && pnpm docs:check && pnpm check`를 실행한다.
- [ ] `pnpm test:e2e:ci && pnpm test:e2e`를 실행한다.
- [ ] `out/components/index.html`, `accordion.html`, `input.html`과 기존 route HTML을 확인한다.
- [ ] `git diff --check`, 브랜치 diff, Wiki·manifest·MDX 계약을 최종 검토한다.
- [ ] 완료 체크박스와 검증 결과를 커밋하고 feature branch를 PR 가능한 상태로 둔다.
