import { ICommonArticle } from '@/app/(pages)/resume/_components/common/types'

type Introduce = {
  textList: string[]
  latestUpdatedDate: string // YYYY-MM-DD
} & ICommonArticle

export declare interface IIntroduce extends Introduce {}
