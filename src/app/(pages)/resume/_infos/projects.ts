import { IProject } from '@/app/(pages)/resume/_components/project/types'

const project: IProject = {
  isShow: true,
  projectList: [
    {
      title: 'AI 아동 심리 상담 플랫폼',
      period: ['2022.01', '2023.06'],
      companyName: '웰로',
      summary:
        'AI 기술을 활용하여 아동의 심리 상태를 분석하고 맞춤형 상담을 제공하는 웹 기반 플랫폼입니다.',
      works: [
        {
          text: '프론트엔드 아키텍처 설계 및 개발',
          details: [
            'Next.js와 TypeScript를 기반으로 확장성과 유지보수성을 고려한 프론트엔드 아키텍처 설계',
            'React-Query를 활용한 서버 상태 관리 및 캐싱 전략 수립으로 API 호출 수 70% 감소',
            'Atomic Design System을 적용한 재사용 가능한 UI 컴포넌트 라이브러리 구축',
          ],
        },
        {
          text: '실시간 화상 상담 기능 개발',
          details: [
            'WebRTC 기술을 활용하여 상담사와 아동 간의 실시간 양방향 화상 통신 기능 구현',
            'WebSocket을 이용한 실시간 드로잉 및 인터랙션 기능 개발로 상담 효과 증대',
          ],
        },
      ],
    },
    {
      title: '취미 기반 소셜 네트워킹 서비스',
      period: ['2020.05', '2021.12'],
      companyName: '위펀',
      summary: '공통의 취미를 가진 사용자들이 소통하고 교류할 수 있는 커뮤니티 서비스입니다.',
      works: [
        {
          text: '웹 프론트엔드 개발',
          details: [
            'React와 Redux를 사용하여 동적이고 반응적인 사용자 인터페이스 개발',
            'Socket.IO를 활용한 실시간 채팅 및 그룹 활동 기능 구현',
            '사용자 인증 및 프로필 관리 시스템 구축',
          ],
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
