import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import activity from '@/app/(pages)/resume/_infos/activity'

const Activity = () => {
  return (
    <>
      {activity.isShow && activity.activityList.length > 0 && (
        <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start gap-4')}>
          <SectionTitle>Activity</SectionTitle>
          <div className={'h-full w-full space-y-4 break-keep'}>
            {activity.activityList.map((activity) => (
              <div key={activity.title}>
                <p className={'text-xl font-bold'}>{activity.title}</p>
                <p className={'text-sm text-neutral-500 dark:text-neutral-400'}>
                  {activity.period[0]} ~ {activity.period[1] ?? ''}
                </p>
                <p>{activity.summary}</p>
              </div>
            ))}
          </div>
        </article>
      )}
    </>
  )
}

export default Activity
