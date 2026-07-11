---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../src
  - ../../public
---

# 프로젝트 구조

## 루트

- `AGENTS.md`: Codex가 읽는 저장소 규칙 라우터
- `docs/`: 설명, 참조, 실행 가이드, 마이그레이션 기록
- `scripts/check-docs.mjs`: 문서 크기와 Markdown 링크 검사
- `tests/e2e`: 주요 route와 현행 디자인 회귀 검증
- `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`: 품질 도구 설정
- `next.config.mjs`: 정적 export와 Next.js 설정
- `package.json`: 의존성과 개발 명령의 기준
- `pnpm-lock.yaml`: 재현 가능한 설치 기준

## App Router

`src/app/layout.tsx`는 Pretendard local font, metadata, theme provider를 제공한다. `src/app/(pages)` route group은 URL에 segment를 추가하지 않고 페이지를 구분한다.

- `(main)`: `/` placeholder 화면
- `blog`: `/blog` placeholder 화면
- `resume`: 현재 이력서
- `old-resume`: Accordion 기반 이전 이력서
- `components`: 정적 MDX 컴포넌트 카탈로그와 동적 slug route
- `not-found.tsx`: 정적 404 화면

## Resume

`resume/_infos`는 소개, 경력, 프로젝트, 학력, 활동, 자격 데이터를 보관한다. `resume/_components`는 section별 렌더링과 기간 계산을 담당한다. 페이지 전용 코드이므로 `src/shared`로 이동하지 않는다.

## Features와 Shared

`features`에는 theme, global header, highlighted text와 component docs가 있다. `component-docs`는 타입 manifest, MDX 콘텐츠, 실행 예제, source allowlist, 문서 UI를 함께 관리한다. GlobalHeader는 현재 root layout에서 렌더링하지 않는다. `shared/ui`에는 문서와 이전 이력서에서 사용하는 Accordion과 범용 Input이 있다.

`shared/lib/tailwindcss.ts`의 `cn()`은 clsx와 tailwind-merge를 결합한다. `shared/lib/localStorage.ts`는 현재 사용처가 없으므로 후속 정리 후보지만 이번 스택 마이그레이션에서는 삭제하지 않는다.

단위·컴포넌트 테스트는 검증 대상과 같은 디렉터리에 둔다. E2E와 screenshot 기준선은 `tests/e2e`에 두며 실행 산출물은 `output/playwright`에 격리한다.

## Static assets

`public/profile`과 `public/company/logo`는 이력서 이미지다. `robots.txt`와 `sitemap.xml`은 현재 수동 관리한다. 이미지 최적화와 동적 metadata 파일 전환은 별도 작업이다.
