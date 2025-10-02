import { ICommonArticle } from '@/app/(pages)/resume/_components/common/types'

type Activity = {
  title: string
  period: [string, string?] // start, end
  summary: string
}

export declare interface IActivity extends ICommonArticle {
  activityList: Activity[]
}
