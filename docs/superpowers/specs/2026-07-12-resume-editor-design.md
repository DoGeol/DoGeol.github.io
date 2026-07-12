# 로컬 전용 이력서 편집기 설계

## 배경

현재 `/resume`은 섹션별 TypeScript 상수를 직접 import한다. 이 작업은 데이터를 하나의 JSON으로 통합하고, 로컬 폼과 실제 페이지 프리뷰에서 수정한 뒤 검증된 JSON만 내려받게 한다.

프로젝트는 `output: 'export'`를 유지한다. 편집기와 프리뷰 도구는 개발 환경에서만 접근할 수 있고 production `out/`에는 HTML, route, client code가 모두 없어야 한다.

## 목표

- `resume.json` 하나를 이력서 콘텐츠의 기준으로 사용한다.
- `/resume`의 현행 UI, 반응형, route와 정적 출력을 보존한다.
- 로컬 편집기에서 모든 섹션의 표시 여부와 필드를 수정한다.
- 섹션은 표시·숨김과 Drag & Drop 정렬을 지원하고 반복 항목은 추가·삭제·정렬한다.
- 데스크톱·태블릿·모바일 실제 viewport에서 결과를 프리뷰한다.
- 프리뷰 영역을 선택하면 대응하는 편집 폼으로 이동한다.
- 같은 탭에서 새로고침해도 초안을 복구한다.
- 전체 검증을 통과한 데이터만 `resume.json`으로 다운로드한다.
- 이후 다른 이력서 양식을 추가할 수 있도록 데이터와 템플릿을 분리한다.

## 비목표

- production에서 편집기 또는 프리뷰 route를 제공하지 않는다.
- 저장소 파일을 브라우저나 개발 서버가 직접 덮어쓰지 않는다.
- 초안을 탭 종료 이후까지 보존하지 않는다.
- 이미지를 업로드하거나 Base64로 JSON에 포함하지 않는다.
- 자유 배치, 임의 CSS, 중첩 컨테이너를 제공하는 범용 페이지 빌더를 만들지 않는다.
- `contenteditable` 기반의 직접 본문 편집은 첫 버전에 포함하지 않는다.
- 두 번째 템플릿은 만들지 않고 확장 경계만 제공한다.

## 핵심 결정

### 개발 전용 route

`next.config.mjs`를 phase 기반 설정 함수로 바꾸고 개발 server phase에서만 `dev.tsx`를 `pageExtensions`에 추가한다.

- `src/app/(dev)/resume-editor/page.dev.tsx` → `/resume-editor`
- `src/app/(dev)/resume-preview/page.dev.tsx` → `/resume-preview`

Production build는 두 파일을 page로 인식하지 않는다. 편집기 전용 모듈은 이 진입점에서만 import한다. 정적 export 검증은 `out/`의 HTML과 JavaScript에 편집기 고유 marker가 없는지도 확인한다.

### 단일 JSON 모델

기준 파일은 `src/app/(pages)/resume/_data/resume.json`으로 둔다. 최상위 구조는 다음 역할을 가진다.

```json
{
  "schemaVersion": 1,
  "templateId": "classic",
  "metadata": {},
  "assets": {},
  "skillCatalog": [],
  "sections": []
}
```

- `schemaVersion`: 저장 형식의 명시적 버전이다.
- `templateId`: 등록된 renderer를 선택한다. 첫 버전 값은 `classic`뿐이다.
- `metadata`: `/resume`의 title과 description을 보관한다.
- `assets`: 앞·뒤 프로필 이미지처럼 섹션 밖에서 사용하는 root-relative public 경로다.
- `skillCatalog`: 기술의 안정적인 ID, 표시명과 category를 보관한다.
- `sections`: 정렬된 discriminated union 배열이다. 배열 순서가 출력 순서다.

지원 section type은 `information`, `introduce`, `experience`, `projects`, `education`, `activity`, `licenses`다. 각 type은 한 번만 존재하고 `id`, `type`, `visible`, `data`를 가진다. 편집기는 이 section type을 임의로 추가·삭제하지 않고 표시 여부와 순서만 바꾼다. 반복 항목은 추가·삭제할 수 있으며 영속적인 문자열 ID를 가지고 배열 순서대로 렌더링한다. 새 ID는 `crypto.randomUUID()`로 만들고 export에 포함하여 이후 정렬·선택·React key에 재사용한다.

