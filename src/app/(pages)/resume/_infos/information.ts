import { IInformation } from '@/app/(pages)/resume/_components/infomation/types'

const information: IInformation = {
  introduceText: `안녕하세요.<br/>프론트엔드 개발자 <strong>편도걸</strong>입니다.`,
  contacts: [
    // example: { id: 0, type: 'default', name: '메일', url: 'pdg2491@naver.com', target: '_blank' }
    { id: 0, type: 'email', name: '메일', url: 'pdg2491@naver.com', target: '_self' },
    { id: 1, type: 'github', name: '깃허브', url: 'https://github.com/DoGeol', target: '_blank' },
  ],
}

export default information
