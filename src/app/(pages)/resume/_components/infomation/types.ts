type IntroduceText = string | TrustedHTML
type Contact = {
  id: number
  type: 'site' | 'email' | 'github'
  name: string
  url: string
  target: '_self' | '_blank'
}

export declare interface IInformation {
  introduceText: IntroduceText
  contactList: Contact[]
}
