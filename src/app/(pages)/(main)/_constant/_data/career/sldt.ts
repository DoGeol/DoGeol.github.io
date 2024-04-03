import { TCareer } from '@/app/(pages)/(main)/_constant/types'

export const CAREER_SLDT: TCareer = {
  id: 4,
  companyName: '에스엘디티(솔드아웃)',
  webUrl: '',
  department: '프론트 개발팀',
  jobPosition: '프론트엔드 개발자',
  period: ['2023. 02', '2023. 05'],
  stack: ['Vue.js', 'Nuxt.js', 'Sass(scss)', 'css3', 'Composition-api', 'Typescript'],
  description:
    '한정판 물품의 중고거래 서비스인 <strong>솔드아웃의 웹, 웹앱 페이지 개발, 운영</strong>하였습니다.<br/>' +
    '상대적으로 짧게 다닌 곳이지만, 솔드아웃 웹 서비스의 <strong>코드 리펙토링과 SEO 분석, 제안</strong>등의 경험을 할 수 있었습니다.<br/>' +
    'QA 프로세스의 비효율적인 부분을 개선하기위해, <strong>적극적으로 제안하고 일부분 프로세스에 적용</strong>되어진 경험이 있습니다.',
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
      details: ['<strong>참여 인원 : </strong> 3명 (FE 3명)'],
      roles: [
        'SEO 적용을 위한 Vue -> <strong>Nuxt 프로젝트 상세 페이지 세팅 담당</strong>',
        '상품 상세 페이지 이관을 위한 <strong>코드 분석 진행</strong>',
        '90점 상품 브릿지 페이지 개발',
        '시세 차트 컴포넌트 개발/내제화 (apexcharts)',
        '웹앱 페이지 최적화 진행하여 <strong>초기 렌더링 0.8초 감소 (이미지 최적화, 부분 렌더링)</strong>',
        'API 호출부에서 핸들링 되던 에러 메세지를 <strong>Axios interceptors로 에러핸들링 공통화</strong>하여 코드 가독성 증가 및 코드 라인 감소',
      ],
    },
    {
      id: 41,
      name: 'B2C 솔드아웃 웹 서비스 개발/운영',
      summary: '솔드아웃 웹 서비스의 기능 개발, 운영 이슈 수정',
      link: '',
      period: ['2022. 01', '2023. 02'],
      skills: ['Nuxt.js', 'Sass(scss)', 'css3', 'Typescript', 'Composition-api'],
      details: ['<strong>참여 인원 : </strong> 1명 (FE 1명)'],
      roles: [
        '웹 특정 페이지의 SEO가 적용되지 않는 문제를 분석/디버깅을 통해 확인하고 <strong>Layout 레이어에서 CSR이 발생 할 수 밖에 없는 코드에 대한 리펙토링 진행</strong>',
        '상품 검색 페이지에서 상품 상세 이동 후 뒤로가기 시, <strong>스크롤/상품정보가 유지되지 않는 부분 해결</strong>하기위해 <strong>Keep-alive 기능을 사용하여 뒤로가기 유지기능 개발</strong>',
      ],
    },
  ],
}
