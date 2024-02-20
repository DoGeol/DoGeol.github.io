import { TAboutMe, TExperience, TInformation } from '@/app/(pages)/(main)/_constant/types'

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
    '주어진 환경에서 <span>효율적</span>으로 일을 처리하기 위해 고민합니다.',
    '동료와의 협업, <span>의사소통</span>을 중요하게 생각합니다.',
    '개발만 잘하는 것이 아닌, <span>일 잘하는 개발자</span>가 되기위해 노력합니다.',
  ],
}

export const EXPERIENCE: TExperience[] = [
  {
    id: 0,
    companyName: '하이브랩',
    department: 'BE개발팀',
    jobPosition: '전임개발자',
    period: ['2022. 07', '2022. 08'],
    project: [],
  },
  {
    id: 1,
    companyName: '하이브랩',
    department: 'BE개발팀',
    jobPosition: '전임개발자',
    period: ['2022. 07', '2022. 08'],
    project: [],
  },
]
