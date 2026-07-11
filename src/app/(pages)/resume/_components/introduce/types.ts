import { ICommonArticle } from '@/app/(pages)/resume/_components/common/types'

export type IIntroduce = {
  textList: string[]
  latestUpdatedDate: string // YYYY-MM-DD
} & ICommonArticle
