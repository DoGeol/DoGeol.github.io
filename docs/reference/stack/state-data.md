---
status: active
lastReviewed: 2026-07-12
sourceOfTruth:
  - ../../../src
---

# 상태와 데이터

## 현재 소유권

- component 열림·입력 상태: React local state
- 이력서 콘텐츠: route 가까운 canonical JSON과 Zod loader
- 이력서 편집 form: React Hook Form 단일 owner
- 편집 선택·pane·accordion: editor local state
- 편집 초안: schemaVersion과 저장 시각을 포함한 현재 tab `sessionStorage` envelope
- theme: next-themes
- 원격 서버 상태: 없음
- URL 검색·필터 상태: 없음
- 공유 UI store: 없음

## 도입 조건

이력서 편집기는 `useWatch` 결과를 deferred preview로 보내고, 구조가 유효한 draft만 debounce해 저장한다. reload는 같은 tab의 version 1 envelope만 복원하며 손상되거나 version이 다른 값은 삭제한다. export와 초기화는 각각 download와 canonical reset으로 분리된다.

Zustand는 여러 Client Component가 공유하는 편집 session이나 선택 상태가 생길 때만 도입한다. RSC에서 store를 읽지 않고 요청 간 mutable state를 공유하지 않는다.

TanStack Query는 polling, infinite query, optimistic update처럼 Next.js server fetch만으로 부족한 API 화면에만 사용한다. 일반 UI 상태를 query cache에 넣지 않는다.

nuqs는 공유·복원해야 하는 검색, 필터, 정렬, page 상태가 생길 때 사용한다. 민감 정보와 대용량 상태는 URL에 넣지 않는다.
