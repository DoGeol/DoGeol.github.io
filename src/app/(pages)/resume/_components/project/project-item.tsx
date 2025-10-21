import React from 'react'
import { IProject } from './types'

type Props = {
  project: IProject['projectList'][0]
}

const ProjectItem = ({ project }: Props) => {
  return (
    <li className={'border-b border-neutral-300 py-8 last:border-b-0 dark:border-neutral-700'}>
      <div className={'flex flex-col items-start justify-start'}>
        <h3 className={'text-2xl font-bold text-neutral-800 dark:text-neutral-50'}>
          {project.title}
        </h3>
        <div className={'flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400'}>
          {project.period.length > 0 && (
            <p>
              {project.period[0]} ~ {project.period[1] ?? ''}
            </p>
          )}
          {project.period.length > 0 && project.companyName && <span>/</span>}
          {project.companyName && <p className={'capitalize'}>{project.companyName}</p>}
        </div>
      </div>
      <p className={'mt-2 text-lg text-neutral-500 italic dark:text-neutral-400'}>
        {project.summary}
      </p>
      <ul className={'mt-6 ml-4 list-disc'}>
        {project.works.map((work, wIdx) => (
          <li key={`${work}_${wIdx}`} className={'mt-4'}>
            <h4 className={'text-lg font-semibold text-neutral-800 dark:text-neutral-50'}>
              {work.text}
            </h4>
            <ul className={'mt-2 ml-4 list-decimal'}>
              {work.details.map((detail, dIdx) => (
                <li key={`${detail}_${dIdx}`} className={'mt-1.5 text-base font-light'}>
                  {detail}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </li>
  )
}

export default ProjectItem
