import { ICommonArticle } from '@/app/(pages)/resume/_components/common/types'

type Education = {
  title: string
  period: [string, string?] // start, end
  summary: string
}

export declare interface IEducation extends ICommonArticle {
  educationList: Education[]
}
