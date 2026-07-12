import rawResume from '@/app/(pages)/resume/_data/resume.json'

import { resumeSchema, type ResumeData } from './resume-schema'

export const canonicalResumeData: ResumeData = resumeSchema.parse(rawResume)

export const getCanonicalResumeData = (): ResumeData => structuredClone(canonicalResumeData)
