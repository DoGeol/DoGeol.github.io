import { SkillName } from '@/app/(pages)/resume/_components/common/skill'

type History = {
  department: string
  role: string
  period: [string, string?] // start, end
  workingList: string[]
  skillNameList: SkillName[]
}

export type Experience = {
  companyName: string
  summary?: string // markdown 강조 가능
  employmentStatus: 'retire' | 'employed' | 'recommended_retire'
  historyList: History[]
  skillNameList?: SkillName[]
}

export declare interface IExperience {
  experienceList: Experience[]
  isUsedTotalPeriod?: boolean
}
