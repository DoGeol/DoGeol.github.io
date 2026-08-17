# Cloudflare 플랫폼 전환 구현 계획

설계 기준: [Cloudflare 플랫폼 전환 설계](../specs/2026-08-16-cloudflare-platform-design.md)

Homeground 계획: [Homeground 블로그 관리 구현 계획](./2026-08-16-blog-admin.md)

## 승인 게이트

현재는 계획 단계다. 사용자가 `개발 진행`을 명시적으로 승인하기 전에는 아래 Task를 시작하지 않는다. Cloudflare account의 zone, bucket, Access application 생성과 실제 배포는 로컬 구현 승인과 별도로 대상 리소스를 확인한 뒤 진행한다.

## Task 1. 업그레이드 기준선 고정

- 현재 `pnpm check`와 공개·editor E2E 결과를 기준선으로 저장한다.
- Next, React, Tailwind의 patch/minor 묶음을 서로 분리해 업데이트한다.
- BlockNote 0.54 묶음은 별도 단계에서 올리고 serialization, image block, drag-and-drop 회귀를 검증한다.
- TypeScript 7, ESLint 10, Motion 13 같은 major는 Cloudflare 전환에서 분리한다.
- 각 묶음마다 lockfile, typecheck, lint, unit test와 관련 E2E를 통과시킨다.
- 문서 영향: 기술 스택, 하네스.

## Task 2. OpenNext 무료 티어 적합성 spike

- `output: "export"`를 제거하고 `@opennextjs/cloudflare`, Wrangler와 최소 설정을 추가한다.
- 홈, 블로그 글, 이력서의 사전 렌더링 여부와 기존 URL을 확인한다.
- OpenNext build의 압축 Worker 크기가 Free 플랜 3 MiB 이내인지 확인한다.
- 대표 route와 빈 `POST /homeground/api/media` handler의 CPU를 local/preview에서 측정해 10 ms 한도 위험을 평가한다.
- 한도를 넘으면 변경 범위를 되돌리고 static export + 별도 경량 API Worker fallback 계획으로 전환한다.
- 기존 GitHub Pages workflow는 적합성 검증과 staging 승인 전까지 유지한다.
- 문서 영향: 배포, 기술 스택, 하네스.

## Task 3. R2 이미지 업로드 API

- `BLOG_MEDIA` R2 binding과 환경별 bucket 이름 계약을 추가한다.
- Next.js `POST /homeground/api/media` Route Handler에 Access JWT, origin, 크기, MIME과 magic bytes 검증을 구현한다.
- 입력 스트림을 R2에 저장하고 versioned JSON 응답으로 최종 공개 URL을 반환한다.
- UUID 기반 key, 불변 cache metadata, 중복 방지와 오류 status 계약을 적용한다.
- R2 storage는 mock/fake binding으로 unit test하고 OpenNext preview integration test를 추가한다.
- 문서 영향: API, 아키텍처, 보안, 테스트.

## Task 4. 블로그 에디터 연결

- 기존 `AssetProvider` adapter에 원격 Cloudflare provider를 추가한다.
- image block의 upload 동작이 성공 URL을 저장하고 preview하도록 연결한다.
- 업로드 중, 실패, 파일 형식·크기 초과 상태를 한국어로 표시한다.
- 로컬 filesystem provider의 기존 동작은 유지한다.
- editor E2E에 성공 업로드, 실패 복구와 저장된 canonical JSON URL을 추가한다.
- 문서 영향: 블로그 편집, 환경 변수, 하네스.

## Task 5. Cloudflare 리소스와 도메인 전환

- 승인된 account와 zone에서 R2 Standard bucket을 생성한다.
- `media.<domain>` custom domain, CORS와 cache rules를 설정한다.
- `/homeground`와 모든 하위 path를 보호하는 Access application과 작성자 allow policy를 설정한다.
- Worker secrets·vars를 등록하고 staging URL에서 readback 검증한다.
- GitHub Actions에 Wrangler 배포를 추가한 뒤 Cloudflare 배포가 안정적일 때 GitHub Pages 배포를 제거한다.
- DNS 전환 전후에 sitemap, RSS, canonical URL과 redirect 필요 여부를 확인한다.
- 문서 영향: 배포, 운영, route, SEO.

## Task 6. 종합 검증과 운영 문서

- `pnpm check`, 공개·editor E2E와 Workers integration test를 실행한다.
- 인증 없음, 잘못된 audience, 잘못된 origin, 위장 MIME, 5 MiB 초과와 key 충돌을 검증한다.
- 실제 테스트 이미지를 업로드하고 반환 URL의 content type, cache header와 공개 접근을 확인한다.
- Workers, R2와 Images 사용량 대시보드에서 무료 한도 관찰 위치를 문서화한다.
- 장애 시 GitHub Pages 또는 이전 Worker version으로 되돌리는 절차를 기록한다.
- Wiki와 Cloudflare 배포 문서를 현재 구성에 맞춘다.
