import { IProject } from '@/app/(pages)/resume/_components/project/types'

const project: IProject = {
  isShow: true,
  projectList: [
    {
      title: '디어마이홈 서비스 웹, 앱 개발',
      period: ['2024.04', '2025.04'],
      companyName: '라우드',
      summary:
        '디어마이홈 B2C, B2B 서비스 개발 및 사용자 편의성, 접근성 증가를 위한 하이브리드 앱 개발 프로젝트',
      works: [
        {
          text: '디어마이홈 서비스 웹 개발',
          details: [
            '모노레포용 Headless UI 컴포넌트 개발하여 일관적인 DX와 생산성 향상에 기여',
            '프론트엔드 리드로 팀원 프로젝트 일정 관리 및 커뮤니케이션 진행',
            '포트원 v2 결제, 본인 인증 연동',
            '카카오, 구글, 애플 로그인 연동',
            '카카오 맵을 이용한 인테리어 지도 기능 개발',
            '챗봇 대화형 견적 상담 기능 개발',
          ],
        },
        {
          text: '디어마이홈 하이브리드 앱 서비스 런칭',
          details: [
            '포트원 v1 결제, 본인 인증 연동',
            '파이어베이느 앱 푸시 기능 개발',
            '카카오, 애플 로그인 연동',
            '네이티브 앱 기능 브릿지 함수 정의/개발',
          ],
        },
        {
          text: '프론트엔드 인프라 관리',
          details: [
            'AWS 이벤트 브릿지와 람다로 DEV 환경 스케쥴링을 적용하여 서버 유지비용 감소 (월 13% 감소)',
            '모노레포 CI/CD 배포 프로세스 구축',
          ],
        },
      ],
    },
    {
      title: '비엘큐 어드민 모노레포 개발 프로젝트',
      period: ['2023.07', '2023.10'],
      companyName: '비엘큐',
      summary: '어드민 유지보수 향상 및 리뉴얼, 신규 어드민 개발을 위한 모노레포 개발 프로젝트',
      works: [
        {
          text: '프로젝트 정보',
          details: [
            '참여 인원 : 1명 (FE)',
            '기술 스택 : Nextjs 13 App Router, Turborepo, Tailwind-css, Zustand, React-Hook-Form',
            'CI/CD : Github Actions, AWS CodeDeploy',
          ],
        },
        {
          text: '어드민 모노레포 및 CI/CD 세팅',
          details: [
            '공통 컴포넌트, 커스텀 훅, 유틸 함수, 환경변수등 구조를 잡고 문서화하여 팀원들에게 공유 및 교육',
            '서비스별 디자인 토큰 변수화, 레이아웃 공통화를 위한 디자인 가이드 문서 제작, 개발 진행',
            '서비스별 배포를 위한 Github Action Workflow 배포 스크립트 작성',
          ],
        },
      ],
    },
    {
      title: '퀵셀 어드민 개발',
      period: ['2023.07', '2023.10'],
      companyName: '비엘큐',
      summary: '',
      works: [
        {
          text: '주문/배송 기능 개발',
          details: ['배송 서비스 외부 솔루션 스윗트래거 연동'],
        },
        {
          text: '앱의 중고 물품 등록시 AI 판별 지표 시각화 기능 개발',
          details: [],
        },
      ],
    },
    {
      title: '디자이너 포트폴리오 플랫폼',
      period: ['2019.01', '2020.04'],
      companyName: '라우드',
      summary:
        '디자이너들이 자신의 작품을 공유하고 구인/구직 활동을 할 수 있는 온라인 포트폴리오 플랫폼입니다.',
      works: [
        {
          text: 'UI/UX 개발 및 인터랙션 구현',
          details: [
            'Zeplin으로 디자인된 시안을 기반으로 HTML, CSS, JavaScript를 사용하여 웹 페이지 퍼블리싱',
            'jQuery 및 GSAP를 활용한 동적인 UI 인터랙션 및 애니메이션 효과 구현',
            '크로스 브라우징 및 웹 접근성 표준 준수',
          ],
        },
      ],
    },
  ],
}

export default project
