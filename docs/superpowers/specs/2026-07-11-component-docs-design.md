# 커스텀 컴포넌트 문서 설계

## 목표

`/components`에 shadcn 문서의 정보 구조를 참고한 공개 컴포넌트 카탈로그를 만든다. 첫 버전은 기존 Accordion과 Input을 MDX로 문서화하고 현행 사이트 스타일과 정적 export를 유지한다.

## 범위

- `/components`, `/components/accordion`, `/components/input`
- 문서 전용 헤더, desktop sidebar·목차, mobile dialog navigation
- Preview/Code 전환, 실제 예제·원본 source 표시, copy feedback
- Usage, Examples, Props, Source, Known limitations
- sitemap, 프로젝트 Wiki, unit·E2E·visual regression

검색, Storybook, shadcn registry, 설치 CLI, 신규 UI 컴포넌트, Accordion·Input API 및 접근성 구현 변경은 제외한다.

## 아키텍처

`componentDocs` manifest가 slug, title, description, category, MDX loader, 목차, source ID를 관리한다. `/components/[slug]`는 manifest의 slug를 `generateStaticParams`로 반환하고 `dynamicParams = false`로 정적 export한다.

MDX는 설명과 예제 조합을 담당한다. 예제는 별도 TSX 파일로 만들고 server source reader가 allowlist의 실제 파일만 build 시 읽는다. Shiki가 light/dark TSX HTML을 생성하고 Client Component는 탭과 clipboard 상태만 소유한다.

## 화면 구조

상단 문서 헤더는 홈 링크, Components, theme toggle을 제공한다. desktop은 왼쪽 탐색, 최대 768px 본문, 오른쪽 현재 문서 목차의 3열 구조다. mobile은 본문만 표시하고 Menu 버튼이 native dialog 탐색을 연다.

index는 소개와 두 component card를 보여준다. 상세 문서는 title·description, Preview, Usage, Examples, Props, Source, Known limitations, 이전·다음 link 순서다. Pretendard, primary blue, neutral border, 기존 dark theme을 재사용한다.

## 공개 계약

```ts
type ComponentDoc = {
  slug: 'accordion' | 'input'
  title: string
  description: string
  category: 'Disclosure' | 'Form'
  sections: readonly { id: string; label: string }[]
  sourceIds: readonly SourceId[]
  load: () => Promise<{ default: React.ComponentType }>
}
```

source reader는 `SourceId`를 repo 내부 고정 경로로만 변환한다. 알려지지 않은 slug는 404, 알려지지 않은 source ID는 build/test 실패다.

## 콘텐츠

Accordion은 기본 multiple, single, rounded 예제와 Root·Item·Title props를 제공한다. Input은 size, disabled, password, Enter callback 예제와 props를 제공한다. 기존 구현은 바꾸지 않고 keyboard/ARIA 및 password toggle labeling 제한을 Known limitations에 명시한다.

## 실패 처리

clipboard 실패는 `복사 실패`를 aria-live로 알리고 code selection을 유지한다. MDX loader, source file, section ID가 manifest와 불일치하면 unit test나 build가 실패한다. mobile dialog는 Escape와 close button으로 닫히고 닫힌 뒤 trigger로 focus를 돌린다.

## 완료 조건

- 세 route가 정적 HTML로 export된다.
- manifest, source allowlist, tabs, copy feedback, mobile navigation test가 성공한다.
- desktop/mobile route와 새 visual snapshot이 성공한다.
- 기존 route와 `/resume` snapshot이 유지된다.
- Wiki·sitemap이 코드와 일치하고 전체 CI 검증이 통과한다.
