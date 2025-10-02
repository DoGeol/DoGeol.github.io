import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import experience from '@/app/(pages)/resume/_infos/experience'
import { calculateTotalExperience } from './utils'
import ExperienceCompany from './experience-company'
import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'

const Experience = () => {
  return (
    <>
      {experience.isShow && (
        <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start')}>
          <div className={'flex items-end justify-start gap-3'}>
            <SectionTitle>Experience</SectionTitle>
            {experience.isUsedTotalPeriod && (
              <p className={'mb-1 text-sm text-neutral-500 dark:text-neutral-400'}>
                {calculateTotalExperience(experience)}
              </p>
            )}
          </div>
          <ul className={'flex w-full flex-col'}>
            {experience.experienceList.map((exp) => (
              <ExperienceCompany key={exp.companyName} experience={exp} />
            ))}
          </ul>
        </article>
      )}
    </>
  )
}

export default Experience
