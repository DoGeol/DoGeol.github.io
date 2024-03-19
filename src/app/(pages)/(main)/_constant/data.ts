import { TAboutMe, TCareer, TInformation, TSkill } from '@/app/(pages)/(main)/_constant/types'

export const INFORMATION: TInformation = {
  title: '안녕하세요.<br/>프론트엔드 개발자 <strong>편도걸</strong>입니다.',
  contact: [
    {
      id: 0,
      type: 'email',
      name: 'Email',
      url: 'pdg2491@naver.com',
      target: '_self',
    },
    {
      id: 1,
      type: 'link',
      name: 'Github',
      url: 'https://github.com/DoGeol',
      target: '_blank',
    },
  ],
}

export const ABOUT_ME: TAboutMe = {
  title: '저는 _____ 하는 개발자입니다.',
  descriptions: [
    '주어진 환경에서 <span>효율적</span>으로 일을 처리합니다.',
    '동료와의 협업, <span>의사소통</span>을 중요하게 생각합니다.',
    '개발만 잘하는 것이 아닌, <span>일 잘하는 개발자</span>가 되기위해 노력합니다.',
  ],
}

export const SKILL_DETAILS: TSkill[] = [
  { id: 0, name: 'React', icon: '', type: 'js', url: '' },
  { id: 1, name: 'Next.js', icon: '', type: 'js', url: '' },
  { id: 2, name: 'Vue', icon: '', type: 'js', url: '' },
  { id: 3, name: 'Nuxt.js', icon: '', type: 'js', url: '' },
  { id: 4, name: 'Typescript', icon: '', type: 'js', url: '' },
  { id: 5, name: 'ES6', icon: '', type: 'js', url: '' },
  { id: 6, name: 'ES5', icon: '', type: 'js', url: '' },
  { id: 7, name: 'jQuery', icon: '', type: 'js', url: '' },
  { id: 8, name: 'Github', icon: '', type: 'cicd', url: '' },
  { id: 9, name: 'Sass(Scss)', icon: '', type: 'css', url: '' },
  { id: 10, name: 'Tailwind Css', icon: '', type: 'css', url: '' },
  { id: 11, name: 'React Hook From', icon: '', type: 'lib', url: '' },
  { id: 12, name: 'Prettier', icon: '', type: 'setting', url: '' },
  { id: 13, name: 'ESLint', icon: '', type: 'setting', url: '' },
  { id: 14, name: 'Webpack5', icon: '', type: 'bundle', url: '' },
  { id: 15, name: 'Gulp', icon: '', type: 'bundle', url: '' },
  { id: 16, name: 'Github Actions', icon: '', type: 'cicd', url: '' },
  { id: 17, name: 'Turborepo', icon: '', type: 'setting', url: '' },
  { id: 18, name: 'Zustand', icon: '', type: 'lib', url: '' },
  { id: 19, name: 'emotion', icon: '', type: 'lib', url: '' },
  { id: 20, name: 'Redux', icon: '', type: 'lib', url: '' },
  { id: 21, name: 'element-ui', icon: '', type: 'lib', url: '' },
  { id: 22, name: 'ant-design', icon: '', type: 'lib', url: '' },
  { id: 23, name: 'daisyUI', icon: '', type: 'lib', url: '' },
  { id: 24, name: 'HTML5', icon: '', type: 'lib', url: '' },
  { id: 25, name: 'Vuex', icon: '', type: 'lib', url: '' },
  { id: 26, name: 'GitLab', icon: '', type: 'cicd', url: '' },
  { id: 27, name: 'CSS3', icon: '', type: 'css', url: '' },
  { id: 28, name: 'Composition-api', icon: '', type: 'lib', url: '' },
  { id: 29, name: 'Jenkins', icon: '', type: 'cicd', url: '' },
]

export const getBadgeColor = (type: string) => {
  switch (type) {
    case 'js':
      return 'bg-yellow-200 dark:bg-yellow-700'
    case 'css':
      return 'bg-blue-200 dark:bg-blue-700'
    case 'cicd':
      return 'bg-green-200 dark:bg-green-700'
    case 'lib':
      return 'bg-red-200 dark:bg-red-700'
    case 'setting':
      return 'bg-purple-200 dark:bg-purple-700'
    default:
      return 'bg-gray-200 dark:bg-gray-700'
  }
}

