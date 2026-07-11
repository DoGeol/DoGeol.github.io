# React Stack Migration Design

## 목표

현행 포트폴리오의 화면, 라우트, 정적 export 결과를 유지하면서 핵심 React 스택을 최신 기준으로 이전한다. 저장소에는 짧은 `AGENTS.md` 라우터, 300자 이하 에이전트 규칙, Superpowers 진행 하네스, 코드와 함께 최신화되는 Markdown Wiki를 구축한다.

## 범위

- Next.js 16.2.10, React 19.2.7, Tailwind CSS 4.3.2로 업데이트한다.
- pnpm을 단일 패키지 관리자로 사용하고 `package-lock.json`을 제거한다.
- `framer-motion`을 `motion`으로 교체한다.
- 사용하지 않는 `immer`, `zustand`를 제거한다.
- `next-themes`는 현행 다크 테마를 위해 유지하고 0.4.6으로 업데이트한다.
- ESLint 9 Flat Config, Prettier, Vitest, Testing Library, Playwright를 구성한다. 기준 문서의 ESLint 10은 Next.js 하위 plugin의 peer 범위가 열릴 때까지 보류한다.
- 프로젝트 구조, 라우트, 기술 스택, 개발·배포 절차를 `docs/`에 기록한다.
- `GEMINI.md`의 유효한 규칙을 분리 문서로 이전한 뒤 삭제한다.

## 제외 범위

- 페이지 레이아웃, 색상, 타이포그래피, 콘텐츠를 재설계하지 않는다.
- Astryx, TanStack Query, nuqs, React Hook Form, Zod, MSW, dnd-kit, TanStack Table, TanStack Virtual, Recharts는 설치하지 않는다.
- `/old-resume` 제거, 폴더명 `infomation` 교정, SEO·접근성 전면 개선은 이번 마이그레이션에 포함하지 않는다.
- 실제 GitHub Wiki 저장소를 별도로 운영하지 않는다. 코드와 같은 Git 이력을 갖는 `docs/`를 Wiki 원본으로 사용한다.

## 에이전트 규칙 구조

루트 `AGENTS.md`는 프로젝트의 불변 조건과 관련 문서 링크만 담는다. `docs/agent/*.md`는 파일 전체를 Unicode code point 기준 300자 이하로 유지한다. Codex가 일반 Markdown을 자동 include하지 않으므로 루트 규칙에서 작업 전 관련 문서를 읽으라고 명시한다.

규칙은 `workflow`, `harness`, `code`, `ui`, `wiki`, `verify`로 분리한다. GPT-5.6 지침에 맞춰 같은 규칙을 반복하지 않고 목표, 권한 경계, 보존 조건, 완료 기준을 짧게 적는다.

## Superpowers 하네스

- 설계는 `docs/superpowers/specs/`에 저장한다.
- 구현 계획은 `docs/superpowers/plans/`에 저장하고 체크박스로 갱신한다.
- 세션 복구 상태는 `.superpowers/sdd/progress.md`에 기록하며 Git에 포함하지 않는다.
- 완료된 구현의 안정된 결과만 `docs/reference`, `docs/how-to`, `docs/explanation`에 반영한다.
- 진행 원장과 마이그레이션 계획은 현재 프로젝트 사실의 최종 기준으로 사용하지 않는다.

## Wiki 구조

`docs/README.md`를 진입점으로 사용한다. 설명은 `explanation`, 사실은 `reference`, 실행 절차는 `how-to`, 변경 이력은 `migrations`에 둔다. 기술 스택은 `reference/stack` 아래에서 core, state-data, forms-utilities, testing, optional 주제로 나눈다.

일반 Wiki 문서는 250줄, 12KB, H2 7개를 soft limit으로 사용한다. 인덱스의 한 범주에는 직접 링크를 7개 이하로 둔다. 내용은 복사하지 않고 기준 문서에 연결한다. 계획과 명세는 크기 제한 예외다.

## 최신화 전략

구조, 라우트, 기술 스택, 명령, 배포 방식이 바뀌면 같은 작업에서 관련 Wiki를 갱신한다. `docs/reference/doc-map.md`가 변경 경로와 확인할 문서를 연결한다. 문서 검사 스크립트는 에이전트 문서 길이, 링크, 일반 문서 크기, 필수 메타데이터를 검사한다.

현재 패키지 버전의 기준은 `package.json`과 `pnpm-lock.yaml`이다. Wiki는 설치 버전을 불필요하게 복제하지 않고 역할과 도입 상태를 설명한다. 외부 기술 카탈로그에는 검토일을 기록한다.

## 기준선

- `pnpm build`: 성공
- `pnpm exec tsc --noEmit`: 성공
- `pnpm lint`: 성공하지만 Accordion Hook 의존성 경고 1건
- `pnpm exec prettier . --check --ignore-unknown`: 18개 파일 불일치로 실패
- 테스트 스크립트와 CI workflow 없음

## 완료 조건

- `AGENTS.md`의 모든 링크가 유효하고 `docs/agent/*.md`가 300자 이하이다.
- `GEMINI.md`와 `package-lock.json`이 제거된다.
- `pnpm install --frozen-lockfile`이 성공한다.
- `pnpm check`가 lint, typecheck, unit test, format check, build를 모두 통과한다.
- Playwright가 `/`, `/blog`, `/resume`, `/old-resume`, 404를 검증한다.
- 정적 export 산출물과 현행 desktop/mobile UI가 유지된다.
- 구조·라우트·스택·개발·배포 Wiki가 실제 코드와 일치한다.
