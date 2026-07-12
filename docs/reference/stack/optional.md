---
status: active
lastReviewed: 2026-07-12
sourceOfTruth:
  - ../../../src
---

# 선택 기능 라이브러리

이력서 편집기의 순서 변경에는 `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`를 함께 사용한다. pointer·touch·keyboard sensor, sortable transform과 accessible announcement를 담당하며 section 또는 각 field array 내부 이동만 허용한다. 서로 다른 배열 사이의 이동은 지원하지 않는다.

나머지 포트폴리오에는 아래 요구가 없어 설치하지 않는다.

| 요구        | 후보             | 도입 조건                                         |
| ----------- | ---------------- | ------------------------------------------------- |
| 고급 table  | TanStack Table   | sort, filter, selection, column state가 복잡할 때 |
| 대규모 목록 | TanStack Virtual | server pagination으로 해결되지 않는 긴 목록일 때  |
| chart       | Recharts         | 표·text 대안과 함께 시각화가 필요할 때            |

선택 기능은 route나 widget 단위로 격리하고 실제 요구, 접근성, bundle 비용을 검증한다. 역할이 겹치는 라이브러리를 동시에 도입하지 않는다.
