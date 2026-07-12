import { Fragment } from 'react'

import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import type { LicensesSection } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import { cn } from '@/shared/lib/tailwindcss'

interface Props {
  section: LicensesSection
  renderRegion: ResumeRegionRenderer
}

const License = ({ section, renderRegion }: Props) => {
  if (!section.visible || section.data.items.length === 0) return null

  return renderRegion({
    id: section.id,
    type: 'section',
    label: '자격증',
    children: (
      <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start gap-4')}>
        <SectionTitle>License & Certificate</SectionTitle>
        <div className="h-full w-full space-y-4 break-keep">
          {section.data.items.map((license) => (
            <Fragment key={license.id}>
              {renderRegion({
                id: license.id,
                type: 'license',
                label: license.title,
                children: (
                  <div>
                    <p className="text-xl font-bold">{license.title}</p>
                    <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <p>{license.acquiredAt.replaceAll('-', '.')}</p>
                      <span>/</span>
                      <p className="capitalize">{license.issuer}</p>
                    </div>
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

export default License
