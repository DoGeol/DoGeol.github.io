import type { ResumeSectionType } from '@/app/(pages)/resume/_model/resume-schema'

const sectionLabels: Record<ResumeSectionType, string> = {
  information: '기본 정보',
  introduce: '소개',
  experience: '경력',
  projects: '프로젝트',
  education: '학력',
  activity: '활동',
  licenses: '자격증',
}

export const getResumeSectionLabel = (type: ResumeSectionType) => sectionLabels[type]
