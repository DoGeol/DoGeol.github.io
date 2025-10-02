import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import education from '@/app/(pages)/resume/_infos/education'

const Education = () => {
  return (
    <>
      {education.isShow && education.educationList.length > 0 && (
        <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start gap-4')}>
          <SectionTitle>Education</SectionTitle>
          <div className={'h-full w-full space-y-4 break-keep'}>
            {education.educationList.map((education) => (
              <div key={education.title}>
                <p className={'text-xl font-bold'}>{education.title}</p>
                <p className={'text-sm text-neutral-500 dark:text-neutral-400'}>
                  {education.period[0]} ~ {education.period[1] ?? ''}
                </p>
                <p>{education.summary}</p>
              </div>
            ))}
          </div>
        </article>
      )}
    </>
  )
}

export default Education
