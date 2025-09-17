import { TCareer } from '@/app/(pages)/old-resume/_constant/types'

export const CAREER_HIVELAB: TCareer = {
  id: 1,
  companyName: '하이브랩',
  webUrl: 'https://hivelab.co.kr',
  department: 'BE개발팀',
  jobPosition: '전임 개발자',
  period: ['2018. 04', '2020. 12'],
  stack: ['Vue.js', 'Nuxt.js', 'scss', 'css3'],
  description:
    '삼성전자의 글로벌 웹페이지를 구성하는 Adobe CMS 솔루션(AEM)의 <strong>컴포넌트 단위의 위젯, 페이지</strong> 개발, 운영, <strong>사내시스템인 전자 결재 시스템, 리소스 관리 솔루션</strong>의 개발, 운영을 하였습니다.<br/>' +
    '<strong>개발 위키 기술 공유, 주기적인 사내 스터디 등을 주도</strong>하면서 동료들과 같이 성장하는 환경을 만들기 위해 노력했습니다.',
  summary: [
    '삼성 글로벌 웹 사이트, CMS 솔루션(AEM) 컴포넌트,페이지 개발/운영',
    '[사내시스템] ERP 전자 결재 시스템 개발/운영',
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
      details: [''],
      roles: [
        'CMS 솔루션의 복잡한 컨텐츠 구성 난이도를 감소시키기위해 <strong>컨텐츠 구성하는 화면의 프리뷰 팝업 위젯을 개발</strong>하여, 페이지 제작 시간 단축',
        '국가별 API Spec 문서를 제작하고, API를 함수화하여 타 프로젝트에서 사용 할 수 있도록 가공',
        'RawData 데이터 가공 기능 담당 개발',
      ],
    },
    {
      id: 11,
      name: '[삼성] S10 / N10 Bundle Package 랜딩 페이지 개발',
      summary: '삼성 닷컴 S10 번들 프로모션 랜딩페이지 위젯 개발',
      link: '',
      period: ['2019. 09', '2019. 10'],
      skills: ['Javascript', 'jQuery', 'JSP', 'SheetJs'],
      details: [''],
      roles: [
        '프론트엔드 담당 개발',
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
      details: [''],
      roles: [
        '출퇴근 시간 관리 기능 추가',
        '출퇴근 수기 입력 CRUD API 개발',
        '근로시간 통계 계산 비즈니스 로직 개발',
        'jQuery + moment.js 활용한 DatePicker 리펙토링',
        [
          '리소스 관리 솔루션의 데이터 접근시 발생한 CORS에러를 해결하기 위한 타 도메인 간의 CORS 이슈 처리에 대한 검토 및 개발 진행',
          ['내부 비즈니스 로직에서 DB에 접근할 수 있도록 세팅 변경'],
        ],
      ],
    },
    {
      id: 13,
      name: '[사내 시스템] 리소스 관리 솔루션 통계 오류 개선 프로젝트',
      summary: '사내 정책 변경에 의한 리소스 관리 솔루션 통계 및 기능 개선 프로젝트',
      link: '',
      period: ['2020. 01', '2020. 06'],
      skills: ['Vue.js', 'Vuex', 'Javascript', 'HTML5', 'css3', 'Java', 'Spring Boot', 'Mysql'],
      details: ['<strong>참여 인원 : </strong> 2명 (BE 2명)'],
      roles: [
        '전반적인 개발을 진행하면서, 프론트엔드 관련 수정은 전담하여 진행',
        '비효율적인 비동기 호출을 최소화하여, 페이지 초기 구동 시간 단축',
        '하드코딩 된 코드를 공통 컴포넌트로 변경하여 가독성 증가',
        [
          '통계 관련 DB Query 수정 & 속도 튜닝',
          ['조회 및 통계 관련 유저리포팅 1분기 대비 50% 이상 감소'],
        ],
        [
          'Jira를 활용하여 이슈 관리 프로세스 단축 및 히스토리 관리 진행',
          ['장애보고서 작성을 위한 가이드 문서, 템플릿 제작'],
        ],
      ],
    },
    {
      id: 14,
      name: '기타 프로젝트',
      summary: '',
      link: '',
      period: ['2018. 04', '2020. 12'],
      skills: [],
      details: [],
      roles: [
        '[삼성 닷컴] 2020 Watch Configurator Page 개발 (2020.06 ~ 2020.12)',
        '[삼성 닷컴] EU 컴포넌트 개발/운영 (2018.07 ~ 2018.09, 2019.03 ~ 2019.06)',
        '[삼성 닷컴] 닷컴 홈 개편 프로젝트 (2018.06 ~ 2019.01)',
        '[삼성 닷컴] Support 개편 프로젝트 (2018.05 ~ 2018.08)',
        '[삼성 닷컴] SHOP 통합 프로젝트 (2018.04 ~ 2018.08)',
        '[사내 시스템] 전자 결재 시스템 개발·운영 (2019.01 ~ 2020.12)',
        '[사내 시스템] 리소스 관리 솔루션 개발·운영  (2019.01 ~ 2020.12)',
      ],
    },
  ],
}
