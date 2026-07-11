---
status: in-progress
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

## 진행 순서

1. 에이전트 규칙과 Wiki 구축
2. `GEMINI.md` 규칙 이전과 삭제
3. pnpm 단일화
4. 핵심 runtime과 styling 업데이트
5. lint·format·unit test 정비
6. route·시각 회귀 검증
7. Wiki와 완료 증거 최신화

상세 체크리스트는 [구현 계획](../superpowers/plans/2026-07-11-react-stack-migration.md)에서 관리한다. 완료 후 이 문서는 최종 버전, 검증 결과, 보류 항목을 기록하는 역사 문서로 전환한다.
