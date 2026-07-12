import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

export type SkillCategory = ResumeDraft['skillCatalog'][number]['category']

export const skillCategoryOptions: ReadonlyArray<{
  value: SkillCategory
  label: string
}> = [
  { value: 'frontend', label: '프론트엔드' },
  { value: 'app', label: '앱' },
  { value: 'backend', label: '백엔드' },
  { value: 'devops', label: 'DevOps' },
  { value: 'analysis', label: '분석' },
  { value: 'collaboration', label: '협업' },
  { value: 'etc', label: '기타' },
]
