---
status: draft
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../package.json
  - ../../next.config.mjs
---

# GitHub Pages 배포

## 사전 검증

```bash
pnpm check
pnpm test:e2e
```

`next build`가 `out/`을 만들고 주요 HTML과 `_next` 정적 asset을 포함하는지 확인한다.

```bash
test -f out/index.html
test -f out/blog.html
test -f out/resume.html
test -f out/old-resume.html
test -f out/404.html
```

## 게시

```bash
pnpm deploy
```

deploy script는 `out/.nojekyll`을 만든 뒤 `gh-pages`로 결과를 게시한다. 이 명령은 외부 GitHub 상태를 바꾸므로 명시적 배포 요청이 있을 때만 실행한다.

## 배포 후 확인

`https://dogeol.github.io`의 주요 route, 새로고침, favicon, profile과 company image, robots, sitemap을 확인한다.
