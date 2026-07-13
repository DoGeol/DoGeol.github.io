# 기술 블로그 디자인 QA

- source visual truth: `/Users/pdg/.codex/generated_images/019f58b5-deb3-72f3-8f45-88ea3f3797bb/exec-cfbd2e83-9e01-44bf-a72b-7244c40468fe.png`
- public implementation screenshot: `/Users/pdg/WebstormProjects/DoGeol.github.io/.worktrees/technical-blog/tests/e2e/blog.spec.ts-snapshots/blog-article-desktop-desktop-chromium-darwin.png`
- editor implementation screenshot: `/Users/pdg/WebstormProjects/DoGeol.github.io/.worktrees/technical-blog/tests/e2e/blog.spec.ts-snapshots/blog-editor-desktop-desktop-chromium-darwin.png`
- viewport: desktop 1440 × 1000, light theme
- state: 공개된 `react-server-components` 글의 첫 화면과 동일 글의 로컬 편집 화면

## Full-view comparison evidence

원본과 최종 공개 화면을 원본 해상도로 함께 열어 비교했다. 넓은 여백, 얇은 상단 경계, 단일 열 본문과 우측 목차, 파란색 활성 상태, 한 줄의 강한 제목, 절제된 태그와 코드 표면이 같은 정보 위계로 보인다. 프로젝트 브랜드와 실제 글 길이는 의도적으로 현재 제품 내용에 맞췄다.

편집 화면은 별도 원본 시안이 없는 제품 상태이므로 승인된 40:60 요구를 기준으로 확인했다. 좌측 메타데이터·BlockNote 편집과 우측 읽기 전용 BlockNote 프리뷰가 같은 글을 표시하며, 상단 작업 버튼과 각 pane의 스크롤 경계가 겹치지 않는다.

원본과 구현 모두 1,400px 이상으로 글자·간격·코드·목차 상태를 판별할 수 있어 별도 확대 crop은 만들지 않았다. 대신 헤더/제목, 본문/목록, 우측 목차, 코드 블록, 편집기 메타데이터 영역을 각각 원본 크기에서 확인했다.

## Required fidelity surfaces

- Fonts and typography: 프로젝트의 기존 로컬 폰트를 유지했다. 제목은 40px/1.15로 한 줄을 유지하고 본문·메타데이터·목차의 굵기와 행간이 시안의 계층을 따른다.
- Spacing and layout rhythm: 52rem 본문과 16rem 목차, 4rem gutter, 얇은 divider, 40:60 편집 pane을 확인했다. 데스크톱 전용 `tablet`/`pc` 토큰이 실제 breakpoint와 일치한다.
- Colors and visual tokens: 흰 배경, slate 본문, neutral 경계, blue 활성/태그 토큰을 사용한다. light/dark semantic token을 함께 유지했다.
- Image quality and asset fidelity: 기준 시안과 현재 글에는 사진·일러스트·로고 raster asset이 없다. 기존 테마 아이콘은 프로젝트 자산을 재사용했고 CSS/가짜 이미지 대체물은 추가하지 않았다.
- Copy and content: 브랜드명과 글 본문은 실제 제품 내용으로 교체했지만 제목·요약·태그·날짜·읽기 시간·목차·코드라는 정보 구조는 유지했다.
- Accessibility and interactions: heading hierarchy, landmark, 목차 anchor, 코드 복사 버튼, form label, 모바일 tab keyboard 전환, focus 가능한 링크와 버튼을 확인했다.

## Comparison history

1. P2 — 프로젝트에는 `tablet`/`pc` breakpoint만 있는데 초기 구현이 `sm:*`를 사용해 데스크톱 내비게이션, 큰 제목, 여백과 편집기 grid가 적용되지 않았다. 모든 신규 블로그 화면을 프로젝트 breakpoint로 교체하고 다시 캡처했다.
2. P2 — breakpoint 수정 뒤 제목이 48px로 커져 두 줄로 꺾였다. 데스크톱 제목을 40px/1.15로 조정해 최종 캡처에서 한 줄 위계를 복구했다.
3. P2 — 연속 BlockNote 목록이 개별 `<ul>`로 렌더링돼 시안보다 흐름이 성겼다. renderer가 연속 list item을 하나의 목록으로 묶도록 고치고 목록 marker/간격을 보완했다.
4. P2 — 초기 목차와 코드 블록에 활성 강조와 언어 라벨이 없었다. 첫 목차 항목의 파란 indicator와 코드 언어 header를 추가한 뒤 최종 공개 캡처에서 확인했다.

## Findings

현재 남은 P0/P1/P2 차이는 없다.

## Follow-up polish

- P3 — 실제 글 분량이 시안보다 짧아 읽기 시간이 1분으로 표시된다. 콘텐츠가 늘어나면 자동 계산 결과가 자연스럽게 변한다.
- P3 — 시안의 날짜/읽기 시간 앞 선형 아이콘은 현재 텍스트 메타데이터로 단순화했다. 기능과 정보 탐색에는 영향이 없다.
- 개발 캡처의 좌하단 Next.js 표시기는 제품 UI가 아닌 개발 서버 overlay다.

## Implementation checklist

- [x] 프로젝트 breakpoint 토큰 적용
- [x] 한 줄 제목과 desktop navigation 확인
- [x] 목록 semantic grouping과 marker 확인
- [x] 목차 활성 상태와 코드 언어/복사 affordance 확인
- [x] 40:60 BlockNote 편집/프리뷰 확인
- [x] 모바일 tab keyboard 전환 확인

final result: passed
