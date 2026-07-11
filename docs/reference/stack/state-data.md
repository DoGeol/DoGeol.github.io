---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../../src
---

# 상태와 데이터

## 현재 소유권

- component 열림·입력 상태: React local state
- 이력서 콘텐츠: route 가까운 TypeScript 상수
- theme: next-themes
- 원격 서버 상태: 없음
- URL 검색·필터 상태: 없음
- 공유 UI store: 없음

## 도입 조건

Zustand는 여러 Client Component가 공유하는 편집 session이나 선택 상태가 생길 때만 도입한다. RSC에서 store를 읽지 않고 요청 간 mutable state를 공유하지 않는다.

TanStack Query는 polling, infinite query, optimistic update처럼 Next.js server fetch만으로 부족한 API 화면에만 사용한다. 일반 UI 상태를 query cache에 넣지 않는다.

nuqs는 공유·복원해야 하는 검색, 필터, 정렬, page 상태가 생길 때 사용한다. 민감 정보와 대용량 상태는 URL에 넣지 않는다.
