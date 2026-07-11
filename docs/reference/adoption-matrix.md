---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../package.json
  - ../../pnpm-lock.yaml
---

# 라이브러리 도입 상태

실제 설치 버전은 manifest와 lockfile을 기준으로 한다. 이 표는 역할과 도입 판단만 관리한다.

| 라이브러리 | 상태 | 근거 |
| --- | --- | --- |
| Next.js, React, React DOM | adopted | App Router와 렌더링 runtime |
| Tailwind CSS, PostCSS | adopted | 전체 페이지 styling |
| clsx, tailwind-merge | adopted | `cn()` class 병합 |
| Day.js | adopted | 이력서 날짜 계산과 표시 |
| Motion | adopted | GlobalHeader를 `motion/react`로 전환 |
| next-themes | adopted | 현행 dark theme 유지 |
| Vitest, Testing Library | adopted | 순수 로직과 component 회귀 테스트 |
| Playwright | adopted | route와 desktop/mobile 시각 검증 |
| ESLint 9, Prettier | adopted | Next.js plugin peer 범위와 호환되는 정적 분석·format 검증 |
| Immer | removed | 사용처 없음 |
| Zustand | deferred | 공유 UI 상태 없음 |
| Astryx | deferred | 현행 디자인 유지와 Beta 위험 |
| TanStack Query, nuqs | deferred | 원격·URL 상태 없음 |
| React Hook Form, Zod | deferred | 복잡한 form과 외부 입력 없음 |
| es-toolkit | deferred | 현재 native JavaScript로 충분 |
| MSW | deferred | API 요청 없음 |
| dnd-kit, Table, Virtual, Recharts | deferred | 해당 UI 요구 없음 |

상태 의미는 adopted(현재 사용), deferred(요구 발생 시), removed(제거 결정)다.
