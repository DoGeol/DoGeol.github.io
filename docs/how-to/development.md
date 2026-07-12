---
status: active
lastReviewed: 2026-07-12
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

## 이력서 편집

`pnpm dev`로만 제공되는 `/resume-editor`에서 내용을 수정하고 desktop·tablet·mobile 프리뷰를 확인한다. 이미지를 추가할 때는 먼저 `public/` 아래에 배치하고 `/`로 시작하는 경로를 입력한다.

1. 선택 모드 프리뷰에서 영역과 연결된 form을 확인한다.
2. 실제 화면 모드에서 선택용 outline과 속성이 없는 결과를 확인한다.
3. `JSON 내보내기`로 `resume.json`을 내려받는다.
4. 내려받은 내용을 검토한 뒤 `src/app/(pages)/resume/_data/resume.json`에 수동으로 교체한다.
5. `pnpm check`와 `pnpm test:e2e`를 실행한다.

편집기는 현재 tab의 versioned `sessionStorage`에 초안을 자동 저장하지만 canonical JSON을 직접 덮어쓰지 않는다. production build에는 편집 route와 초안이 포함되지 않는다.

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
