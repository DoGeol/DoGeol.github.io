import { z } from 'zod'

import { resumeDraftSchema, type ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

const resumeDraftEnvelopeSchema = z
  .object({
    schemaVersion: z.literal(1),
    savedAt: z.iso.datetime(),
    draft: resumeDraftSchema,
  })
  .strict()

export const RESUME_DRAFT_STORAGE_KEY = 'resume-editor:draft:v1'

export type ResumeDraftReadResult =
  | { status: 'empty' }
  | { status: 'restored'; draft: ResumeDraft; savedAt: string }
  | { status: 'discarded' }

export const readResumeDraft = (storage: Storage): ResumeDraftReadResult => {
  const raw = storage.getItem(RESUME_DRAFT_STORAGE_KEY)
  if (raw === null) return { status: 'empty' }

  try {
    const parsed = resumeDraftEnvelopeSchema.safeParse(JSON.parse(raw))
    if (parsed.success) {
      return {
        status: 'restored',
        draft: structuredClone(parsed.data.draft),
        savedAt: parsed.data.savedAt,
      }
    }
  } catch {
    // 아래에서 손상된 현재-tab 초안을 제거한다.
  }

  storage.removeItem(RESUME_DRAFT_STORAGE_KEY)
  return { status: 'discarded' }
}

export const writeResumeDraft = (storage: Storage, draft: unknown, now = new Date()) => {
  const envelope = {
    schemaVersion: 1 as const,
    savedAt: now.toISOString(),
    draft: resumeDraftSchema.parse(draft),
  }
  storage.setItem(RESUME_DRAFT_STORAGE_KEY, JSON.stringify(envelope))
  return envelope.savedAt
}

export const clearResumeDraft = (storage: Storage) => storage.removeItem(RESUME_DRAFT_STORAGE_KEY)
