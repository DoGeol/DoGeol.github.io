import { TCareer } from '@/app/(pages)/(main)/_constant/types'

export const CAREER_BLQ: TCareer = {
  id: 5,
  companyName: '주식회사 비엘큐',
  webUrl: 'https://www.testvalley.co.kr',
  department: '프로덕트팀',
  jobPosition: '프론트엔드 개발자 / 사원',
  period: ['2023. 05', '2024. 02'],
  stack: [
    'React.js',
    'Next.js',
    'Typescript',
    'Emotion',
    'Tailwindcss',
    'Turborepo',
    'Github Action',
    'AWS CodeDeploy',
  ],
  description: '테스트밸리',
  summary: [
    'B2C 가전제품 판매, 체험, 중고판매 서비스, <strong>테스트밸리</strong>의 개발/운영',
    'B2B/B2C 중고거래 서비스, <strong>퀵셀</strong>의 개발/운영',
    '비엘큐 백오피스 서비스 모노레포 적용 및 마이그레이션 진행',
  ],
  project: [
    {
      id: 50,
      name: '백오피스 모노레포 세팅',
      summary: '어드민 서비스 유지보수, 개발 효율 증가를 위한 백오피스 모노레포 프로젝트',
      link: '',
      period: ['2023. 07', '2023. 08'],
      skills: [
        'Next.js 13',
        'Typescript',
        'Turborepo',
        'Tailwindcss',
        'Zustand',
        'React-hook-form',
        'Github Action',
        'AWS CodeDeploy',
      ],
      details: [
        '참여 개발자 1명 (FE 1)',
        '모노레포 프로젝트 신규 세팅(기여도 100%) - 23.07.20 ~ 23.08.09',
        '모노레포 공통 컴포넌트 내제화(기여도 90%)',
        'CI/CD 세팅 (기여도 60%)',
      ],
      roles: [
        '모노레포를 사전 세팅하여, 이후 진행할 프로젝트의 어드민 환경 구축 시간 단축에 기여',
        '공통 컴포넌트, 커스텀 훅, 유틸, 환경변수등 구조를 잡고, 문서화하여 팀원들에게 공유',
      ],
    },
    {
      id: 51,
      name: '퀵셀 어드민 서비스 개발/운영',
      summary: 'B2C 중고 거래 신규 서비스 개발/운영',
      link: '',
      period: ['2023. 07', '2024. 02'],
      skills: [
        'Next.js 13',
        'Typescript',
        'Turborepo',
        'Tailwindcss',
        'Zustand',
        'React-hook-form',
      ],
      details: [
        '참여 개발자 5명 (BE 3, FE 2)',
        '퀵셀 어드민 서비스 개발(기여도 80%) - 23.08.10 ~ 23.09.22',
        '유지보수 및 시스템 고도화 진행 - 23.09.23 ~ 24.02.29',
        '모노레포 세팅/리펙토링 병행하여 개발 진행',
      ],
      roles: [
        '사전 개발 세팅을 통해 개발 시간을 단축하여 개발/테스트 기간을 확보',
        '모노레포의 배포 전략을 보완하고, 서비스별 Primary 컬러 변수화, 레이아웃 공통화등 리펙토링 진행',
        '카테고리/제품 등록/관리 기능 설계에 참여, 기능 제안',
        '제품 발송 관련 프로세스 기능 개발 및 문서화',
      ],
    },
    {
      id: 52,
      name: '테스트밸리 어드민 서비스 마이그레이션',
      summary: '운영중인 테스트밸리 어드민 백오피스 마이그레이션 프로젝트',
      link: '',
      period: ['2023. 12', '2024. 01'],
      skills: [
        'Next.js 13',
        'Typescript',
        'Turborepo',
        'Tailwindcss',
        'Zustand',
        'React-hook-form',
      ],
      details: [
        '참여 개발자 2명 (BE 1, FE 1)',
        '테스트밸리 백오피스 솔루션의 운영 리소스 감소를 위해 모노레포로 마이그레이션 작업 진행 (기여도 80%) (23.12.19 ~ 23.01.05)',
        '신규 메뉴 개발 및 제품 등록 페이지 고도화 (기여도 90%)',
        '남는 시간에 운영 업무와 병행하여 백엔드 개발자와 협업 형태로 진행',
      ],
      roles: [
        '최소한의 리소스로 짧은 기간 내에 메뉴 17개(80%) 마이그레이션 완료',
        '슬랙 봇 명령어로 추가/삭제/관리를 진행하는 데이터 관리 메뉴 추가로 운영 이슈 감소에 기여(사용자 실수로 인한 수정요청 횟수 80% 감소)',
      ],
    },
    {
      id: 53,
      name: '메세지서버 어드민 서비스 개발',
      summary: '운영되는 서비스들의 FCM 앱 푸시, 알림톡 발송 관리를 위한 메세지서버 어드민 개발',
      link: '',
      period: ['2023. 10', '2023. 11'],
      skills: [
        'Next.js 13',
        'Typescript',
        'Turborepo',
        'Tailwindcss',
        'Zustand',
        'React-hook-form',
      ],
      details: [
        '기존 백엔드 DB에서 관리되던 앱 푸시, 알림톡 템플릿 관리 개발(기여도 80%) (23.10.11 ~ 23.11.20)',
        '앱 FCM 예약 발송 기능 개발',
      ],
      roles: [
        'iFrame으로 서비스별 어드민에 내제화 할수 있게 개발하여 기간 50% 단축',
        '마케팅-개발 부서간의 리소스 부족으로 인한 마케팅 병목현상 해소로 서비스 리텐션 지표 32% 상승, 개발팀 리소스 확보(평균 주 1MD 리소스 확보)',
        '템플릿, 파라미터를 검수하는 단계를 추가하여, 오타와 같은 이슈 발생률 감소',
        'static export하여 서버 메모리 리소스 최적화 진행',
      ],
    },
    {
      id: 54,
      name: 'B2C 테스트밸리 프로모션 이벤트 페이지 개발',
      summary:
        '정적 페이지로 개발되는 이벤트 상세페이지를 마케터가 구성할 수 있도록 백오피스 서비스에 내제화 하는 프로젝트',
      link: '',
      period: ['2023. 06', '2023. 06'],
      skills: ['React', 'Next.js 12', 'Emotion', 'Typescript', 'Redux', 'Redux-saga'],
      details: [
        '참여 개발자 1명 (FE 1)',
        '마케팅 팀의 요구사항을 취합하고, 필요한 기능을 조사하여 구조 설계 (기여도 100%) - 2023.06.21 ~ 2023.06.29',
      ],
      roles: [
        '이벤트 페이지 제작 요청 리소스 감소 (주 1~2MD 리소스 확보)',
        '모듈화하여 퀵셀 어드민에 동일하게 기능 적용',
      ],
    },
    {
      id: 55,
      name: '기타 프로젝트',
      summary: '',
      link: '',
      period: ['2023. 05', '2024. 02'],
      skills: [],
      details: [
        '테스트밸리 사용자/어드민 멤버십 기능 개발 (기여도 100%) - 23.07.13 ~ 23.07.25',
        '퀵셀 중고거래 유도 페이지 개발',
        '퀵셀 소개페이지 개발',
        '테스트밸리 어드민 이미지 썸네일 등록 기능 최적화',
        '테스트밸리 사용자/어드민 서비스 개발/운영',
      ],
      roles: [],
    },
  ],
}
