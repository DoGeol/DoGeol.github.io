# 기술 블로그 구현 계획

관련 설계: `docs/superpowers/specs/2026-07-13-technical-blog-design.md`

## 1. 계약과 canonical data

- [x] slug normalize·validation과 날짜/metadata/block Zod schema를 정의한다.
- [x] canonical JSON loader에 file context, ID·slug 중복과 asset 존재 검사를 추가한다.
- [x] 첫 published sample 글을 BlockNote JSON으로 작성한다.
- [x] 관련 unit test를 먼저 작성하고 통과시킨다.

## 2. 공개 renderer와 탐색

- [x] BlockNote JSON을 React static HTML로 변환한다.
- [x] H2~H4 anchor, semantic list, table, image, quote, divider와 code highlight를 지원한다.
- [x] `/blog` 검색·태그 목록과 `/blog/[slug]` 정적 상세를 구현한다.
- [x] responsive 목차와 코드 복사 enhancement를 구현한다.

## 3. SEO와 feed

- [x] 글별 static params와 metadata를 생성한다.
- [x] sitemap을 code-generated route로 전환한다.
- [x] RSS XML과 escaping/ordering test를 추가한다.

## 4. 로컬 편집 기반

- [x] BlockNote 의존성을 고정 버전으로 설치한다.
- [x] H2~H4와 승인 block만 가진 schema를 만든다.
- [x] versioned session envelope, restore, reset과 autosave를 구현한다.
- [x] strict JSON export와 공개 slug lock을 구현한다.
- [x] `AssetProvider`와 local public adapter를 구현한다.

## 5. 편집 UI

- [x] canonical 글과 session-only 초안을 합치는 관리 화면을 만든다.
- [x] 제목 기반 slug 제안과 수동 수정 ownership을 구현한다.
- [x] editable/read-only BlockNote surface를 동일 schema로 구성한다.
- [x] desktop 40:60 pane과 mobile accessible tab을 구현한다.
- [x] query resolver를 client boundary에 두어 static export 개발 route 제약을 지킨다.

## 6. 격리와 회귀

- [x] `.dev.tsx` route가 production compile에 포함되지 않게 유지한다.
- [x] static export에서 editor route, marker와 storage key를 검사한다.
- [x] public/editor unit·component test와 desktop/mobile E2E를 추가한다.
- [x] 공개 상세와 editor 시각 기준선을 만들고 디자인 QA를 통과한다.

## 7. 문서와 완료 검증

- [x] route, architecture, structure, state/data, stack, testing과 개발 가이드를 갱신한다.
- [x] `pnpm docs:check`
- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm test`
- [x] `pnpm format:check`
- [x] `pnpm build`
- [x] `pnpm test:e2e`

마지막 검증 항목은 작업 완료 직전 fresh command 결과로 체크한다.
