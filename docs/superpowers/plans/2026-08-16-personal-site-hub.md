# 종합 개인 사이트 허브 구현 계획

설계 기준: [종합 개인 사이트 허브 설계](../specs/2026-08-16-personal-site-hub-design.md)

플랫폼 계획: [Cloudflare 플랫폼 전환 구현 계획](./2026-08-16-cloudflare-platform.md)

## 승인 게이트

현재는 계획 단계다. 선택한 2번 시안을 기준으로 아래 범위를 제안하며, 사용자가 `개발 진행`을 명시적으로 승인한 뒤 Task 1을 시작한다. Cloudflare 인프라와 이미지 업로드는 별도 플랫폼 계획의 승인 게이트를 따른다.

## Task 1. 공통 공개 데이터 요약

- 홈과 포트폴리오가 이력서의 visible projects를 안전하게 읽는 helper를 추가한다.
- Studio catalog와 상태 타입을 추가하고 단위 테스트로 route·상태 계약을 고정한다.
- 문서 영향: 프로젝트 구조.

## Task 2. 사이트 내비게이션과 홈

- 비활성 global header를 홈·포트폴리오·Studio용 사이트 헤더로 정리한다.
- `/` placeholder를 선택한 2번 시안의 navy split hero로 교체한다.
- 기존 프로필 이미지를 사용하고 desktop/mobile crop을 각각 검증한다.
- 대표 프로젝트를 `문제 → 접근 → 결과` narrative로 표시한다.
- 최근 글 row와 실제 Component Lab preview를 하단에 배치한다.
- 홈페이지 route smoke test의 기대 문구를 갱신한다.
- 문서 영향: route, 프로젝트 구조.

## Task 3. 포트폴리오와 Studio

- `/portfolio`에 대표 프로젝트 목록과 이력서 연결을 구현한다.
- `/studio`에 실험 catalog와 `/components` 연결을 구현한다.
- route metadata와 빈 데이터 fallback을 제공한다.
- 문서 영향: route, 아키텍처, 프로젝트 구조.

## Task 4. 사전 렌더링 계약과 검색 노출

- sitemap에 신규 route를 추가한다.
- 빌드 출력 검사와 Playwright public route 목록에 신규 route를 추가한다.
- route/구조/아키텍처 Wiki를 현재 코드와 맞춘다.
- 문서 영향: route, 프로젝트 구조, 아키텍처.

## Task 5. 검증

- 관련 단위 테스트와 route E2E를 실행한다.
- typecheck, lint, 전체 unit test, format check와 build를 실행한다.
- `/`, `/portfolio`, `/studio`를 desktop 1440px와 mobile 390px에서 렌더링하고 스크린샷과 overflow를 확인한다.
- 선택 시안과 desktop 구현 screenshot을 같은 크기로 비교하고 hero 비율, typography, spacing, image crop을 조정한다.
