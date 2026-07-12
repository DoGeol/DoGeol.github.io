# Resume Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 `/resume` 출력은 그대로 유지하면서 개발 환경에서만 동작하는 구조화 이력서 편집기, 실제 viewport 프리뷰와 검증된 `resume.json` 내보내기를 구현한다.

**Architecture:** 기준 JSON을 Zod로 검증한 뒤 public page와 dev-only iframe preview가 같은 template renderer를 사용한다. React Hook Form이 편집 state를 단독 소유하고 dnd-kit 정렬, sessionStorage 초안, same-origin typed message protocol을 작은 경계로 연결한다. `page.dev.tsx`는 development phase에서만 route로 인식하며 production export 검사로 편집기 산출물 부재를 보장한다.

**Tech Stack:** Next.js 16.2.10 App Router static export, React 19.2.7, TypeScript 5.9 strict, Tailwind CSS 4.3.2, Zod 4.4.3, React Hook Form 7.81.0, Hook Form Resolvers 5.4.0, dnd-kit core 6.3.1/sortable 10.0.0/utilities 3.2.2, Vitest 4.1.10, Testing Library, Playwright 1.61.1

## Global Constraints

- `output: 'export'`, 현행 public route와 `/resume` 정적 출력을 유지한다.
- `/resume-editor`와 `/resume-preview`는 `next dev`에서만 존재하고 production `out/`에는 HTML·route·client code가 없어야 한다.
- Server Component를 기본으로 하고 editor, form, Drag & Drop, iframe message 경계만 Client Component로 둔다.
- TypeScript strict를 유지하고 `any`를 사용하지 않는다. 내부 import는 `@/`, 파일·폴더는 kebab-case를 사용한다.
- 화면 문구·주석·문서는 한국어가 기본이며 현행 Pretendard, primary blue, 반응형과 dark theme를 보존한다.
- 사용자 문자열은 일반 text, 줄바꿈과 `**강조**`만 허용하고 임의 HTML을 렌더링하지 않는다.
- 초안은 `sessionStorage`에만 저장하고 저장소 자동 쓰기, 이미지 업로드, Base64와 `contenteditable`은 구현하지 않는다.
- `resume.json`은 2칸 들여쓰기, UTF-8, 마지막 줄바꿈으로 export한다.
- 문단·요약·업무·상세와 skill reference를 포함한 모든 반복 row는 export되는 stable ID를 가진다.
- Drag & Drop은 pointer·touch·keyboard와 한국어 screen-reader announcement를 제공하고 reduced motion을 존중한다.
- 각 task는 red → green → 관련 회귀 검증 → 단일 conventional commit 순서를 지킨다.

---

## Working Location

- Worktree: `/Users/pdg/WebstormProjects/DoGeol.github.io/.worktrees/resume-editor`
- Branch: `codex/resume-editor`
- Approved design: `docs/superpowers/specs/2026-07-12-resume-editor-design.md`
- Baseline: Vitest 10 files, 25 tests passing before implementation

## File Ownership Map

### Canonical data and model

- `src/app/(pages)/resume/_data/resume.json`: 사용자가 최종 교체하는 유일한 콘텐츠 원본
- `src/app/(pages)/resume/_model/resume-schema.ts`: strict/draft schema와 모든 Resume type
- `src/app/(pages)/resume/_model/resume-data.ts`: JSON parse와 canonical data read API
- `src/app/(pages)/resume/_model/resume-region.ts`: template-neutral region renderer 계약
- `src/app/(pages)/resume/_model/*.test.ts`: schema, parse, region 계약 검증
- `scripts/check-resume-assets.mjs`: build 전 public asset 존재 검사
- `scripts/check-resume-assets.test.ts`: asset validator fixture 검증

### Public renderer

- `src/app/(pages)/resume/_templates/classic.tsx`: section 순서와 현행 template 조합
- `src/app/(pages)/resume/_templates/registry.tsx`: `templateId` → renderer registry
- `src/app/(pages)/resume/_templates/registry.test.tsx`: template 선택과 unknown 거부
- `src/app/(pages)/resume/_components/**`: canonical section data를 props로 렌더링
- `src/app/(pages)/resume/page.tsx`: parsed JSON metadata와 `ResumeDocument` 출력
- 삭제: `src/app/(pages)/resume/_infos/*.ts`, 중복 수동 type과 `SKILLS` 상수

