---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../package.json
  - ../../.nvmrc
---

# 개발 가이드

## 설치

Node는 `.nvmrc`를 사용하고 pnpm은 `package.json`의 `packageManager` 버전을 따른다.

```bash
pnpm install --frozen-lockfile
```

## 로컬 실행

```bash
pnpm dev
```

기본 주소는 `http://localhost:3000`이다. `/resume`과 `/old-resume`에서 현재·이전 이력서를 확인한다.

## 검증

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm format:check
pnpm build
```

전체 검증은 `pnpm check`, route와 screenshot 검증은 `pnpm test:e2e`, 문서 검증은 `pnpm docs:check`를 사용한다.

시각 기준선을 의도적으로 바꿀 때만 `pnpm test:e2e --update-snapshots`를 실행하고 생성된 차이를 검토한다.
