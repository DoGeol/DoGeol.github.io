import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import experience from '@/app/(pages)/resume/_infos/experience'
import HighlightedText from '@/features/highlighted-text'
import { SKILLS } from '@/app/(pages)/resume/_components/common/skill'
import {
  calculateExperiencePeriod,
  calculateTotalExperience,
  getCompanyPeriodText,
  getEmploymentStatusText,
} from './utils'
import SkillBadge from '@/app/(pages)/resume/_components/common/skill-badge'

const Experience = () => {
  const formatDate = (date: string) => date.substring(0, 7).replace('-', '.')

  return (
    <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start')}>
      <div className={'flex items-end justify-start gap-2'}>
        <h2 className={'text-primary-600 text-3xl font-medium'}>Experience</h2>
        {experience.isUsedTotalPeriod && (
          <p className={'mb-1 text-sm text-neutral-500 dark:text-neutral-400'}>
            {calculateTotalExperience(experience)}
          </p>
        )}
      </div>
      <ul className={'flex w-full flex-col pl-3'}>
        {experience.experienceList.map((exp) => (
          <li
            key={exp.companyName}
            className={
              'flex flex-col gap-4 border-b border-neutral-200 py-6 last:border-b-0 dark:border-neutral-700'
            }
          >
            <div className={'flex flex-col'}>
              <h3 className={'text-2xl font-bold text-neutral-800 dark:text-neutral-50'}>
                {exp.companyName}
              </h3>
              <div
                className={
                  'flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400'
                }
              >
                <span>{getCompanyPeriodText(exp)}</span>
                <span>({calculateExperiencePeriod(exp)})</span>
              </div>
            </div>

            {exp.summary && (
              <p className="ml-2 rounded-md bg-gray-100 px-3 py-2 font-light whitespace-pre-wrap dark:bg-neutral-700">
                <HighlightedText text={exp.summary} useUnderline={true} />
              </p>
            )}

            <ul className={'mt-2 ml-3 flex flex-col gap-4'}>
              {exp.historyList.map((history, index) => (
                <li key={index} className={'grid gap-1'}>
                  <div className={'flex items-center gap-2 text-base'}>
                    <p className={'font-bold text-neutral-800 dark:text-neutral-200'}>
                      {history.department}
                    </p>
                    <span className="text-neutral-500 dark:text-neutral-400">/</span>
                    <p className="text-neutral-700 dark:text-neutral-300">{history.role}</p>
                  </div>
                  <p className={'text-sm text-neutral-500 dark:text-neutral-400'}>
                    {formatDate(history.period[0])} ~{' '}
                    {history.period[1] && formatDate(history.period[1])}
                  </p>
                  <div className={'pl-4'}>
                    <ul className={'flex list-outside list-disc flex-col gap-1 pl-5'}>
                      {history.workingList.map((work, i) => (
                        <li key={i}>{work}</li>
                      ))}
                      {history.skillNameList && history.skillNameList.length > 0 && (
                        <li className={'space-y-1'}>
                          <p>기술 키워드</p>
                          <div className={'flex flex-wrap gap-1'}>
                            {history.skillNameList.map((skillName) => {
                              const skill = SKILLS.find((s) => s.name === skillName)
                              if (!skill) return null
                              return (
                                <SkillBadge
                                  key={`${history.department}_${skillName}`}
                                  skillName={skillName}
                                  category={skill.type}
                                />
                              )
                            })}
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default Experience
