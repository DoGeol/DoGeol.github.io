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

기본 주소는 `http://localhost:3000`이다. `/resume`과 `/old-resume`에서 이력서를, `/components`에서 UI 카탈로그를 확인한다.

## 컴포넌트 문서

새 컴포넌트 문서는 `src/features/component-docs/model/catalog.ts`에 metadata와 MDX loader를 등록한다. `content`에 사용법을, `examples`에 실행 예제를 추가하고 source ID는 allowlist에 명시한다. 같은 변경에서 route test, sitemap, Wiki를 갱신한다.

## 검증

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm format:check
pnpm build
```

전체 검증은 `pnpm check`, route와 screenshot 검증은 `pnpm test:e2e`, 문서 검증은 `pnpm docs:check`를 사용한다.

`pnpm test:e2e:ci`는 Linux CI에서 macOS screenshot을 제외한 route 10개를 검증한다. 현행 디자인 기준선까지 확인하려면 macOS에서 `pnpm test:e2e`를 실행한다.

시각 기준선을 의도적으로 바꿀 때만 `pnpm test:e2e --update-snapshots`를 실행하고 생성된 차이를 검토한다.
