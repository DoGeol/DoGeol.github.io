---
status: complete
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../package.json
  - ../superpowers/plans/2026-07-11-react-stack-migration.md
---

# 2026 React 스택 마이그레이션

## 목표

현행 UI와 정적 route를 보존하면서 Next.js 16, React 19.2, Tailwind CSS 4.3, Motion, Flat Config, Vitest, Playwright로 전환한다.

## 기준선

| 검사             | 결과                          |
| ---------------- | ----------------------------- |
| `pnpm build`     | 성공                          |
| `tsc --noEmit`   | 성공                          |
| 기존 `next lint` | 성공, Accordion Hook 경고 1건 |
| Prettier check   | 18개 파일 불일치              |
| unit/E2E         | 구성 없음                     |

## 완료 결과

| 영역              | 결과                                            |
| ----------------- | ----------------------------------------------- |
| 패키지 관리       | pnpm 10.28.2로 단일화, frozen install 성공      |
| runtime           | Next.js 16.2.10, React 19.2.7                   |
| styling·animation | Tailwind CSS 4.3.2, Motion 12.42.2              |
| 품질              | ESLint 9.39.5 Flat Config, Prettier 3.9.5       |
| 단위·컴포넌트     | Vitest 4.1.10, 4개 파일 9개 테스트 성공         |
| E2E               | Playwright 1.61.1, 두 viewport 12개 테스트 성공 |
| 문서              | 300자 이하 agent 규칙, Wiki, 자동 문서 검사     |

ESLint 10은 `eslint-config-next`가 포함한 plugin의 peer 범위와 맞지 않아 설치 경고가 없는 ESLint 9를 선택했다. Accordion Hook 경고와 기존 format 불일치는 해소했다. `GEMINI.md`, npm lockfile, Framer Motion, 미사용 Immer와 Zustand를 제거했다.

`pnpm docs:check && pnpm check && pnpm test:e2e`와 정적 export의 `index`, `blog`, `resume`, `old-resume`, `404` HTML을 2026-07-11에 검증했다.

Astryx, TanStack Query, nuqs, 폼·검증, MSW와 선택 UI 라이브러리는 현재 요구가 없어 보류했다. 현행 페이지 디자인과 정적 route는 screenshot과 smoke test 기준으로 유지한다.

상세 작업 이력은 [구현 계획](../superpowers/plans/2026-07-11-react-stack-migration.md)에서 확인한다.
