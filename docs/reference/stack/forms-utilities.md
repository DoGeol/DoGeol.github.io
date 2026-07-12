---
status: active
lastReviewed: 2026-07-12
sourceOfTruth:
  - ../../../src
---

# 폼과 유틸리티

## 현재 선택

Day.js는 이력서 경력 기간 계산과 날짜 표시에서 사용한다. locale이나 plugin이 추가되면 공용 초기화 module 한 곳에서 관리한다. clsx와 tailwind-merge는 `cn()`에서 조건부 Tailwind class 병합을 담당한다.

React Hook Form은 개발용 이력서 편집기의 form과 field array owner다. Zod는 canonical load, draft와 strict export boundary를 검증하며 `@hookform/resolvers`가 strict export 오류를 field 상태에 연결한다. 서버 제출은 없고 JSON download 전에도 같은 strict schema를 다시 적용한다.

## 보류 항목

es-toolkit은 복잡한 배열·객체 transformation이 반복될 때만 도입한다. native JavaScript로 명확한 로직에는 사용하지 않는다. Axios는 interceptor 같은 명확한 요구가 없으면 Next.js fetch와 중복 도입하지 않는다.
