---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../../src
---

# 선택 기능 라이브러리

현재 포트폴리오에는 아래 요구가 없어 설치하지 않는다.

| 요구        | 후보             | 도입 조건                                               |
| ----------- | ---------------- | ------------------------------------------------------- |
| drag 정렬   | dnd-kit          | 사용자가 목록 순서를 변경하고 keyboard 대안이 필요할 때 |
| 고급 table  | TanStack Table   | sort, filter, selection, column state가 복잡할 때       |
| 대규모 목록 | TanStack Virtual | server pagination으로 해결되지 않는 긴 목록일 때        |
| chart       | Recharts         | 표·text 대안과 함께 시각화가 필요할 때                  |

선택 기능은 route나 widget 단위로 격리하고 실제 요구, 접근성, bundle 비용을 검증한다. 역할이 겹치는 라이브러리를 동시에 도입하지 않는다.
