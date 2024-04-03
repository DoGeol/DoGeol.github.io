import { TAboutMe, TCareer, TInformation, TSkill } from '@/app/(pages)/(main)/_constant/types'
import { CAREER_HIVELAB } from '@/app/(pages)/(main)/_constant/_data/career/hivelab'
import { CAREER_WEFUN } from '@/app/(pages)/(main)/_constant/_data/career/wefun'
import { CAREER_WELLO } from '@/app/(pages)/(main)/_constant/_data/career/wello'
import { CAREER_SLDT } from '@/app/(pages)/(main)/_constant/_data/career/sldt'
import { CAREER_BLQ } from '@/app/(pages)/(main)/_constant/_data/career/blq'

export const INFORMATION: TInformation = {
  title: '안녕하세요.<br/>프론트엔드 개발자 <strong>편도걸</strong>입니다.',
  contact: [
    {
      id: 0,
      type: 'email',
      name: 'Email',
      url: 'pdg2491@gmail.com',
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
  CAREER_BLQ,
  CAREER_SLDT,
  CAREER_WELLO,
  CAREER_WEFUN,
  CAREER_HIVELAB,
]
