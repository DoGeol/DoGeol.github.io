import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { BlogPost } from '@/app/(pages)/blog/_model/blog-post-schema'

import { BlogPostEditorRoute } from './blog-post-editor-route'

vi.mock('./blog-post-editor', () => ({
  BlogPostEditor: ({ initialDraft }: { initialDraft: BlogPost }) => <div>{initialDraft.title}</div>,
}))

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})

const post: BlogPost = {
  schemaVersion: 1,
  id: '018f6f4d-9751-7df0-a5fb-8f13f57a2701',
  title: '선택한 기준 글',
  slug: 'canonical-post',
  summary: '기준 글의 요약입니다.',
  status: 'published',
  publishedAt: '2026-07-13',
  updatedAt: '2026-07-13',
  tags: ['React'],
  coverImage: null,
  blocks: [{ id: 'paragraph', type: 'paragraph', props: {}, content: [], children: [] }],
}

describe('BlogPostEditorRoute', () => {
  it('query의 postId로 canonical 글을 선택한다', async () => {
    window.history.replaceState({}, '', `/blog-editor/edit?postId=${post.id}`)

    render(<BlogPostEditorRoute canonicalPosts={[post]} today="2026-07-13" />)

    expect(await screen.findByText('선택한 기준 글')).toBeVisible()
  })

  it('알 수 없는 postId는 관리 화면 안내를 표시한다', async () => {
    window.history.replaceState({}, '', '/blog-editor/edit?postId=unknown')

    render(<BlogPostEditorRoute canonicalPosts={[post]} today="2026-07-13" />)

    expect(await screen.findByText('편집할 글을 찾을 수 없습니다.')).toBeVisible()
  })
})
