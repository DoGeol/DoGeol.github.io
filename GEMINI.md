# AI Assistant Context Rules for React/Next.js 15 Project

이 문서는 AI Assistant가 코드를 생성하거나 수정할 때 고려해야 할 핵심 컨텍스트 규칙을 정의합니다. 다음 기술 스택 및 모범 사례를 기반으로 코드를 제안하고 구현해야 합니다.

## 1. 프로젝트 개요 및 주요 기술 스택

* **프레임워크:** Next.js 15 (App Router 사용)
* **UI 라이브러리:** React
* **타입스크립트:** TypeScript (엄격한 타입 체크 적용)
* **CSS 프레임워크:** Tailwind CSS
* **코드 포매터:** Prettier (자동 포맷팅 규칙 준수)
* **린터:** ESLint (정의된 린팅 규칙 준수)
* **애니메이션:** Motion (Framer Motion 라이브러리)

## 2. Next.js 15 (App Router) 특정 규칙

* **App Router 우선:** 모든 새로운 라우트 및 컴포넌트는 App Router 패러다임에 맞춰 구성합니다. `pages` 디렉토리 방식은 레거시이므로 사용하지 않습니다.
* **Server Components 기본:** 특별한 이유(클라이언트 상호작용, Hooks 사용)가 없는 한, 기본적으로 Server Components로 코드를 작성합니다. `use client` 지시어는 꼭 필요한 경우에만 파일 상단에 명시합니다.
* **데이터 페칭:**
    * Server Components에서는 `fetch` API를 사용하여 데이터를 가져오고, React Server Components (RSC)의 캐싱 및 재검증 기능을 활용합니다.
    * 클라이언트 컴포넌트에서는 `SWR` 또는 `React Query`와 같은 라이브러리를 사용하여 데이터를 가져옵니다.
    * `getServerSideProps`, `getStaticProps`, `getInitialProps`는 App Router에서는 사용하지 않습니다.
* **라우팅:** `next/navigation`의 `useRouter`, `useSearchParams`, `usePathname` 등을 사용하여 라우팅 관련 기능을 구현합니다.
* **레이아웃 및 템플릿:** `layout.tsx`와 `template.tsx` 파일을 사용하여 UI 구조 및 재사용 가능한 레이아웃을 정의합니다.
* **Metadata:** `metadata` 객체 또는 `generateMetadata` 함수를 사용하여 페이지 및 레이아웃의 메타데이터를 관리합니다.

## 3. React 및 TypeScript 규칙

* **함수형 컴포넌트 및 Hooks:** 항상 함수형 컴포넌트를 사용하고, 상태 관리 및 사이드 이펙트 처리는 React Hooks (`useState`, `useEffect`, `useContext`, `useMemo`, `useCallback` 등)를 활용합니다.
* **컴포넌트 분리:** 단일 책임 원칙(Single Responsibility Principle)에 따라 컴포넌트를 작고 재사용 가능하게 분리합니다. Presentational 컴포넌트와 Container 컴포넌트를 구분하는 것을 고려합니다.
* **Props 타입 명시:** 모든 컴포넌트의 `props`는 TypeScript 인터페이스 또는 타입 별칭으로 명확하게 타입을 정의합니다. `FC` 또는 `FunctionComponent`는 필요시 사용하되, `PropsWithChildren`을 활용하여 `children` 타입을 관리합니다.
* **Event Handlers 타입:** 이벤트 핸들러 함수(예: `onClick`, `onChange`)의 매개변수 타입은 `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>` 등 정확하게 명시합니다.
* **Any 타입 지양:** `any` 타입 사용을 극도로 제한하고, 불확실한 경우 `unknown`을 사용한 후 타입 가드를 통해 명확히 타입을 좁혀나갑니다.
* **조건부 렌더링:** 삼항 연산자 또는 논리 AND(`&&`) 연산자를 사용하여 간결하게 조건부 렌더링을 구현합니다.
* **Keys prop:** `map` 함수를 사용하여 리스트를 렌더링할 때, 항상 고유한 `key` prop을 제공합니다.
* **@Atomic Design 원칙**을 `shared/ui` 레이어의 UI 컴포넌트에 적용
* **언어**: 모든 코드와 주석은 한국어로 작성
* **네이밍**: 변수/함수는 `camelCase`, 타입/컴포넌트는 `PascalCase`

