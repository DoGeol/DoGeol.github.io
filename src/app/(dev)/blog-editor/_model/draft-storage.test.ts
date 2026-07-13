import { beforeEach, describe, expect, it } from 'vitest'

import type { BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

import {
  BLOG_DRAFT_STORAGE_KEY,
  clearBlogDrafts,
  readBlogDrafts,
  writeBlogDrafts,
} from './draft-storage'

const draft = (): BlogPostDraft => ({
  schemaVersion: 1,
  id: '018f6f4d-9751-7df0-a5fb-8f13f57a2401',
  title: '',
  slug: '',
  summary: '',
  status: 'draft',
  publishedAt: null,
  updatedAt: '2026-07-13',
  tags: [],
  coverImage: null,
  blocks: [{ id: 'paragraph', type: 'paragraph', props: {}, content: [], children: [] }],
})

beforeEach(() => sessionStorage.clear())

describe('blog draft storage', () => {
  it('작성 중 빈 metadata도 글 ID별로 저장하고 복원한다', () => {
    writeBlogDrafts(sessionStorage, { [draft().id]: draft() }, '2026-07-13T10:00:00.000Z')

    expect(readBlogDrafts(sessionStorage)).toEqual({
      status: 'restored',
      drafts: { [draft().id]: draft() },
      savedAt: '2026-07-13T10:00:00.000Z',
    })
  })

  it('version이 다르거나 손상된 envelope은 삭제한다', () => {
    sessionStorage.setItem(BLOG_DRAFT_STORAGE_KEY, JSON.stringify({ schemaVersion: 2 }))

    expect(readBlogDrafts(sessionStorage).status).toBe('discarded')
    expect(sessionStorage.getItem(BLOG_DRAFT_STORAGE_KEY)).toBeNull()
  })

  it('초안을 명시적으로 초기화한다', () => {
    writeBlogDrafts(sessionStorage, { [draft().id]: draft() }, '2026-07-13T10:00:00.000Z')
    clearBlogDrafts(sessionStorage)
    expect(readBlogDrafts(sessionStorage).status).toBe('empty')
  })
})
