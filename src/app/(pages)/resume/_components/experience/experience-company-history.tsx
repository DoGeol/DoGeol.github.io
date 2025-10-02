import React from 'react'
import { History } from './types'
import ExperienceSkills from './experience-skills'

type Props = {
  history: History
  isShowPeriod?: boolean
}

const ExperienceCompanyHistory = ({ history, isShowPeriod = true }: Props) => {
  const formatDate = (date: string) => date.substring(0, 7).replace('-', '.')

  return (
    <li className={'grid gap-1'}>
      <div className={'flex items-center gap-2 text-base'}>
        <p className={'font-semibold text-neutral-700 dark:text-neutral-200'}>
          {history.department}
        </p>
        <span className="text-neutral-500 dark:text-neutral-400">/</span>
        <p className="text-neutral-500 dark:text-neutral-400">{history.role}</p>
      </div>
      {isShowPeriod && (
        <p className={'text-sm text-neutral-500 dark:text-neutral-400'}>
          {formatDate(history.period[0])} ~ {history.period[1] && formatDate(history.period[1])}
        </p>
      )}
      <div className={'mt-3 pl-3'}>
        <ul className={'flex list-outside list-disc flex-col gap-1 pl-5'}>
          {history.workingList.map((work, i) => (
            <li key={i}>{work}</li>
          ))}
          <ExperienceSkills skillNameList={history.skillNameList} />
        </ul>
      </div>
    </li>
  )
}

export default ExperienceCompanyHistory
