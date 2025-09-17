import { TCareer } from '@/app/(pages)/old-resume/_constant/types'

export const CAREER_WEFUN: TCareer = {
  id: 2,
  companyName: '(주) 위펀',
  webUrl: 'https://hivelab.co.kr',
  department: '개발팀',
  jobPosition: '프론트엔드 개발자 / 매니저',
  period: ['2021. 06', '2021. 12'],
  stack: ['Vue.js', 'Nuxt.js', 'Sass(scss)', 'css3', 'Vuex', 'Element-ui', 'jQuery'],
  description:
    '위펀의 <strong>다양한 서비스 환경을 개선</strong>하고, 마이그레이션, 개발, 운영하였습니다.',
  summary: [
    '스낵24 웹/앱 서비스 개발/운영',
    '선물24 웹/앱 서비스 개발/운영',
    '위펀 백오피스 리뉴얼 및 서비스 개발/운영 ',
    '위펀 서비스 랜딩 페이지 신규 프로젝트 환경 마이그레이션 및 리뉴얼',
  ],
  project: [
    {
      id: 20,
      name: '식권 24 웹앱 서비스 개발',
      summary:
        '정적 페이지로 개발되는 테스트밸리의 이벤트 페이지를 마케팅팀에서 마케터가 구성할 수 있도록 백오피스에 내제화 하는 프로젝트',
      link: '',
      period: ['2021. 11', '2021. 12'],
      skills: ['Vue.js', 'Sass(scss)', 'css3', 'Vuex'],
      details: ['<strong>참여 인원 : </strong> 4명 (FE 1명, BE 1명, Design 1명, PM 1명)'],
      roles: [
        ['신규 프론트엔드 웹앱 프로덕트 환경 세팅 진행', ['브릿지 함수 정의 및 설계에 참여']],
        [
          '카카오 맵의 커스텀 오버레이를 이용하여 마커 선택 기능 고도화 개발',
          [
            'document.elementsFromPoint로 찍힌 좌표의 음식점이 겹쳐있을 경우 목록화하여 선택할 수 있도록 기능 고도화 진행',
          ],
        ],
        '식권 결제 페이지, 함께 결제 페이지, 키패드 기능 개발',
        '식권 웹앱 카카오맵 연동 및 리뷰 기능, 결제 기능 개발(payple 결제 서비스 연동 등)',
        '관리자 페이지 식권 관리 페이지 개발 담당',
      ],
    },
    {
      id: 21,
      name: '스낵24 관리자 페이지 서비스 리뉴얼',
      summary:
        'B2B 통합 서비스 프로덕트의 소스코드 분리 및 서비스 고도화를 위한 마이그레이션 프로젝트',
      link: '',
      period: ['2021. 06', '2021. 07'],
      skills: ['Vue.js', 'Sass(scss)', 'css3'],
      details: ['<strong>참여 인원 : </strong> 4명 (FE 2명, BE 1명)'],
      roles: [
        '하나의 저장소에서 통합 관리하던 FE 소스코드를 분리하는 작업 진행',
        '서비스 신청을 해피콜(유선) 프로세스를 개선하기 위한 서비스 신청 페이지 고도화',
        '서비스 신청, 가입시 사용하는 멤버 관리 페이지 개발',
        '프론트엔드 개발의 마크업 컨벤션 정의',
        'Vue 프로덕트 Form 엘리먼트 컴포넌트 개발',
      ],
    },
    {
      id: 22,
      name: '위펀 서비스 랜딩페이지 이관 및 리뉴얼',
      summary: '서비스 소개 랜딩페이지를 신규 프로덕트로 이관 및 리뉴얼 프로젝트',
      link: '',
      period: ['2021. 08', '2021. 10'],
      skills: ['Vue.js', 'Sass(scss)', 'css3'],
      details: ['<strong>참여 인원 : </strong> 3명 (FE 2명, Design 1명)'],
      roles: [
        '타사 웹 호스팅 서비스를 통해 관리하던 서비스 소개 페이지의 내제화',
        '적응형 페이지(pc, mobile) 개발하여 최적화 진행',
        '디자인 공통화를 위한 컴포넌트 개발 및 CSS 리펙토링을 담당',
        '번들 용량 최적화(Gzip) 적용하여 페이지 초기 로딩 시간 단축',
        '영역에 도달하면 trigger되는 컴포넌트를 만들어, 부분 렌더링되도록 수정하여 페이지 초기 로딩 시간 단축',
      ],
    },
    {
      id: 23,
      name: '스낵24 웹앱 리뉴얼',
      summary:
        '스낵24 앱, 웹앱 페이지의 디자인 리뉴얼을 진행하면서 비효율적인 로직 및 설계를 개선하기 위한 프로젝트',
      link: '',
      period: ['2021. 10', '2021. 11'],
      skills: ['Nuxt.js', 'Sass(scss)', 'css3'],
      details: ['<strong>참여 인원 : </strong> 1명 (FE 1명)'],
      roles: [
        'SCSS 적용 및 공통화 진행하여 개발시간 단축',
        '비효율적인 비동기 로직을 개선하여, 메인페이지 로딩 속도 단축 (약 30% 속도 개선)',
      ],
    },
    {
      id: 24,
      name: '생일24 관리자 페이지 개발, 리뉴얼',
      summary: 'B2B 기프티콘, 선물 관리 서비스 고도화 프로젝트',
      link: '',
      period: ['2021. 07', '2021. 07'],
      skills: ['Nuxt.js', 'Sass(scss)', 'css3', 'SheetJs'],
      details: ['<strong>참여 인원 : </strong> 2명 (FE 1명, BE 1명)'],
      roles: [
        '엑셀로 관리하던 기프티콘 선물 관리 기능 추가',
        '기념일 별 명단 관리를 위한 엑셀 벌크 업로드, 다운로드 관리 기능 추가',
      ],
    },
    {
      id: 25,
      name: '기타 프로젝트',
      summary: '',
      link: '',
      period: ['2021. 06', '2021. 12'],
      skills: [],
      details: [],
      roles: [
        '오피스24 나이키 전용 커스텀 고도화 (2021.09 ~ 2021.09)',
        '퀵24 서비스 개발 (2021.07 ~ 2021.07)',
      ],
    },
  ],
}
