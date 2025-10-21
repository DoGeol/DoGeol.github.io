import { ICommonArticle } from '@/app/(pages)/resume/_components/common/types'

type Education = {
  title: string
  period: [string, string?] // start, end
  isGraduate: boolean
  major: string
  summary: string
}

export declare interface IEducation extends ICommonArticle {
  educationList: Education[]
}
