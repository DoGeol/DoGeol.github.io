# 종합 개인 사이트 허브 설계

## 승인 상태

- 작업 브랜치: `codex/personal-site-hub`
- 선택 시안: 2번 Product Narrative
- 시안 원본: [선택한 홈 시안](../assets/2026-08-16-personal-site-home-selected.png)
- 구현 승인: 대기 중

사용자가 구현을 명시적으로 승인하기 전에는 이 문서와 시안만 유지하고 애플리케이션 코드를 변경하지 않는다.

## 목표

기존 블로그, 이력서, 컴포넌트 문서를 유지하면서 `/`를 개인 사이트의 중심으로 전환한다. 방문자가 편도걸의 전문성, 대표 프로젝트, 최근 글과 실험 공간을 한 흐름에서 발견할 수 있게 한다.

## 확인된 현재 상태

- `/`는 `메인페이지 계획중` placeholder다.
- `/blog`와 정적 글 상세, RSS, sitemap이 구현되어 있다.
- `/resume`은 canonical `resume.json`을 사용하는 공개 이력서다.
- `/components`는 실제 UI와 소스를 탐색하는 컴포넌트 카탈로그다.
- 공통 헤더 구현은 있지만 root layout에서 비활성화되어 있다.
- 현재는 GitHub Pages 정적 export이며 공개 콘텐츠는 build-time 데이터만 사용한다.

## 정보 구조

| URL           | 역할                                                                 |
| ------------- | -------------------------------------------------------------------- |
| `/`           | 소개, 주요 공간, 대표 프로젝트, 최근 글을 연결하는 홈                |
| `/portfolio`  | 이력서의 대표 프로젝트를 결과와 역할 중심으로 보여주는 공개 쇼케이스 |
| `/studio`     | 실험, 도구, UI 카탈로그를 모으는 공개 Studio                         |
| `/blog`       | 기존 기술 블로그                                                     |
| `/resume`     | 기존 전체 이력서                                                     |
| `/components` | 기존 컴포넌트 문서이자 첫 Studio 항목                                |

홈, 포트폴리오와 Studio에만 같은 사이트 헤더를 사용한다. 블로그와 이력서의 기존 레이아웃은 시각 회귀를 피하기 위해 유지한다.

## 콘텐츠와 데이터 경계

- 최신 글은 `getCanonicalBlogPosts()` 결과에서 최대 3개를 사용한다.
- 포트폴리오는 `canonicalResumeData`의 visible `projects` section에서 `기타 프로젝트`를 제외한 항목을 사용한다.
- 홈은 위 두 데이터의 일부만 요약하고 원문은 각각 `/blog`, `/portfolio`, `/resume`으로 연결한다.
- Studio 항목은 route, 상태, 설명, 기술을 가진 정적 catalog로 관리한다. 첫 항목은 `/components`다.
- 공개 문구에 필요한 경력 설명과 연락처는 이력서 데이터를 기준으로 하고, 프로젝트 상세를 별도 파일에 복사하지 않는다.

## UI 방향

선택한 2번 시안의 Product Narrative 방향을 따른다. Pretendard와 기존 blue primary color를 유지하되 첫 화면은 deep navy surface와 흰색 타이포그래피를 사용한다. hero는 소개와 CTA가 있는 왼쪽 영역, 기존 프로필 사진을 크게 보여주는 오른쪽 영역으로 나눈다. 주요 CTA는 `프로젝트 이야기 보기`, 보조 CTA는 `이력서 열기`다.

hero 다음에는 warm white surface에서 대표 프로젝트 하나를 `문제 → 접근 → 결과` 순서로 설명한다. 별도 프로젝트 원고를 복제하지 않고 이력서의 summary, 프로젝트 상세, 주요 성과를 각각 대응시킨다. 측정 가능한 결과는 하나만 크게 강조하고 전체 포트폴리오로 연결한다.

하단은 최근 글과 Studio를 같은 깊이의 두 영역으로 배치한다. 최근 글은 가벼운 row 목록으로, Studio는 기존 `/components`의 실제 UI preview를 활용한 하나의 작업 샘플로 보여준다. 일반적인 feature card grid와 불필요한 지표 나열은 사용하지 않는다.

포트폴리오는 대표 프로젝트를 같은 narrative 구조로 보여주되, 전체 이력서 상세를 반복하지 않고 성과와 역할을 빠르게 비교할 수 있게 한다.

Studio는 향후 항목이 늘어나도 유지할 수 있는 catalog grid다. 상태를 `운영 중`, `준비 중`으로 구분하고 준비 중 항목은 링크 대신 설명으로 표시한다.

### 반응형 해석

- desktop은 navy hero의 56:44 split과 큰 프로필 이미지를 유지한다.
- mobile은 소개 → 프로필 이미지 → CTA 순서의 한 열로 전환한다.
- 대표 프로젝트의 문제·접근·결과는 mobile에서 세로 흐름으로 바꾼다.
- 최근 글과 Studio는 mobile에서 각각 독립 section으로 쌓는다.
- 기존 `tablet` 768px, `pc` 1280px breakpoint를 그대로 사용한다.

## 접근성과 동작

- 페이지마다 하나의 `h1`과 의미 있는 section heading을 둔다.
- 사이트 헤더는 desktop link와 mobile menu를 제공하고 현재 route를 `aria-current`로 표시한다.
- mobile menu는 열릴 때 dialog 역할, Escape와 닫기 버튼을 제공한다.
- icon-only control은 대체 텍스트를 갖는다.
- focus-visible 상태와 reduced motion을 존중한다.

## 사전 렌더링과 SEO

`/portfolio`와 `/studio`는 build-time에 사전 렌더링한다. 두 route를 sitemap, route 문서, Playwright public smoke test와 빌드 출력 검사에 추가한다. 홈 metadata는 개인 사이트 의미에 맞게 갱신하고 각 신규 route는 고유 title과 description을 제공한다.

## 플랫폼 경계

개인 사이트 UI는 Cloudflare 전환 뒤 `@opennextjs/cloudflare` 기반 Workers에 배포한다. static export 제약은 제거하지만 홈, 포트폴리오, 공개 블로그 글은 계속 build-time에 사전 렌더링한다. 블로그 이미지 업로드처럼 서버가 필요한 기능만 Next.js Route Handler에서 동적으로 실행한다. R2 이미지 URL은 기존 canonical blog JSON의 image block에 저장하므로 공개 글의 원본 관리 방식은 바꾸지 않는다.

서비스 선택, 무료 티어, 인증과 업로드 계약은 [Cloudflare 플랫폼 전환 설계](./2026-08-16-cloudflare-platform-design.md)를 따른다.

## 변경 범위

- `(main)` homepage와 layout
- `portfolio`, `studio` route와 page-local model/component
- 활성화할 `global-header` feature
- sitemap, 사전 렌더링 contract와 route E2E
- route, 구조, 아키텍처 Wiki

블로그 renderer/editor, 이력서 renderer/editor, 기존 `/components` UI와 URL은 변경하지 않는다.

## 완료 조건

- `/`, `/portfolio`, `/studio`가 desktop/mobile에서 읽기 좋은 구조로 렌더링된다.
- 홈의 최신 글과 프로젝트가 canonical 데이터에서 파생된다.
- 모든 기존 공개 route와 사전 렌더링 결과가 유지된다.
- typecheck, lint, unit test, format check, build, 관련 E2E가 성공한다.
- 신규 세 화면을 desktop/mobile에서 직접 렌더링해 overflow와 내비게이션을 확인한다.
