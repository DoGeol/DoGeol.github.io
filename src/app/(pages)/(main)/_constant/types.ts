type TText = string | TrustedHTML

export type TInformation = {
  title: TText
  contact: { id: number; type: string; name: string; url: string; target: '_self' | '_blank' }[]
}

export type TCareer = {
  id: number
  companyName: string
  webUrl: string
  department: string
  jobPosition: string
  period: [string, string]
  stack: string[]
  description: string
  summary: string[]
  project: TProject[]
}

export type TProject = {
  id: number
  name: string
  summary: string
  link: string
  period: [string, string]
  skills: string[]
  details: string[]
  roles: string[]
}

export type TSkill = {
  id: number
  name: string
  icon?: string
  type: string
  url?: string
}

export type TAboutMe = {
  title: TText
  descriptions: TText[]
}

export type TExperience = TCareer[]
