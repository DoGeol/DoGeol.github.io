---
status: active
lastReviewed: 2026-07-13
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

기본 주소는 `http://localhost:3000`이다. `/blog`에서 기술 글을, `/resume`과 `/old-resume`에서 이력서를, `/components`에서 UI 카탈로그를 확인한다. BlockNote와 Shiki가 포함된 app graph를 안정적으로 처리하기 위해 local dev는 webpack compiler를 사용한다.

## 기술 블로그 편집

`pnpm dev`로만 제공되는 `/blog-editor`에서 canonical 글을 열거나 새 글을 만든다. desktop은 좌측 편집 40%와 우측 프리뷰 60%를 동시에 표시하고 mobile은 편집/프리뷰 tab을 전환한다.

1. 제목, 요약, 상태, 태그와 본문을 작성한다. slug는 제목에서 제안되지만 공개 전에는 직접 수정할 수 있다.
2. 이미지는 먼저 `public/blog/` 아래에 두고 `/blog/`로 시작하는 경로와 대체 텍스트를 입력한다.
3. 우측 read-only BlockNote에서 실제 문서 구조를 확인한다.
4. `JSON 내보내기`로 `<slug>.json`을 내려받는다.
5. 내려받은 내용을 검토해 `src/app/(pages)/blog/_data/posts/`에 추가하거나 기존 file을 교체한다.
6. `/blog`, `/blog/<slug>`, `/blog/rss.xml`과 `pnpm check`를 확인한다.

초안은 현재 browser tab의 versioned `sessionStorage`에 자동 저장되며 canonical JSON을 직접 덮어쓰지 않는다. 이미 공개된 글의 slug는 URL 보존을 위해 잠긴다. production build에는 편집 route, BlockNote editor client marker와 초안 key가 포함되지 않는다.

향후 S3+API로 전환할 때는 post loader/JSON export와 `AssetProvider` adapter를 교체하고 공개 목록·renderer·편집 UI와 `BlogPost` schema는 유지한다. 세부 경계는 [기술 블로그 설계](../superpowers/specs/2026-07-13-technical-blog-design.md)를 따른다.

## 이력서 편집

`pnpm dev`로만 제공되는 `/resume-editor`에서 내용을 수정하고 desktop·tablet·mobile 프리뷰를 확인한다. 이미지를 추가할 때는 먼저 `public/` 아래에 배치하고 `/`로 시작하는 경로를 입력한다.

1. 선택 모드 프리뷰에서 영역과 연결된 form을 확인한다.
2. 실제 화면 모드에서 선택용 outline과 속성이 없는 결과를 확인한다.
3. `JSON 내보내기`로 `resume.json`을 내려받는다.
4. 내려받은 내용을 검토한 뒤 `src/app/(pages)/resume/_data/resume.json`에 수동으로 교체한다.
5. `pnpm check`와 `pnpm test:e2e`를 실행한다.

편집기는 React Hook Form의 render와 분리된 subscription으로 현재 tab의 versioned `sessionStorage`에 초안을 자동 저장하지만 canonical JSON을 직접 덮어쓰지 않는다. 기술 카탈로그와 기술 선택기는 닫힌 상태에서 대량 입력을 마운트하지 않으므로 필요할 때 열어 편집한다. production build에는 편집 route와 초안이 포함되지 않는다.

## 컴포넌트 문서

새 컴포넌트 문서는 `src/features/component-docs/model/catalog.ts`에 metadata와 MDX loader를 등록한다. `content`에 사용법을, `examples`에 실행 예제를 추가하고 source ID는 allowlist에 명시한다. 같은 변경에서 route test, sitemap, Wiki를 갱신한다.

## 검증

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
pnpm format:check
pnpm build
```

전체 검증은 `pnpm check`, route와 screenshot 검증은 `pnpm test:e2e`, 문서 검증은 `pnpm docs:check`를 사용한다.

Playwright는 기본적으로 `127.0.0.1:3100`에 전용 서버를 시작하고 기존 서버를 재사용하지 않는다. `pnpm test:e2e`는 먼저 production build의 `out/`을 정적 서버로 검증하고, 이어서 development-only 편집기만 Next.js 개발 서버에서 검증한다. 이 분리는 GitHub Pages 결과와 로컬 도구를 각각 실제 runtime에서 검사하고 development manifest 경쟁을 피한다.

```bash
PLAYWRIGHT_PORT=3117 pnpm test:e2e
```

공개·편집 경계를 따로 실행하려면 `pnpm test:e2e:public`, `pnpm test:e2e:editor`를 사용한다. `pnpm test:e2e:ci`도 같은 두 경계를 실행하되 Linux CI에서 macOS screenshot만 제외한다. 현행 디자인 기준선까지 확인하려면 macOS에서 `pnpm test:e2e`를 실행한다.

시각 기준선을 의도적으로 바꿀 때만 `pnpm test:e2e --update-snapshots`를 실행하고 생성된 차이를 검토한다.
