import { Fragment } from 'react'

import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import type { ExperienceSection, SkillDefinition } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import { cn } from '@/shared/lib/tailwindcss'

import ExperienceCompany from '@/app/(pages)/resume/_components/experience/experience-company'
import { calculateTotalExperience } from '@/app/(pages)/resume/_components/experience/utils'

interface Props {
  section: ExperienceSection
  skillCatalog: SkillDefinition[]
  renderRegion: ResumeRegionRenderer
}

const Experience = ({ section, skillCatalog, renderRegion }: Props) => {
  if (!section.visible) return null

  return renderRegion({
    id: section.id,
    type: 'section',
    label: '경력',
    children: (
      <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start')}>
        <div className="flex items-end justify-start gap-3">
          <SectionTitle>Experience</SectionTitle>
          {section.data.showTotalPeriod && (
            <p className="mb-1 text-sm text-neutral-500 dark:text-neutral-400">
              {calculateTotalExperience(section)}
            </p>
          )}
        </div>
        <ul className="flex w-full flex-col">
          {section.data.items.map((experience) => (
            <Fragment key={experience.id}>
              <ExperienceCompany
                experience={experience}
                skillCatalog={skillCatalog}
                renderRegion={renderRegion}
              />
            </Fragment>
          ))}
        </ul>
      </article>
    ),
  })
}

export default Experience
