import { createElement, type ComponentType } from 'react'

import type { ResumeTemplateId } from '@/app/(pages)/resume/_model/resume-schema'

import { ClassicResume, type ResumeTemplateProps } from '@/app/(pages)/resume/_templates/classic'

type ResumeTemplateComponent = ComponentType<ResumeTemplateProps>

const resumeTemplates: Record<
  ResumeTemplateId,
  { label: string; Component: ResumeTemplateComponent }
> = {
  classic: { label: '기본 이력서', Component: ClassicResume },
}

export const resumeTemplateOptions = Object.entries(resumeTemplates).map(([value, { label }]) => ({
  value: value as ResumeTemplateId,
  label,
}))

export const getResumeTemplate = (templateId: ResumeTemplateId) => {
  const registration = resumeTemplates[templateId]
  if (!registration) throw new Error(`지원하지 않는 이력서 template: ${templateId}`)
  return registration.Component
}

export const ResumeDocument = (props: ResumeTemplateProps) => {
  const Template = getResumeTemplate(props.resume.templateId)
  return createElement(Template, props)
}
