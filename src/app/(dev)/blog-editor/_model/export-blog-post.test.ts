import { describe, expect, it } from 'vitest'

import type { BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

import { serializeBlogPostForExport } from './export-blog-post'

const validDraft = (): BlogPostDraft => ({
  schemaVersion: 1,
  id: '018f6f4d-9751-7df0-a5fb-8f13f57a2501',
  title: '테스트 글',
  slug: 'test-post',
  summary: '테스트 글의 요약입니다.',
  status: 'published',
  publishedAt: '2026-07-13',
  updatedAt: '2026-07-13',
  tags: ['Test'],
  coverImage: null,
  blocks: [
    {
      id: 'paragraph',
      type: 'paragraph',
      props: {},
      content: [{ type: 'text', text: '본문', styles: {} }],
      children: [],
    },
  ],
})

describe('serializeBlogPostForExport', () => {
  it('strict validation을 통과한 현재 글을 안정된 JSON으로 만든다', () => {
    const result = serializeBlogPostForExport(validDraft())

    expect(result).toEqual({
      success: true,
      filename: 'test-post.json',
      json: `${JSON.stringify(validDraft(), null, 2)}\n`,
    })
  })

  it('공개된 canonical 글의 slug 변경을 거부한다', () => {
    const result = serializeBlogPostForExport({ ...validDraft(), slug: 'changed' }, 'test-post')

    expect(result.success).toBe(false)
  })
})
