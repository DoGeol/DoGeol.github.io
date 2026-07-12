import type { HTMLAttributes, ReactElement } from 'react'

export const resumeRegionTypes = [
  'section',
  'contact',
  'experience',
  'history',
  'project',
  'project-work',
  'education',
  'activity',
  'license',
  'text',
  'skill-reference',
] as const

export type ResumeRegionType = (typeof resumeRegionTypes)[number]

export interface ResumeRegion {
  id: string
  type: ResumeRegionType
  label: string
  children: ReactElement<HTMLAttributes<HTMLElement>>
}

export type ResumeRegionRenderer = (region: ResumeRegion) => ReactElement

export const plainResumeRegionRenderer: ResumeRegionRenderer = ({ children }) => children
