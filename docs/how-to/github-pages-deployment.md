---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../.github/workflows/quality-and-deploy.yml
  - ../../next.config.mjs
---

# GitHub Pages 배포

## 자동 검증

- PR과 `develop` push는 `Quality` job만 실행한다.
- `main` push는 `Quality` 성공 후 `Deploy` job이 `out/`을 게시한다.
- `Quality`는 frozen install, 문서, typecheck, lint, unit test, format, build, route E2E를 검증한다.
- macOS screenshot 회귀 검증은 배포 전 로컬 `pnpm test:e2e`로 확인한다.

`next build`가 `out/`을 만들고 주요 HTML과 `_next` 정적 asset을 포함하는지 workflow에서 확인한다.

```bash
test -f out/index.html
test -f out/blog.html
test -f out/resume.html
test -f out/old-resume.html
test -f out/404.html
```

## 게시와 재실행

`main` 반영 외에 재배포가 필요하면 GitHub Actions의 `Quality and Deploy` workflow에서 `main`을 선택해 수동 실행한다. 배포 job은 `pages: write`, `id-token: write`만 사용하고 `github-pages` environment에 결과 URL을 기록한다.

실패하면 실패 job의 log를 확인하고 같은 commit을 재실행한다. 품질 검사가 실패한 실행은 Pages artifact를 게시하지 않는다.

## 배포 후 확인

`https://dogeol.github.io`의 주요 route, 새로고침, favicon, profile과 company image, robots, sitemap을 확인한다.
