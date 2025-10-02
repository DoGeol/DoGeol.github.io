import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import projects from '@/app/(pages)/resume/_infos/projects'
import project from '@/app/(pages)/resume/_infos/projects'
import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import ProjectItem from './project-item'

const Project = () => {
  return (
    <>
      {projects.isShow && project.projectList.length > 0 && (
        <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start')}>
          <SectionTitle>Projects</SectionTitle>
          <ul className={'flex w-full flex-col'}>
            {projects.projectList.map((project) => (
              <ProjectItem key={project.title} project={project} />
            ))}
          </ul>
        </article>
      )}
    </>
  )
}

export default Project
