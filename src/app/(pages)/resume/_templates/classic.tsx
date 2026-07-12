import { Fragment, type ReactElement } from 'react'

import Activity from '@/app/(pages)/resume/_components/activity'
import Education from '@/app/(pages)/resume/_components/education'
import Experience from '@/app/(pages)/resume/_components/experience'
import Information from '@/app/(pages)/resume/_components/infomation'
import Introduce from '@/app/(pages)/resume/_components/introduce'
import License from '@/app/(pages)/resume/_components/license'
import Project from '@/app/(pages)/resume/_components/project'
import type { ResumeData, ResumeSection } from '@/app/(pages)/resume/_model/resume-schema'
import {
  plainResumeRegionRenderer,
  type ResumeRegionRenderer,
} from '@/app/(pages)/resume/_model/resume-region'

export interface ResumeTemplateProps {
  resume: ResumeData
  renderRegion?: ResumeRegionRenderer
}

const assertNever = (value: never): never => {
  throw new Error(`지원하지 않는 이력서 section: ${JSON.stringify(value)}`)
}

const renderClassicSection = (
  section: ResumeSection,
  resume: ResumeData,
  renderRegion: ResumeRegionRenderer,
): ReactElement | null => {
  if (!section.visible) return null

  switch (section.type) {
    case 'information':
      return <Information section={section} assets={resume.assets} renderRegion={renderRegion} />
    case 'introduce':
      return <Introduce section={section} renderRegion={renderRegion} />
    case 'experience':
      return (
        <Experience
          section={section}
          skillCatalog={resume.skillCatalog}
          renderRegion={renderRegion}
        />
      )
    case 'projects':
      return <Project section={section} renderRegion={renderRegion} />
    case 'education':
      return <Education section={section} renderRegion={renderRegion} />
    case 'activity':
      return <Activity section={section} renderRegion={renderRegion} />
    case 'licenses':
      return <License section={section} renderRegion={renderRegion} />
    default:
      return assertNever(section)
  }
}

export const ClassicResume = ({
  resume,
  renderRegion = plainResumeRegionRenderer,
}: ResumeTemplateProps) => (
  <section className="mx-auto flex max-w-6xl min-w-xs flex-col space-y-6 py-8">
    {resume.sections.map((section) => (
      <Fragment key={section.id}>{renderClassicSection(section, resume, renderRegion)}</Fragment>
    ))}
  </section>
)
