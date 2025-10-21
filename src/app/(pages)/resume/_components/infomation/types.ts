import { ICommonArticle } from '@/app/(pages)/resume/_components/common/types'

type IntroduceText = string | TrustedHTML
type Contact = {
  id: number
  type: 'site' | 'email' | 'github' | 'tel'
  name: string
  url: string
  target: '_self' | '_blank'
}

export declare interface IInformation extends ICommonArticle {
  introduceText: IntroduceText
  contactList: Contact[]
}
