type TText = string | TrustedHTML

export type TInformation = {
  title: TText
  contact: { id: number; type: string; name: string; url: string; target: '_self' | '_blank' }[]
}

export type TExperience = {
  id: number
  companyName: string
  department: string
  jobPosition: string
  period: [string, string]
  project: TExperienceProject[]
}

export type TExperienceProject = {
  id: number
  name: TText
  summary: TText
  link: string
  skills: string[]
  details: TProjectDetail[]
}

export type TProjectDetail = {
  id: number
  title: TText
  descriptions: TText[]
}

export type TAboutMe = {
  title: TText
  descriptions: TText[]
}
