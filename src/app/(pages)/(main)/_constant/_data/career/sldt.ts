import { TCareer } from '@/app/(pages)/(main)/_constant/types'

export const CAREER_SLDT: TCareer = {
  id: 4,
  companyName: '에스엘디티(솔드아웃)',
  webUrl: '',
  department: '프론트 개발팀',
  jobPosition: '프론트엔드 개발자',
  period: ['2023. 02', '2023. 05'],
  stack: ['Vue.js', 'Nuxt.js', 'scss', 'css3', 'Composition-api', 'Typescript'],
  description:
    '솔드아웃 앱웹 페이지의 신규 프로덕트 환경으로 이관 및 개발/운영, 웹페이지 분석/리펙토링을 진행하였습니다.',
  summary: [
    'B2C 한정판 물품의 중고거래 서비스, 솔드아웃의 웹앱 페이지 개발/운영',
    '솔드아웃 서비스 웹(PC) 서비스 코드 리펙토링',
  ],
  project: [
    {
      id: 40,
      name: 'B2C 솔드아웃 웹앱 페이지 이관 프로젝트',
      summary: 'SEO 적용을 위해, Nuxt 프로젝트로 상세페이지 이관하는 프로젝트',
      link: '',
      period: ['2023. 02', '2023. 05'],
      skills: ['Nuxt.js', 'Vue.js', 'Sass(scss)', 'css3', 'Composition-api', 'Typescript'],
      details: [
        '상품 상세 페이지 이관을 위한 코드 분석',
        'Nuxt 프로젝트 상세 페이지 세팅',
        '90점 상품 브릿지 페이지 개발',
        '공통 컴포넌트 개발',
      ],
      roles: [
        '웹앱 페이지 최적화 진행하여 초기 렌더링 0.8초 감소 (이미지 최적화, 부분 렌더링)',
        'API 호출부에서 핸들링 되던 공통적인 에러 메세지를 일괄 처리할 수 있게하여 코드 가독성 증가 및 코드 라인 감소',
        'GTM/GA 공통 세팅',
        '차트 컴포넌트 개발/내제화 (apexcharts)',
        '공통 탭 컴포넌트 개발',
      ],
    },
    {
      id: 41,
      name: 'B2C 솔드아웃 웹(PC) 서비스 개발/운영',
      summary: '솔드아웃 웹 서비스의 기능 개발, 운영 이슈 수정',
      link: '',
      period: ['2022. 01', '2023. 02'],
      skills: ['Nuxt.js', 'Sass(scss)', 'css3'],
      details: [
        '웹 페이지의 SEO가 적용되지 않는 문제를 분석/리펙토링',
        '검색 페이지 뒤로가기 유지기능 개발',
      ],
      roles: [
        'Layout 페이지에서 CSR이 발생 할 수 밖에 없는 코드를 디버깅을 통해 확인하고 수정 방안 제안',
        '상품 검색 페이지에서 상품 상세 이동 후 뒤로가기 시, 스크롤/상품정보가 유지되지 않는 부분 해결을 위한 뒤로가기 유지기능 개발',
      ],
    },
  ],
}
