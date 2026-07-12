---
status: active
lastReviewed: 2026-07-13
sourceOfTruth:
  - ../../../package.json
  - ../../../vitest.config.ts
  - ../../../playwright.config.ts
  - ../../../tests
---

# 테스트 스택

## Unit과 component

Vitest와 jsdom을 runner·browser environment로 사용한다. Testing Library는 DOM 구조가 아니라 사용자가 보는 text와 interaction을 기준으로 검증한다. user-event로 pointer와 keyboard 입력을 재현하고 jest-dom matcher를 사용한다.

경력 기간 계산과 renderer 외에 이력서 schema·canonical loader·template registry, editor form/session/export/asset, message protocol과 accessible DnD를 소스 가까운 test로 검증한다.

`pnpm test:coverage`는 V8 coverage를 실행하며 statements 85%, branches 75%, functions 90%, lines 88%를 최소 기준으로 둔다.

## E2E와 시각 회귀

Playwright Chromium으로 public route를 desktop과 mobile에서 smoke test한다. `/resume` screenshot 기준선을 두 viewport에 고정하고, 개발 편집기는 desktop 40/60 shell과 mobile edit/preview 세 기준선을 별도로 둔다.

`resume-editor.spec.ts`는 edit→preview 선택, 표시 toggle, keyboard reorder, company CRUD, session restore/reset, validation focus, lazy skill catalog/picker, JSON download, actual mode, 잘못된 asset과 public 격리를 독립 test로 검증한다. build 전 asset script는 canonical image를, build 후 static-export script는 dev route와 marker 부재를 확인한다.

Playwright는 `PLAYWRIGHT_PORT` 또는 기본값 `3100`으로 `127.0.0.1` 전용 서버를 시작하며 기존 프로세스를 재사용하지 않는다. Linux CI의 `pnpm test:e2e:ci`는 macOS rendering 차이를 피하려고 `@visual` screenshot test만 제외한다. 로컬 `pnpm test:e2e`는 route와 screenshot을 모두 검증한다.

## API mock

현재 API가 없어 MSW를 설치하지 않는다. API가 생기면 success뿐 아니라 loading, empty, validation error, server error, timeout handler를 함께 설계한다.
