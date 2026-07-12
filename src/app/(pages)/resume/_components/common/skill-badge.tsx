import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import type { SkillCategory } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'

interface Props {
  skillName: string
  category: SkillCategory
  regionId: string
  renderRegion: ResumeRegionRenderer
  className?: string
}

const getSkillColorClasses = (category: SkillCategory) => {
  switch (category) {
    case 'frontend':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300'
    case 'app':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'backend':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'devops':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'analysis':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'collaboration':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'etc':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const SkillBadge = ({ skillName, category, regionId, renderRegion, className }: Props) =>
  renderRegion({
    id: regionId,
    type: 'skill-reference',
    label: skillName,
    children: (
      <span
        className={cn(
          'inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium capitalize',
          getSkillColorClasses(category),
          className,
        )}
      >
        {skillName}
      </span>
    ),
  })

export default SkillBadge
