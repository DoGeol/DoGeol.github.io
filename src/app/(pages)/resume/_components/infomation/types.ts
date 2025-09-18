type IntroduceText = string | TrustedHTML
type Contact = {
  id: number
  type: 'site' | 'email' | 'github'
  name: string
  url: string
  target: '_self' | '_blank'
}

export interface IInformation {
  introduceText: IntroduceText
  contacts: Contact[]
}