### Development-only editor

- `src/app/(dev)/resume-editor/page.dev.tsx`: editor route의 Server Component entry
- `src/app/(dev)/resume-editor/_components/**`: toolbar, responsive shell, field와 section editor
- `src/app/(dev)/resume-editor/_model/draft-storage.ts`: session envelope read/write/clear
- `src/app/(dev)/resume-editor/_model/export-resume.ts`: strict validation과 JSON download
- `src/app/(dev)/resume-editor/_model/editor-region-index.ts`: stable ID → current form path
- `src/app/(dev)/resume-editor/_model/default-items.ts`: 새 반복 항목 factory
- `src/app/(dev)/resume-editor/_model/*.test.ts`: editor pure logic 검증
- `src/app/(dev)/resume-editor/_components/sortable/**`: accessible generic sortable primitive

### Development-only preview

- `src/app/(dev)/_shared/resume-preview-protocol.ts`: same-origin message schema와 parser
- `src/app/(dev)/_shared/resume-preview-protocol.test.ts`: origin/type/payload 거부 검증
- `src/app/(dev)/resume-preview/page.dev.tsx`: iframe route entry
- `src/app/(dev)/resume-preview/_components/resume-preview-runtime.tsx`: draft 수신과 selectable renderer
- `src/app/(dev)/resume-editor/_components/preview/**`: iframe, viewport toolbar와 scale 계산

### Build, E2E and docs

- `next.config.mjs`: development-only `dev.tsx` page extension
- `scripts/check-static-export.mjs`: dev route와 marker가 `out/`에 없는지 검사
- `scripts/check-static-export.test.ts`: 임시 export tree fixture 검증
- `tests/e2e/resume-editor.spec.ts`: desktop/mobile editor 흐름과 visual baseline
- `package.json`, `pnpm-lock.yaml`: 고정 dependency와 build contract
- `docs/how-to/development.md`: local editor 실행·JSON 교체 방법
- `docs/explanation/architecture.md`, `docs/explanation/project-structure.md`: 데이터·template·dev route 경계
- `docs/reference/stack/{state-data,forms-utilities,optional,testing}.md`: 도입 상태와 역할
- `docs/reference/adoption-matrix.md`: 신규 library adopted 상태

## Execution Order

1. [Task 1 — 스키마와 의존성](2026-07-12-resume-editor/01-schema-and-dependencies.md)
2. [Task 2 — 기준 JSON 이관과 asset 검증](2026-07-12-resume-editor/02-canonical-json.md)
3. [Task 3 — 공용 template renderer 전환](2026-07-12-resume-editor/03-public-renderer.md)
4. [Task 4 — 개발 전용 route와 production 격리](2026-07-12-resume-editor/04-dev-route-isolation.md)
5. [Task 5 — form, session과 export 기반](2026-07-12-resume-editor/05-editor-foundation.md)
6. [Task 6 — 전체 section editor](2026-07-12-resume-editor/06-section-editors.md)
7. [Task 7 — accessible Drag & Drop](2026-07-12-resume-editor/07-drag-and-drop.md)
8. [Task 8 — iframe 실제 프리뷰와 영역 선택](2026-07-12-resume-editor/08-iframe-preview.md)
9. [Task 9 — responsive E2E, 문서와 최종 검증](2026-07-12-resume-editor/09-final-verification.md)

각 task 문서는 해당 implementer가 다른 task 본문을 읽지 않아도 작업할 수 있도록 consumes/produces와 검증 명령을 반복해서 명시한다. 순서를 바꾸지 않는다. Task 3 전에는 기존 TypeScript 데이터가 public renderer의 source이고, Task 3 commit에서 JSON으로 전환하면서 `_infos`를 삭제한다. Task 4 이후에만 editor 코드를 추가한다.

## Review Gates

- Task 3: 기존 `/resume` desktop/mobile screenshot이 pixel threshold 안에서 변경되지 않아야 다음 단계로 간다.
- Task 4: production `out/` 격리 검사가 통과해야 editor 기능을 쌓는다.
- Task 6: 모든 section type과 반복 항목 add/delete/visible이 component test를 통과해야 DnD를 연결한다.
- Task 8: iframe 양방향 선택·수정 E2E가 통과해야 visual polish를 시작한다.
- Task 9: `pnpm docs:check`, `pnpm check`, `pnpm test:e2e`를 새 process에서 다시 실행한다.
