---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../AGENTS.md
---

# 변경 경로와 문서 연결

모든 코드 변경이 문서 변경을 요구하지는 않는다. 구조, 계약, 명령, 설정, 사용자 동작이 바뀔 때 관련 문서를 같은 작업에서 갱신한다.

| 변경 경로                        | 확인할 문서                                            |
| -------------------------------- | ------------------------------------------------------ |
| `package.json`, `pnpm-lock.yaml` | `reference/stack/*`, `adoption-matrix.md`, 개발 가이드 |
| `next.config.*`                  | 아키텍처, 배포 가이드                                  |
| `src/app/**`                     | 라우트 참조, 프로젝트 구조                             |
| `src/features/**`                | 프로젝트 구조, 관련 UI 규칙                            |
| `src/shared/**`                  | 프로젝트 구조, 코드 규칙                               |
| `.github/workflows/**`           | 개발·배포·문서 최신화 가이드                           |
| `AGENTS.md`, `docs/agent/**`     | Wiki 홈과 하네스 설명                                  |
| 배포 명령·산출물                 | GitHub Pages 가이드                                    |

구현 계획의 각 Task는 문서 영향을 명시한다. 영향이 없으면 내부 구현만 바뀌고 위 표의 계약이 유지되는지 확인한다.
