import { describe, expect, it } from 'vitest'

import { createBlogPostDraft } from './create-blog-post'

describe('createBlogPostDraft', () => {
  it('편집 가능한 빈 metadata와 paragraph를 가진 초안을 만든다', () => {
    const result = createBlogPostDraft({
      date: '2026-07-13',
      postId: '018f6f4d-9751-7df0-a5fb-8f13f57a2601',
      blockId: '018f6f4d-9751-7df0-a5fb-8f13f57a2602',
    })

    expect(result).toMatchObject({
      title: '',
      slug: '',
      summary: '',
      status: 'draft',
      publishedAt: null,
      updatedAt: '2026-07-13',
    })
    expect(result.blocks[0]?.type).toBe('paragraph')
  })
})
