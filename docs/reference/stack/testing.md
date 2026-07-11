---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../../package.json
  - ../../../vitest.config.ts
  - ../../../playwright.config.ts
  - ../../../tests
---

# 테스트 스택

## Unit과 component

Vitest와 jsdom을 runner·browser environment로 사용한다. Testing Library는 DOM 구조가 아니라 사용자가 보는 text와 interaction을 기준으로 검증한다. user-event로 pointer와 keyboard 입력을 재현하고 jest-dom matcher를 사용한다.

경력 기간 계산, 강조 text rendering, Accordion 상태, 문서 하네스 검사를 4개 파일의 9개 테스트로 검증한다.

## E2E와 시각 회귀

Playwright Chromium으로 `/`, `/blog`, `/resume`, `/old-resume`, 404를 desktop과 mobile에서 smoke test한다. `/resume` screenshot 기준선을 두 viewport에 고정해 runtime migration이 현행 UI를 바꾸지 않는지 확인한다.

Linux CI의 `pnpm test:e2e:ci`는 macOS rendering 차이를 피하려고 `@visual` screenshot test만 제외한다. 로컬 `pnpm test:e2e`는 route와 screenshot을 모두 검증한다.

## API mock

현재 API가 없어 MSW를 설치하지 않는다. API가 생기면 success뿐 아니라 loading, empty, validation error, server error, timeout handler를 함께 설계한다.
