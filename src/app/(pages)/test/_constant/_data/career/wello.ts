import { TCareer } from '@/app/(pages)/test/_constant/types'

export const CAREER_WELLO: TCareer = {
  id: 3,
  companyName: '웰로',
  webUrl: 'https://www.wello.info',
  department: '개발팀',
  jobPosition: '프론트엔드 개발자',
  period: ['2021. 12', '2023. 02'],
  stack: ['Vue.js', 'Nuxt.js', 'Sass(scss)', 'Vuex', 'Element-ui'],
  description:
    '<strong>사용자의 정책 소외 문제를 해결하기 위한 정책 큐레이션 서비스</strong>인 <strong>웰로</strong>의 웹 서비스 개발, 운영, ' +
    '<strong>기업의 정부 지원정책 추천, 매칭, 관리 SaaS 서비스</strong>인 <strong>웰로비즈</strong>의 웹 서비스 개발, 운영하였습니다.',
  summary: [
    'B2C 정책 큐레이션 서비스, 웰로의 웹 서비스 개발/운영',
    'B2B 기업 지원정책 추천, 매칭, 관리 SaaS 서비스, 웰로비즈의 웹 서비스 개발/운영',
    '웰로 백오피스 개발/운영',
  ],
  project: [
    {
      id: 33,
      name: '웰로 정책평가, 설문조사, 대리신청 기능 개발',
      summary: '사용자 리텐션 및 보상을 통한 회원가입 유도를 위한 기능 업데이트',
      link: '',
      period: ['2022.08', '2023. 09'],
      skills: ['Vue.js', 'Sass(scss)', 'css3', 'element-ui'],
      details: ['<strong>참여 인원 : </strong> 3명 (FE 2명, BE 1명)'],
      roles: [
        '정책평가 웹/백오피스 기능 개발',
        [
          '백오피스 설문조사 생성 기능 개발',
          [
            'Google Form을 밴치마킹하여 설문조사 생성 기능 개발',
            'JSON 데이터로 설문조사 항목을 구성하고, 사용자 웹에서 대화형으로 설문을 받을 수 있도록 설계',
          ],
        ],
        [
          '정부 정책 대리신청 기능 개발',
          [
            '<strong>Canvas 라이브러리</strong>를 사용하여 대리신청시 필요한 <strong>서명을 이미지 파일로 저장하고 관리</strong>할 수 있도록 개발',
          ],
        ],
      ],
    },
    {
      id: 34,
      name: '웰로 회원가입 프로세스 개선 프로젝트',
      summary: '회원가입시 개인화 데이터 입력이 많은 상황에서 이탈률을 개선하기 위한 프로젝트',
      link: '',
      period: ['2022.11', '2022. 11'],
      skills: ['Vue.js', 'Nuxt.js', 'Sass(scss)', 'css3', 'Vuex'],
      details: ['<strong>참여 인원 : </strong> 3명 (FE 1명, BE 1명, PM 1명)'],
      roles: [
        [
          'Hackle 솔루션을 사용하여 회원가입시 정보입력 <strong>A/B 테스트를 제안, 개발 진행</strong>',
          [
            'A : 정책 개인화 큐레이션 추천을 위한 필수 정보만 입력받도록 개발 (추가정보 선택적 입력)',
            'B : 유저가 처음에 전체를 입력할지 추가정보를 입력할지 선택하는 팝업 노출',
          ],
        ],
        [
          'A/B 테스트로 의미있는 지표를 도출하여 <strong>회원가입 이탈률 감소에 기여</strong>',
          ['GA 회원가입률 완료 지표 58.82% -> 87.98%로 개선'],
        ],
      ],
    },
    {
      id: 31,
      name: 'B2B 웰로비즈 서비스 개발',
      summary: '기업의 지원정책을 추천하고, 매칭, 관리가 가능한 Saas 서비스 개발',
      link: '',
      period: ['2022. 03', '2023. 05'],
      skills: ['Nuxt.js', 'Sass(scss)', 'css3', 'Vuex'],
      details: ['<strong>참여 인원 : </strong> 3명 (FE 1명, BE 1명, PM 1명)'],
      roles: [
        [
          '프론트엔드 리드 개발',
          [
            'Jira Task 관리&분배, 일정 관리 매니징 진행',
            '개발 문서화를 주도적으로 진행하여 개발에만 집중할 수 있도록 관리',
            '유기적으로 인원을 배치하고, 타이트하게 Task 일정 관리하여 개발 기간 단축으로 테스트 기간 확보',
          ],
        ],
        [
          '서류관리, 사업일정관리, 정책 신청 이메일 발송 기능 개발',
          [
            '폴라리스 오피스를 내제화 하여 한글문서 편집기능 추가',
            '쿠콘 솔루션(jQuery)를 Vue에서 사용할 수 있도록 내제화하여 정부민원서류 조회/다운로드 기능 개발',
            '사업일정관리 캘린더 기능에 Google 캘린더를 연동 기능 추가',
          ],
        ],
        [
          'SEO, Sitemap 고도화',
          [
            'sitemap에 정책을 등록하고 관리할 수 있는 메뉴 개발',
            'sitemap 최대 갯수 50000개 제한으로 SEO가 제대로 적용되지 않는 이슈가 있어, <strong>nuxt-sitemap</strong>을 사용하여, 백오피스에서 등록한 sitemap 정보를 <strong>build 과정에서 스플리팅하여 sitemap을 동적 생성</strong>하도록 고도화',
          ],
        ],
      ],
    },
    {
      id: 30,
      name: 'B2C 웰로 서비스 개발/운영',
      summary:
        '유저의 정보를 분석하여 개인화를 통해 정부 정책을 추천하고 매칭하는 서비스 리뉴얼 개발/운영',
      link: '',
      period: ['2022. 01', '2023. 02'],
      skills: ['Vue.js', 'Sass(scss)', 'css3'],
      details: [''],
      roles: [
        '기존 디자인 시스템을 디자이너와 협업을 통해 개선하고, 디자인 리뉴얼 진행',
        '효율적이지 못한 css 구조를 개선하고, scss로 컬러, 폰트등 <strong>자동화 세팅으로 개발 환경 개선</strong>',
      ],
    },
    {
      id: 32,
      name: '웰로 백오피스 서비스 개발/운영',
      summary: '웰로/웰로비즈를 관리하기 위한 백오피스 서비스 개발/운영',
      link: '',
      period: ['2022.01', '2023. 02'],
      skills: ['Vue.js', 'Sass(scss)', 'css3', 'element-ui'],
      details: [''],
      roles: [
        '프로덕트 환경세팅 및 개발 (기여도: 100%)',
        '워드프레스로 운영되던 기존 백오피스의 마이그레이션 진행',
        '디자인 라이브러리(element-ui)를 사용한 컴포넌트 기능 개발 진행, 백오피스 환경에 맞게 사전 개발을 진행하여 개발 기간 단축',
        '엑셀 업로드/다운로드, 비밀번호 옵션 기능 모듈화 개발',
      ],
    },
  ],
}
