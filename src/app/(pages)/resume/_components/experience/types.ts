import { SkillDefinition } from '@/app/(pages)/resume/_components/common/skill'

type History = {
  department: string
  role: string
  period: [string, string?] // start, end
  workingList: string[]
}

type Experience = {
  companyName: string
  summary?: string // markdown 강조 가능
  employmentStatus: 'retire' | 'employed'
  historyList: History[]
  skillKeywordList: SkillDefinition[]
}

export declare interface IExperience {
  experienceList: Experience[]
  isUsedTotalPeriod?: boolean
}
