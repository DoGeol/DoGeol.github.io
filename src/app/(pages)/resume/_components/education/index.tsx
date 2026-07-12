import { Fragment } from 'react'

import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import type { EducationSection } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import { cn } from '@/shared/lib/tailwindcss'

interface Props {
  section: EducationSection
  renderRegion: ResumeRegionRenderer
}

const formatMonth = (month: string) => month.replace('-', '.')

const Education = ({ section, renderRegion }: Props) => {
  if (!section.visible || section.data.items.length === 0) return null

  return renderRegion({
    id: section.id,
    type: 'section',
    label: '학력',
    children: (
      <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start gap-4')}>
        <SectionTitle>Education</SectionTitle>
        <div className="h-full w-full space-y-4 break-keep">
          {section.data.items.map((education) => (
            <Fragment key={education.id}>
              {renderRegion({
                id: education.id,
                type: 'education',
                label: education.school,
                children: (
                  <div>
                    <p className="text-xl font-bold">{education.school}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                      {formatMonth(education.startMonth)} ~{' '}
                      {education.endMonth ? formatMonth(education.endMonth) : ''}
                      {education.graduated && (
                        <>
                          <span>/</span>
                          <p className="capitalize">졸업</p>
                        </>
                      )}
                      <span>/</span>
                      <p className="capitalize">{education.major}</p>
                    </div>
                    <p className="mt-2">{education.summary}</p>
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

export default Education