날짜는 JSON에서 ISO 형식으로 통일하고 화면에서 기존 점 표기로 변환한다. 일 단위 값은 `YYYY-MM-DD`, 월 단위 값은 `YYYY-MM`을 사용하며 종료일이 없으면 `null`이다.

사용자 입력 문자열은 일반 text, 줄바꿈과 `**강조**`만 허용한다. 임의 HTML은 저장하거나 `dangerouslySetInnerHTML`로 출력하지 않는다.

### 스키마와 타입

Zod schema가 production과 편집기의 공통 계약이다. `ResumeData`는 schema에서 추론하고 별도 수동 interface를 중복 정의하지 않는다.

- 엄격한 `resumeSchema`는 기준 JSON과 export를 검증한다.
- 구조를 유지하면서 작성 중 빈 값을 허용하는 `resumeDraftSchema`는 session 초안과 프리뷰 message를 검증한다.
- ID 중복, section type 중복, skill 참조, 날짜 순서와 contact 형식을 상위 refine에서 검증한다.
- root-relative asset 경로는 `/`로 시작해야 한다. Build validator는 `public/` 파일 존재를 검사하고 편집기는 preview load 결과를 검사한다.

기준 JSON이 `resumeSchema`를 통과하지 못하면 필드 경로를 포함한 오류로 production build를 실패시킨다.

### 렌더러와 템플릿

기존 섹션 컴포넌트의 `_infos/*.ts` 직접 import를 제거하고 props를 받게 한다. `ResumeDocument`는 검증된 `ResumeData`와 template registry만 사용한다.

```text
resume.json → resumeSchema → ResumeData → template registry → ResumeDocument
                                               ├─ /resume
                                               └─ /resume-preview
```

`classic` renderer가 현행 `/resume` 마크업과 class를 소유한다. 프리뷰 전용 마크업은 복제하지 않는다. 새 템플릿은 같은 `ResumeData`를 소비하는 renderer만 registry에 등록하며 전용 layout·style 값을 콘텐츠 데이터에 섞지 않는다.

## 편집기 경험

### 화면 구성

데스크톱은 상단 toolbar 아래에 편집기 40%, 프리뷰 60%의 두 column을 둔다. 두 영역은 독립적으로 scroll한다. 모바일은 `편집`과 `프리뷰` 탭 중 하나만 표시한다.

Toolbar는 초안 상태, 원본 초기화와 JSON 내보내기를 제공한다. 편집 폼은 section별 Accordion이다. 표시 전환, 필드 수정, 반복 항목 추가·삭제와 정렬을 지원한다. 새 항목은 structurally valid한 빈 기본값과 새 ID를 받고 첫 필드로 focus한다.

### Drag & Drop

`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`를 사용한다. 각 배열은 독립된 `SortableContext`이며 다른 종류의 배열 사이 이동은 허용하지 않는다. Drag handle만 activator가 되어 input 선택과 충돌하지 않게 한다.

Pointer와 Keyboard sensor, `sortableKeyboardCoordinates`를 적용하고 긴 list에는 `DragOverlay`를 사용한다. 한국어 조작 안내와 위치 기반 live announcement를 제공한다. 취소·잘못된 drop·동일 위치 drop은 값을 바꾸지 않는다. 정렬은 `useFieldArray.move()`에만 반영한다.

### 프리뷰와 영역 선택

`/resume-preview`를 same-origin iframe으로 열어 독립된 viewport와 CSS 환경을 만든다. Desktop 1440, tablet 768, mobile 390 preset을 제공하고 stage 크기에 맞춰 시각적으로 scale한다. iframe 자체 viewport가 바뀌므로 현재 `tablet:` media query와 실제 페이지 반응형이 그대로 동작한다.

편집기와 프리뷰는 작은 typed message protocol로 통신한다.

- `PREVIEW_READY`: 프리뷰가 수신 준비를 알린다.
- `RENDER_DRAFT`: 검증된 draft와 선택 상태를 전달한다.
- `SELECT_REGION`: 선택한 stable editor ID와 region type을 돌려준다.
- `SET_PREVIEW_MODE`: `select` 또는 `actual` 모드를 전환한다.

