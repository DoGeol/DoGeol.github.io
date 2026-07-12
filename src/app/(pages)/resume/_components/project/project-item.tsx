import { Fragment } from 'react'

import type { ProjectsSection } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'

type ProjectItemData = ProjectsSection['data']['items'][number]

interface Props {
  project: ProjectItemData
  renderRegion: ResumeRegionRenderer
}

const formatMonth = (month: string) => month.replace('-', '.')

const ProjectItem = ({ project, renderRegion }: Props) =>
  renderRegion({
    id: project.id,
    type: 'project',
    label: project.title,
    children: (
      <li className="border-b border-neutral-300 py-8 last:border-b-0 dark:border-neutral-700">
        <div className="flex flex-col items-start justify-start">
          <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-50">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <p>
              {formatMonth(project.startMonth)} ~{' '}
              {project.endMonth ? formatMonth(project.endMonth) : ''}
            </p>
            {project.companyName && <span>/</span>}
            {project.companyName && <p className="capitalize">{project.companyName}</p>}
          </div>
        </div>
        <p className="mt-2 text-lg text-neutral-500 italic dark:text-neutral-400">
          {project.summary}
        </p>
        <ul className="mt-6 ml-4 list-disc">
          {project.works.map((work) => (
            <Fragment key={work.id}>
              {renderRegion({
                id: work.id,
                type: 'project-work',
                label: work.title,
                children: (
                  <li className="mt-4">
                    <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-50">
                      {work.title}
                    </h4>
                    <ul className="mt-2 ml-4 list-decimal">
                      {work.details.map((detail) => (
                        <Fragment key={detail.id}>
                          {renderRegion({
                            id: detail.id,
                            type: 'text',
                            label: '프로젝트 상세',
                            children: <li className="mt-1.5 text-base">{detail.text}</li>,
                          })}
                        </Fragment>
                      ))}
                    </ul>
                  </li>
                ),
              })}
            </Fragment>
          ))}
        </ul>
      </li>
    ),
  })

export default ProjectItem
