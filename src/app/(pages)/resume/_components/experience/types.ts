import { SkillName } from '@/app/(pages)/resume/_components/common/skill'
import { ICommonArticle } from '@/app/(pages)/resume/_components/common/types'

export type History = {
  department: string
  role: string
  period: [string, string?] // start, end
  workingList: string[]
  skillNameList: SkillName[]
}

export type Experience = {
  companyName: string
  logoName: string
  summary?: string[] // markdown 강조 가능
  employmentStatus: 'retire' | 'employed' | 'recommended_retire'
  historyList: History[]
}

export declare interface IExperience extends ICommonArticle {
  experienceList: Experience[]
  isUsedTotalPeriod?: boolean
}