모든 message는 정확한 origin, 알려진 type과 schema를 확인한다. `select` 모드에서 section과 반복 항목에 최소 outline과 label을 표시한다. 영역을 선택하면 부모 편집기가 현재 form 값에서 stable ID를 field path로 해석하고 왼쪽 Accordion을 열어 연결된 field로 scroll·focus한다. iframe은 재정렬로 쉽게 낡는 배열 index path를 소유하지 않는다. form 수정은 약간 지연된 draft로 프리뷰에 반영한다. `actual` 모드에서는 editor attribute, outline과 handle이 모두 사라진다. Production `/resume`에는 editor wrapper나 message code가 포함되지 않는다.

첫 버전의 수정은 왼쪽 구조화 폼에서만 한다. 프리뷰 popover quick edit은 추후 확장할 수 있지만 직접 inline text 편집은 하지 않는다.

### 상태와 내보내기

React Hook Form과 Zod resolver가 편집 상태, dirty/touched와 오류를 소유한다. `useDeferredValue`로 긴 문서 프리뷰가 타이핑을 막지 않게 한다. Zustand나 원격 상태 library는 도입하지 않는다.

초안은 `resume-editor:draft:v1` key로 `sessionStorage`에 약 300ms debounce하여 저장한다. envelope에는 `schemaVersion`, 저장 시각과 draft가 들어간다. 같은 탭의 새로고침에서는 복구하고 탭을 닫으면 브라우저가 폐기한다. JSON parse 실패, schemaVersion 불일치나 구조 검증 실패 시 초안을 버리고 기준 JSON으로 복구하면서 안내한다.

원본 초기화는 session 초안을 삭제하고 기준 JSON으로 form을 reset한다. 내보내기는 `resumeSchema`를 통과한 경우만 실행한다. UI 전용 상태를 제거하고 두 칸 들여쓰기와 마지막 줄바꿈을 적용한 UTF-8 `resume.json`을 Blob download한다.

## 오류 처리와 접근성

- Error summary는 첫 오류로 이동할 수 있고 모든 field error는 label과 연결한다.
- 필수 값이 비어도 draft는 보존하되 export는 차단한다.
- asset load 실패는 대체 UI와 경로 field 오류를 함께 표시한다.
- 삭제는 내용이 있는 반복 항목에 확인 단계를 제공하고 삭제 후 합리적인 위치로 focus한다.
- 선택된 항목이 숨김·삭제되면 선택을 가장 가까운 상위 section으로 이동한다.
- iframe load 또는 message handshake 실패는 재시도 action과 명시적 오류 상태를 보여준다.
- Drag handle, tab, Accordion과 toolbar는 keyboard로 조작할 수 있고 reduced motion을 존중한다.

## 테스트와 완료 조건

### Unit과 component

- 기준 JSON과 각 invalid fixture의 schema 검증
- ID·section type 중복, 날짜 역전, 잘못된 skill/contact/asset 경로
- JSON 직렬화의 안정된 순서, 두 칸 들여쓰기와 마지막 줄바꿈
- session 초안 저장·복구·폐기와 version 불일치 fallback
- template registry와 알 수 없는 template 거부
- preview message origin·type·payload 검증
- 항목 추가·삭제·표시 전환과 keyboard 정렬
- preview region 선택 시 해당 Accordion과 field focus

### E2E와 visual

- 데스크톱 편집과 실제 프리뷰 동시 표시
- 모바일 편집·프리뷰 tab 전환
- viewport preset별 실제 responsive rendering
- form 수정이 iframe에 반영되고 preview 선택이 form으로 돌아오는 양방향 흐름
- 새로고침 후 같은 탭 초안 복구
- invalid export 차단과 valid `resume.json` download
- 편집기 desktop·mobile screenshot
- 기존 `/resume` desktop·mobile screenshot 불변

### Production 격리

- `out/resume-editor.html`과 `out/resume-preview.html`이 존재하지 않는다.
- `out/`의 HTML과 JavaScript에 편집기 고유 marker가 존재하지 않는다.
- 기존 route 표와 sitemap에는 개발 전용 route를 추가하지 않는다.
- 개발 전용 route 사용법, JSON 소유권과 템플릿 구조는 개발 가이드·아키텍처·스택 문서에 반영한다.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm format:check`, `pnpm build`, `pnpm test:e2e`가 통과한다.

## 도입 의존성

- `zod`
- `react-hook-form`
- `@hookform/resolvers`
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

설치 시 React 19·Node 22 지원, peer dependency와 안정 release를 공식 문서에서 확인하고 lockfile에 고정한다.