## 4. Tailwind CSS 규칙

* **유틸리티 우선:** 인라인 유틸리티 클래스를 사용하여 스타일을 적용하는 것을 최우선으로 합니다.
* **반응형 디자인:** `sm:`, `md:`, `lg:`, `xl:` 등의 접두사를 사용하여 반응형 디자인을 구현합니다. 모바일 퍼스트(mobile-first) 접근 방식을 기본으로 합니다.
* **클래스 순서:** Tailwind CSS 클래스는 의미론적 순서(레이아웃, Flexbox, 그리드, 간격, 크기, 타이포그래피, 배경, 테두리, 이펙트, 인터랙티브, SVG)를 따르는 것이 가독성에 좋습니다. (예: `flex items-center justify-center p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600`)
* **재사용 가능한 컴포넌트:** 반복되는 복잡한 유틸리티 클래스 조합은 새로운 React 컴포넌트로 캡슐화합니다. `@apply` 지시어는 가능한 한 사용을 지양합니다.

## 5. 애니메이션 (Motion) 규칙

* **Framer Motion 사용:** 모든 애니메이션 효과는 Framer Motion 라이브러리를 사용하여 구현합니다.
* **`motion.div`, `motion.span` 등 활용:** 애니메이션을 적용할 HTML 요소에 `motion.` 접두사를 붙여 사용합니다.
* **`initial`, `animate`, `transition`:** 컴포넌트 마운트/언마운트, 상태 변화에 따른 애니메이션을 구현할 때 `initial`, `animate`, `transition` props를 적극적으로 활용합니다.
* **`variants`:** 복잡하거나 재사용 가능한 애니메이션 시퀀스는 `variants` 객체를 사용하여 정의합니다.
* **`useAnimation`:** 명령형으로 애니메이션을 제어해야 하는 경우 `useAnimation` 훅을 사용합니다.
* **`AnimatePresence`:** 컴포넌트가 DOM에서 제거될 때 애니메이션을 적용해야 할 경우 `AnimatePresence` 컴포넌트를 사용합니다.

## 6. 코드 스타일 및 린팅 (Prettier & ESLint)

* **자동 포맷팅 준수:** 모든 코드는 Prettier의 포맷팅 규칙에 따라 자동 포맷팅되어야 합니다. 수동으로 스타일을 수정하지 않습니다.
* **ESLint 규칙 준수:** ESLint가 감지하는 모든 잠재적 오류 및 스타일 경고를 해결합니다. `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-tailwindcss` 플러그인에서 오는 규칙을 따릅니다.
* **불필요한 주석 제거:** 코드로 설명할 수 있는 부분은 주석을 최소화합니다. 복잡한 로직이나 비즈니스 규칙에 대한 설명만 주석으로 남깁니다.
* **Import 순서:** ESLint 또는 Prettier의 import 정렬 규칙을 따릅니다. 일반적으로 외부 라이브러리 > 프로젝트 내부 컴포넌트 > 유틸리티 순서입니다.

## 7. 일반적인 개발 원칙

* **DRY (Don't Repeat Yourself):** 코드 중복을 피하고 재사용 가능한 추상화를 만듭니다.
* **테스트 용이성:** 코드는 테스트하기 쉽게 작성되어야 합니다. 순수 함수를 선호하고, 사이드 이펙트를 최소화합니다.
* **의미론적 HTML:** 시맨틱 HTML 요소를 사용하여 웹 접근성과 SEO를 개선합니다.
* **컴포넌트 props:** props는 명확하고 구체적으로 정의하며, 불필요한 props 전달을 피합니다.
* **성능 고려:** 항상 웹 성능을 고려하여 코드 스플리팅, 이미지 최적화, 불필요한 리렌더링 방지 등을 적용합니다.

---

AI Assistant는 이 규칙들을 기반으로 보다 정확하고 일관성 있는 코드를 생성하도록 노력해야 합니다. 이 규칙들이 충돌하거나 불명확한 경우에는 항상 개발팀의 최신 컨벤션을 따릅니다.