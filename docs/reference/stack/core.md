---
status: active
lastReviewed: 2026-07-13
sourceOfTruth:
  - ../../../package.json
  - ../../../next.config.mjs
---

# Core stack

## Runtime

Next.js App Router와 React를 사용한다. Server Component를 기본으로 하고 Hook, browser API, local interaction이 필요한 경계만 Client Component로 둔다. 이 프로젝트는 `output: 'export'`를 유지하므로 서버 전용 runtime 기능을 추가하지 않는다.

현재 runtime은 Next.js 16.2.10과 React/React DOM 19.2.7이다. Node는 Next.js와 ESLint 조건을 모두 만족하는 22.13 이상을 사용한다.

BlockNote는 development-only 기술 블로그 편집기에서만 client runtime으로 사용한다. 공개 글은 같은 JSON schema를 별도 React renderer로 정적 변환한다. BlockNote와 Shiki가 포함된 graph에서 development와 production compiler 차이를 없애기 위해 `next dev --webpack`, `next build --webpack`을 사용한다.

## Styling

Tailwind CSS v4의 CSS-first 설정을 사용한다. 기존 `tablet`, `pc` breakpoint, primary color token, dark variant와 utility를 보존한다. 마이그레이션에서는 class를 재설계하지 않고 버전과 build integration만 갱신한다.

## Animation

복합 enter/exit, layout, gesture에는 `motion`의 `motion/react`를 사용한다. 단순 hover, color, opacity는 CSS transition을 우선한다. reduced motion을 존중하고 overlay primitive와 중복 animation을 만들지 않는다.

## UI system

Astryx는 접근 가능한 component와 token을 제공하지만 Beta이며 현재 UI와 theme ownership을 바꿀 수 있다. 이번 작업에는 설치하지 않고 별도 PoC와 시각 회귀 검증이 승인될 때만 도입한다. shadcn/ui도 목표 스택이 아니므로 추가하지 않는다.
