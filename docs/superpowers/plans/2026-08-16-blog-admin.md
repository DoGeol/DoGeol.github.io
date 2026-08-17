# Homeground 블로그 관리 구현 계획

설계 기준: [Homeground 블로그 관리 설계](../specs/2026-08-16-blog-admin-design.md)

## 승인 게이트

현재는 계획 단계다. 사용자가 구현을 명시적으로 승인하기 전에는 아래 Task를 시작하지 않는다. Milestone 1과 Milestone 2는 별도로 검증·승인할 수 있게 나눈다.

## Task 1. 기존 에디터 승격

- `(dev)/blog-editor`의 편집 UI와 model을 production route에서 재사용 가능한 feature로 이동한다.
- `/homeground/blog`, `/homeground/blog/new`, `/homeground/blog/[id]` route shell을 추가한다.
- 개발 전용 loader, session storage와 production repository를 adapter로 분리한다.
- 공개 route에서 Homeground와 BlockNote client module이 import되지 않는 bundle contract를 유지한다.
- 기존 unit test와 editor visual/E2E를 새 route에 맞게 이전한다.

## Task 2. Access 인증과 Homeground 보안

- `/homeground`와 모든 하위 path에 적용할 Access application과 작성자 allow policy를 정의한다.
- sitemap과 공개 navigation에서 Homeground를 제외하고 route metadata에 `noindex, nofollow`를 적용한다.
- Route Handler 공통 인증에서 Access JWT issuer, audience, expiry와 identity를 검증한다.
- mutation에 exact origin, body size, content type와 method 검증을 추가한다.
- 인증 없음, audience 오류, CORS와 CSRF 실패를 integration test로 고정한다.

## Task 3. R2 이미지 provider

- Cloudflare 플랫폼 계획의 `POST /homeground/api/media`와 `BLOG_MEDIA` binding을 구현한다.
- `R2AssetProvider`를 기존 `AssetProvider` 경계에 추가한다.
- BlockNote image, cover image에 업로드 진행·성공·실패와 alt 입력 흐름을 연결한다.
- `provider: "r2"` asset source schema migration과 과거 `public` source 호환을 추가한다.
- 이 단계에서는 session draft와 JSON export를 그대로 유지해 Milestone 1을 완성한다.

## Task 4. D1 repository와 migration

- `blog_posts`, `blog_revisions`, `media_assets` migration과 typed repository를 추가한다.
- canonical JSON을 기존 ID·slug 그대로 seed하는 검증 script를 만든다.
- list, read, create, update API와 version-based optimistic locking을 구현한다.
- session storage를 네트워크 실패 복구 cache로 바꾸고 서버 autosave 상태를 표시한다.
- local fake D1과 OpenNext preview D1 integration test를 추가한다.

## Task 5. 발행과 공개 blog 전환

- publish mutation에 schema, slug, asset 검증과 revision snapshot transaction을 구현한다.
- 공개 blog loader를 filesystem/D1 adapter 뒤로 이동하고 published row만 노출한다.
- 목록, 상세, RSS, sitemap과 metadata 결과를 전환 전 fixture와 비교한다.
- 대표 공개 요청의 CPU, D1 rows read와 응답 시간을 Free 한도 기준으로 기록한다.
- staging 승인 전에는 filesystem loader와 GitHub Pages fallback을 유지한다.

## Task 6. 운영 기능과 검증

- revision 목록·복원과 전체 JSON export를 추가한다.
- media library는 참조 상태를 조회하는 read-only 화면부터 제공한다.
- `pnpm check`, 공개·Homeground E2E, OpenNext preview와 실제 Access/R2/D1 smoke test를 실행한다.
- 인증, backup/export, migration, publish rollback과 무료 사용량 확인 절차를 Wiki에 기록한다.
