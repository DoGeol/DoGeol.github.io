import React from 'react'
import { Experience } from './types'
import { calculateExperiencePeriod, getCompanyPeriodText, getEmploymentStatusText } from './utils'
import HighlightedText from '@/features/highlighted-text'
import ExperienceCompanyHistory from './experience-company-history'

type Props = {
  experience: Experience
}

const ExperienceCompany = ({ experience }: Props) => {
  return (
    <li
      className={
        'flex flex-col gap-4 border-b border-neutral-200 py-8 last:border-b-0 dark:border-neutral-700'
      }
    >
      <div className={'flex items-center gap-3'}>
        <div
          className={
            'inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-neutral-100 bg-white dark:border-neutral-600'
          }
        >
          <img
            className={'w-full'}
            src={`/company/logo/${experience.logoName}.webp`}
            alt={`${experience.logoName}_logo`}
          />
        </div>
        <div className={'flex flex-col'}>
          <h3 className={'text-2xl font-bold text-neutral-800 dark:text-neutral-50'}>
            {experience.companyName}
          </h3>
          <div
            className={'flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400'}
          >
            <span>{getCompanyPeriodText(experience)}</span>
            <span>({calculateExperiencePeriod(experience)})</span>
          </div>
          {experience.employmentStatus === 'recommended_retire' && (
            <div
              className={'flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400'}
            >
              {getEmploymentStatusText(experience.employmentStatus)}
            </div>
          )}
        </div>
      </div>

      {experience.summary && experience.summary.length > 0 && (
        <div
          className={'space-y-3 rounded-2xl bg-gray-50 px-4 py-3 font-light dark:bg-neutral-800'}
        >
          {experience.summary?.map((text, idx) => (
            <p key={idx} className="break-keep whitespace-pre-wrap">
              <HighlightedText text={text} useUnderline={true} />
            </p>
          ))}
        </div>
      )}

      <ul className={'mt-2 flex flex-col gap-4'}>
        {experience.historyList.map((history, index) => (
          <ExperienceCompanyHistory key={index} history={history} />
        ))}
      </ul>
    </li>
  )
}

export default ExperienceCompany
