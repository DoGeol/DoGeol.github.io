import { SkillCategory } from '@/app/(pages)/resume/_components/common/skill'

type Project = {
  title: string
  period: [string, string?] // start, end
  summary: string
  skillKeywordList: SkillCategory[]
  githubUrl?: string
  siteUrl?: string
}

export declare interface IProject {
  projectList: Project[]
}
