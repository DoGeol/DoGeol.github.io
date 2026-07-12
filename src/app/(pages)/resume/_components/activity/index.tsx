import { Fragment } from 'react'

import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import type { ActivitySection } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import { cn } from '@/shared/lib/tailwindcss'

interface Props {
  section: ActivitySection
  renderRegion: ResumeRegionRenderer
}

const formatMonth = (month: string) => month.replace('-', '.')

const Activity = ({ section, renderRegion }: Props) => {
  if (!section.visible || section.data.items.length === 0) return null

  return renderRegion({
    id: section.id,
    type: 'section',
    label: '활동',
    children: (
      <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start gap-4')}>
        <SectionTitle>Activity</SectionTitle>
        <div className="h-full w-full space-y-4 break-keep">
          {section.data.items.map((activity) => (
            <Fragment key={activity.id}>
              {renderRegion({
                id: activity.id,
                type: 'activity',
                label: activity.title,
                children: (
                  <div>
                    <p className="text-xl font-bold">{activity.title}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatMonth(activity.startMonth)} ~{' '}
                      {activity.endMonth ? formatMonth(activity.endMonth) : ''}
                    </p>
                    {activity.summary && <p>{activity.summary}</p>}
                  </div>
                ),
              })}
            </Fragment>
          ))}
        </div>
      </article>
    ),
  })
}

export default Activity