export const CAREER: TCareer[] = [
  {
    id: 1,
    companyName: '하이브랩',
    webUrl: 'https://hivelab.co.kr',
    department: 'BE개발팀',
    jobPosition: '전임 개발자',
    period: ['2018. 04', '2020. 12'],
    stack: ['Vue.js', 'Nuxt.js', 'scss', 'css3'],
    description: '삼성 CMS 솔루션(AEM) 개발 및 자사 ERP 사내시스템 개발/운영을 담당하였습니다.',
    summary: [
      '삼성 글로벌 웹 사이트, CMS 솔루션(AEM) 컴포넌트,페이지 개발/운영',
      '[사내시스템] 전자 결재 시스템 개발/운영',
      '[사내시스템] 리소스 관리 솔루션 개발/운영',
    ],
    project: [
      {
        id: 10,
        name: '[삼성] New Commercial Landing Page 개발',
        summary: '삼성 닷컴 카테고리별 제품을 노출하는 Offer 페이지 리뉴얼 프로젝트',
        link: '',
        period: ['2019. 10', '2020. 10'],
        skills: ['Javascript', 'jQuery', 'HTML5', 'Sass(scss)', 'css3', 'gulp'],
        details: [
          'CMS 솔루션의 컨텐츠 입력을 위한 폼의 프리뷰 팝업 개발',
          'API 비동기 통신 함수 공통화',
          'RawData 데이터 가공 기능 담당 개발',
        ],
        roles: [
          'CMS 솔루션의 복잡한 컨텐츠 구성 난이도를 감소시키기위해 <strong>컨텐츠 구성하는 화면의 프리뷰 팝업 위젯을 개발</strong>하여, 페이지 제작 시간 단축',
          '국가별 API Spec 문서를 제작하고, API를 함수화하여 타 프로젝트에서 사용 할 수 있도록 가공',
        ],
      },
      {
        id: 11,
        name: '[삼성] S10 / N10 Bundle Package 랜딩 페이지 개발',
        summary: '삼성 닷컴 S10 번들 프로모션 랜딩페이지 위젯 개발',
        link: '',
        period: ['2019. 09', '2019. 10'],
        skills: ['Javascript', 'jQuery', 'JSP', 'SheetJs'],
        details: ['프론트엔드 담당 개발', '엑셀 업로드를 통해 페이지를 생성하는 위젯 개발'],
        roles: [
          '페이지를 구성하는 컨텐츠 제작 과정 반복되는 과정을 줄이기 위해 <strong>SheetJS의 엑셀 업로드 기능을 활용한 데이터 가공 위젯 개발</strong>',
          '솔루션의 Node 저장소를 이용하여 History 기능 개발',
          '엑셀 업로드를 통해 페이지 생성 시간 단축으로, 오픈 국가 추가 계약 달성',
        ],
      },
      {
        id: 12,
        name: '[사내 시스템] 유연 근로 출·퇴근 통합 관리 시스템 개발',
        summary: '사내의 유연 근로 출·퇴근 통합 관리 시스템 구축 프로젝트',
        link: '',
        period: ['2020. 01', '2020. 03'],
        skills: ['Javascript', 'jQuery', 'JSP', 'HTML5', 'css3', 'Java', 'Spring Boot', 'Mysql'],
        details: [
          '프론트엔드, 백엔드 영역 전반적인 개발 진행',
          'Vuex Store 활용한 로그인 기능 상태 최적화 진행',
          '수기 입력 CRUD API 개발',
        ],
        roles: [
          '백엔드 통계 계산 비즈니스 로직 개발',
          'jQuery + moment.js 활용한 DatePicker 리펙토링',
          '타 도메인 간의 CORS 이슈 처리에 대한 검토 및 개발 진행',
        ],
      },
      {
        id: 13,
        name: '[사내 시스템] 리소스 관리 솔루션 통계 오류 개선 프로젝트',
        summary: '사내 정책 변경에 의한 리소스 관리 솔루션 통계 및 기능 개선 프로젝트',
        link: '',
        period: ['2020. 01', '2020. 06'],
        skills: ['Vue.js', 'Vuex', 'Javascript', 'HTML5', 'css3', 'Java', 'Spring Boot', 'Mysql'],
        details: [
          '기존 전자 결재 시스템의 유저 / 관리자 페이지 근태 확인 기능 개발',
          '하드코딩에 의한 레거시 코드 리팩토링 진행',
          '통계 관련 DB Query 수정 & 속도 튜닝',
          '버그 리포트 Jira 도입 및 사용자 가이드 제작 진행',
        ],
        roles: [
          '전반적인 개발을 진행하면서, 프론트엔드 관련 수정은 전담하여 진행',
          '비효율적인 비동기 호출을 최소화하여, 페이지 초기 구동 시간 단축',
          '하드코딩 된 코드를 공통 컴포넌트로 변경하여 가독성 증가',
          'Jira를 활용하여 이슈 관리 프로세스 단축 및 히스토리 관리 진행',
          '조회 및 통계 관련 유저리포팅 1분기 대비 50% 이상 감소',
        ],
      },
      {
        id: 14,
        name: '기타 프로젝트',
        summary: '',
        link: '',
        period: ['2018. 04', '2020. 12'],
        skills: [],
        details: [
          '[삼성 닷컴] 2020 Watch Configurator Page 개발 (2020.06 ~ 2020.12)',
          '[삼성 닷컴] EU 컴포넌트 개발/운영 (2018.07 ~ 2018.09, 2019.03 ~ 2019.06)',
          '[삼성 닷컴] 닷컴 홈 개편 프로젝트 (2018.06 ~ 2019.01)',
          '[삼성 닷컴] Support 개편 프로젝트 (2018.05 ~ 2018.08)',
          '[삼성 닷컴] SHOP 통합 프로젝트 (2018.04 ~ 2018.08)',
          '[사내 시스템] 전자 결재 시스템 개발·운영 (2019.01 ~ 2020.12)',
          '[사내 시스템] 리소스 관리 솔루션 개발·운영  (2019.01 ~ 2020.12)',
        ],
        roles: [],
      },
    ],
  },
]
