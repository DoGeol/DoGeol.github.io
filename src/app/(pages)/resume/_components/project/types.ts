import { ICommonArticle } from '@/app/(pages)/resume/_components/common/types'

type Work = {
  text: string
  details: string[]
}

type Project = {
  title: string
  period: string[] // start, end
  companyName: string
  summary: string
  works: Work[]
}

export declare interface IProject extends ICommonArticle {
  projectList: Project[]
}
