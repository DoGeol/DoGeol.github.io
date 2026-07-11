---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../src/app
  - ../../next.config.mjs
---

# 아키텍처

## 목적

개인 포트폴리오와 이력서를 GitHub Pages에서 제공하는 Next.js 애플리케이션이다. 서버 런타임 없이 정적 export로 배포하며 페이지 콘텐츠는 저장소의 TypeScript 상수에서 관리한다.

## 렌더링 경계

App Router의 Server Component를 기본으로 사용한다. 테마, navigation, Accordion처럼 Hook이나 브라우저 API가 필요한 작은 경계만 Client Component로 둔다. 루트 layout은 공통 font와 theme provider를 제공한다.

## 레이어

- `src/app`: 라우트, layout, 페이지 전용 데이터와 컴포넌트
- `src/features`: 여러 화면에서 의미를 갖는 사용자 기능
- `src/shared`: 프레임워크와 페이지에 독립적인 UI, utility, style, font
- `public`: GitHub Pages가 그대로 제공하는 정적 자산

현재 레이어 이름은 Feature-Sliced Design과 유사하지만 완전한 FSD 규칙을 강제하지 않는다. 실제 의존 방향과 페이지 근접성을 우선한다.

## 데이터 흐름

`/resume`은 `_infos`의 TypeScript 객체를 Server Component가 import해 각 section component에 렌더링한다. 외부 API, 원격 캐시, 전역 store는 사용하지 않는다. 날짜 표시와 경력 계산만 Day.js에 의존한다.

## 배포

`next.config.mjs`의 `output: 'export'`가 `out/`을 생성한다. `gh-pages`가 `.nojekyll`과 함께 결과를 GitHub Pages에 게시한다. 배포 절차는 [GitHub Pages 가이드](../how-to/github-pages-deployment.md)를 따른다.
