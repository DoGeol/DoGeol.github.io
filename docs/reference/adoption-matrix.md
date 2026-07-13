---
status: active
lastReviewed: 2026-07-13
sourceOfTruth:
  - ../../package.json
  - ../../pnpm-lock.yaml
---

# 라이브러리 도입 상태

실제 설치 버전은 manifest와 lockfile을 기준으로 한다. 이 표는 역할과 도입 판단만 관리한다.

| 라이브러리                | 상태     | 근거                                                      |
| ------------------------- | -------- | --------------------------------------------------------- |
| Next.js, React, React DOM | adopted  | App Router와 렌더링 runtime                               |
| Tailwind CSS, PostCSS     | adopted  | 전체 페이지 styling                                       |
| clsx, tailwind-merge      | adopted  | `cn()` class 병합                                         |
| Day.js                    | adopted  | 이력서 날짜 계산과 표시                                   |
| Motion                    | adopted  | GlobalHeader를 `motion/react`로 전환                      |
| next-themes               | adopted  | 현행 dark theme 유지                                      |
| Vitest, Testing Library   | adopted  | 순수 로직과 component 회귀 테스트                         |
| Playwright                | adopted  | route와 desktop/mobile 시각 검증                          |
| React Hook Form 7.81.0    | adopted  | 이력서 편집 form과 field array 상태                       |
| Zod 4.4.3                 | adopted  | canonical, draft와 strict export schema                   |
| @hookform/resolvers 5.4.0 | adopted  | Zod 오류를 form field에 연결                              |
| @dnd-kit/core 6.3.1       | adopted  | pointer, touch, keyboard DnD와 접근성                     |
| @dnd-kit/sortable 10.0.0  | adopted  | 배열 내부 sortable 전략                                   |
| @dnd-kit/utilities 3.2.2  | adopted  | drag transform 직렬화                                     |
| BlockNote 0.51.4          | adopted  | 로컬 기술 블로그 block 편집과 read-only preview           |
| Shiki 4.3.1               | adopted  | 공개 글과 컴포넌트 문서의 build-time code highlight       |
| ESLint 9, Prettier        | adopted  | Next.js plugin peer 범위와 호환되는 정적 분석·format 검증 |
| Immer                     | removed  | 사용처 없음                                               |
| Zustand                   | deferred | 공유 UI 상태 없음                                         |
| Astryx                    | deferred | 현행 디자인 유지와 Beta 위험                              |
| TanStack Query, nuqs      | deferred | 원격·URL 상태 없음                                        |
| es-toolkit                | deferred | 현재 native JavaScript로 충분                             |
| MSW                       | deferred | API 요청 없음                                             |
| Virtual, Recharts         | deferred | 해당 UI 요구 없음                                         |

상태 의미는 adopted(현재 사용), deferred(요구 발생 시), removed(제거 결정)다.
