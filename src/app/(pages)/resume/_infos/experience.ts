import { IExperience } from '@/app/(pages)/resume/_components/experience/types'

const experience: IExperience = {
  experienceList: [
    {
      companyName: '주식회사 라우드',
      summary:
        '**서비스 개발의 0 to 1을 경험**하고, 프론트엔드 팀장 역할을 같이하여 **팀원 관리 능력**을 성장시키기 위해 노력했습니다.',
      employmentStatus: 'retire',
      historyList: [
        {
          department: '프로덕트팀',
          role: '프론트엔드 팀장',
          period: ['2024-04-15', '2025-04-15'],
          workingList: [
            '디어마이홈 서비스 개발/운영',
            '디어마이홈 백오피스 개발/운영',
            '디어마이홈 Flutter 하이브리드 앱 개발',
            '자사 마루제품 자재 판매를 위한 쇼핑몰 서비스 마이그레이션',
          ],
        },
      ],
      skillKeywordList: [],
    },
  ],
  isUsedTotalPeriod: true,
}

export default experience
