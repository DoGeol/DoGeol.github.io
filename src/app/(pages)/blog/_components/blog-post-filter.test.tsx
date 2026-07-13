import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import type { BlogPostSummary } from '../_model/blog-post-schema'
import { BlogPostFilter } from './blog-post-filter'

afterEach(cleanup)

const summaries: BlogPostSummary[] = [
  {
    schemaVersion: 1,
    id: '018f6f4d-9751-7df0-a5fb-8f13f57a2201',
    title: 'React 글',
    slug: 'react',
    summary: '서버 컴포넌트 설명',
    status: 'published',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-13',
    tags: ['React'],
    coverImage: null,
  },
  {
    schemaVersion: 1,
    id: '018f6f4d-9751-7df0-a5fb-8f13f57a2202',
    title: 'TypeScript 글',
    slug: 'typescript',
    summary: '타입 설계 설명',
    status: 'published',
    publishedAt: '2026-07-12',
    updatedAt: '2026-07-12',
    tags: ['TypeScript'],
    coverImage: null,
  },
]

describe('BlogPostFilter', () => {
  it('제목·요약·태그로 검색한다', async () => {
    const user = userEvent.setup()
    render(<BlogPostFilter posts={summaries} />)

    await user.type(screen.getByRole('searchbox'), '서버 컴포넌트')

    expect(screen.getByRole('link', { name: /React 글/ })).toBeVisible()
    expect(screen.queryByRole('link', { name: /TypeScript 글/ })).not.toBeInTheDocument()
  })

  it('태그 버튼으로 글을 필터링하고 결과가 없으면 안내한다', async () => {
    const user = userEvent.setup()
    render(<BlogPostFilter posts={summaries} />)

    await user.click(screen.getByRole('button', { name: 'React' }))
    await user.type(screen.getByRole('searchbox'), '없는 글')

    expect(screen.getByText('조건에 맞는 글이 없습니다.')).toBeVisible()
  })
})
