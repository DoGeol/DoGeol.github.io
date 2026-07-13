import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import type { BlogPost } from '@/app/(pages)/blog/_model/blog-post-schema'

import { BlogEditorDashboard } from './blog-editor-dashboard'

afterEach(cleanup)

const post: BlogPost = {
  schemaVersion: 1,
  id: '018f6f4d-9751-7df0-a5fb-8f13f57a2701',
  title: '기준 글',
  slug: 'canonical-post',
  summary: '기준 글의 요약입니다.',
  status: 'published',
  publishedAt: '2026-07-13',
  updatedAt: '2026-07-13',
  tags: ['React'],
  coverImage: null,
  blocks: [{ id: 'paragraph', type: 'paragraph', props: {}, content: [], children: [] }],
}

describe('BlogEditorDashboard', () => {
  it('canonical 글과 새 글 action을 표시한다', () => {
    render(<BlogEditorDashboard canonicalPosts={[post]} />)

    expect(screen.getByRole('heading', { name: '블로그 글 관리' })).toBeVisible()
    expect(screen.getByRole('link', { name: '새 글 작성' })).toHaveAttribute(
      'href',
      '/blog-editor/edit?postId=new',
    )
    expect(screen.getByRole('link', { name: /기준 글/ })).toHaveAttribute(
      'href',
      `/blog-editor/edit?postId=${post.id}`,
    )
    expect(screen.getByText('published')).toBeVisible()
  })
})
