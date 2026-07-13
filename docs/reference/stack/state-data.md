---
status: active
lastReviewed: 2026-07-13
sourceOfTruth:
  - ../../../src
---

# 상태와 데이터

## 현재 소유권

- component 열림·입력 상태: React local state
- 이력서 콘텐츠: route 가까운 canonical JSON과 Zod loader
- 블로그 콘텐츠: 글별 canonical BlockNote JSON과 Zod file loader
- 이력서 편집 form: React Hook Form 단일 owner
- 블로그 편집: metadata와 BlockNote document를 소유한 editor local state
- 편집 선택·pane·accordion: editor local state
- 편집 초안: schemaVersion과 저장 시각을 포함한 현재 tab `sessionStorage` envelope
- theme: next-themes
- 원격 서버 상태: 없음
- URL 상태: 개발 블로그 편집 route의 `postId` 식별자만 사용
- 공유 UI store: 없음

## 도입 조건

이력서 편집기는 `useWatch` 결과를 deferred preview로 보내고, 구조가 유효한 draft만 debounce해 저장한다. reload는 같은 tab의 version 1 envelope만 복원하며 손상되거나 version이 다른 값은 삭제한다. export와 초기화는 각각 download와 canonical reset으로 분리된다.

블로그 편집기도 version 1 envelope에 post ID별 draft를 저장한다. editable/read-only BlockNote는 같은 제한 schema와 document를 공유한다. strict export와 asset provider 검증을 통과한 결과만 download하고, 손상된 session은 canonical 글로 복구한다.

Zustand는 여러 Client Component가 공유하는 편집 session이나 선택 상태가 생길 때만 도입한다. RSC에서 store를 읽지 않고 요청 간 mutable state를 공유하지 않는다.

TanStack Query는 polling, infinite query, optimistic update처럼 Next.js server fetch만으로 부족한 API 화면에만 사용한다. 일반 UI 상태를 query cache에 넣지 않는다.

nuqs는 공유·복원해야 하는 공개 검색, 필터, 정렬, page 상태가 생길 때 사용한다. 현재 공개 blog 검색·태그는 local state라 URL을 변경하지 않는다. 민감 정보와 대용량 상태는 URL에 넣지 않는다.
