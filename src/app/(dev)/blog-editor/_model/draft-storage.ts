import { z } from 'zod'

import { blogPostDraftSchema, type BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

export const BLOG_DRAFT_STORAGE_KEY = 'blog-editor:drafts:v1'

const envelopeSchema = z.object({
  schemaVersion: z.literal(1),
  savedAt: z.iso.datetime(),
  drafts: z.record(z.string(), blogPostDraftSchema),
})

export type BlogDraftStorageState =
  | { status: 'empty'; drafts: Record<string, BlogPostDraft>; savedAt: null }
  | { status: 'discarded'; drafts: Record<string, BlogPostDraft>; savedAt: null }
  | { status: 'restored'; drafts: Record<string, BlogPostDraft>; savedAt: string }

export const parseBlogDrafts = (raw: string | null): BlogDraftStorageState => {
  if (raw === null) return { status: 'empty', drafts: {}, savedAt: null }
  try {
    const result = envelopeSchema.safeParse(JSON.parse(raw))
    if (!result.success) throw new Error('invalid draft')
    return { status: 'restored', drafts: result.data.drafts, savedAt: result.data.savedAt }
  } catch {
    return { status: 'discarded', drafts: {}, savedAt: null }
  }
}

export const readBlogDrafts = (storage: Storage): BlogDraftStorageState => {
  const result = parseBlogDrafts(storage.getItem(BLOG_DRAFT_STORAGE_KEY))
  if (result.status === 'discarded') storage.removeItem(BLOG_DRAFT_STORAGE_KEY)
  return result
}

export const writeBlogDrafts = (
  storage: Storage,
  drafts: Record<string, BlogPostDraft>,
  savedAt = new Date().toISOString(),
) => {
  const envelope = envelopeSchema.parse({ schemaVersion: 1, savedAt, drafts })
  storage.setItem(BLOG_DRAFT_STORAGE_KEY, JSON.stringify(envelope))
}

export const clearBlogDrafts = (storage: Storage) => storage.removeItem(BLOG_DRAFT_STORAGE_KEY)
