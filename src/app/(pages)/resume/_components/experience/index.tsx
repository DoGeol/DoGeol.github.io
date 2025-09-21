import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import experience from '@/app/(pages)/resume/_infos/experience'

const Experience = () => {
  return (
    <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start gap-4')}>
      <div className={'flex items-end justify-start gap-2'}>
        <h2 className={'text-primary-600 text-3xl font-medium'}>Experience</h2>
        {experience.isUsedTotalPeriod && <p className={'text-sm text-neutral-400'}>총 2년 2개월</p>}
      </div>
      <ul>
        {experience.experienceList.map((exp) => (
          <li key={exp.companyName}>{exp.companyName}</li>
        ))}
      </ul>
    </article>
  )
}

export default Experience
