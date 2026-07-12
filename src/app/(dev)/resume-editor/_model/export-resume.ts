import { z } from 'zod'

import { resumeSchema, type ResumeData } from '@/app/(pages)/resume/_model/resume-schema'

export type ResumeExportResult =
  { success: true; data: ResumeData; json: string } | { success: false; issues: z.ZodIssue[] }

export const serializeResumeForExport = (input: unknown): ResumeExportResult => {
  const parsed = resumeSchema.safeParse(input)
  return parsed.success
    ? {
        success: true,
        data: parsed.data,
        json: `${JSON.stringify(parsed.data, null, 2)}\n`,
      }
    : { success: false, issues: parsed.error.issues }
}

export const downloadResumeJson = (json: string, ownerDocument: Document) => {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json;charset=utf-8' }))
  const anchor = ownerDocument.createElement('a')

  try {
    anchor.href = url
    anchor.download = 'resume.json'
    anchor.hidden = true
    ownerDocument.body.append(anchor)
    anchor.click()
  } finally {
    anchor.remove()
    URL.revokeObjectURL(url)
  }
}
