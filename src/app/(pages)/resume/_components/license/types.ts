import { ICommonArticle } from '@/app/(pages)/resume/_components/common/types'

type License = {
  title: string
  date: string // YYYY.MM
  issuer: string
}

export declare interface ILicense extends ICommonArticle {
  licenseList: License[]
}
