import React from 'react'
import { Experience } from './types'
import { calculateExperiencePeriod, getCompanyPeriodText } from './utils'
import HighlightedText from '@/features/highlighted-text'
import ExperienceHistory from './experience-history'

type Props = {
  experience: Experience
}

const ExperienceItem = ({ experience }: Props) => {
  return (
    <li
      className={
        'flex flex-col gap-4 border-b border-neutral-200 py-6 last:border-b-0 dark:border-neutral-700'
      }
    >
      <div className={'flex flex-col'}>
        <h3 className={'text-2xl font-bold text-neutral-800 dark:text-neutral-50'}>
          {experience.companyName}
        </h3>
        <div className={'flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400'}>
          <span>{getCompanyPeriodText(experience)}</span>
          <span>({calculateExperiencePeriod(experience)})</span>
        </div>
      </div>

      {experience.summary && (
        <p className="rounded-md bg-gray-100 px-2.5 py-2 font-light whitespace-pre-wrap dark:bg-neutral-700">
          <HighlightedText text={experience.summary} useUnderline={true} />
        </p>
      )}

      <ul className={'mt-2 flex flex-col gap-4'}>
        {experience.historyList.map((history, index) => (
          <ExperienceHistory key={index} history={history} />
        ))}
      </ul>
    </li>
  )
}

export default ExperienceItem
