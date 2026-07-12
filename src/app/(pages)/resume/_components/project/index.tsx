import { Fragment } from 'react'

import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import type { ProjectsSection } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import { cn } from '@/shared/lib/tailwindcss'

import ProjectItem from '@/app/(pages)/resume/_components/project/project-item'

interface Props {
  section: ProjectsSection
  renderRegion: ResumeRegionRenderer
}

const Project = ({ section, renderRegion }: Props) => {
  if (!section.visible || section.data.items.length === 0) return null

  return renderRegion({
    id: section.id,
    type: 'section',
    label: '프로젝트',
    children: (
      <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start')}>
        <SectionTitle>Projects</SectionTitle>
        <ul className="flex w-full flex-col">
          {section.data.items.map((project) => (
            <Fragment key={project.id}>
              <ProjectItem project={project} renderRegion={renderRegion} />
            </Fragment>
          ))}
        </ul>
      </article>
    ),
  })
}

export default Project
