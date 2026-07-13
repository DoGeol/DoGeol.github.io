import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

import type { BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

import { BlogPostMetadataEditor } from './blog-post-metadata-editor'

afterEach(cleanup)

const draft = (): BlogPostDraft => ({
  schemaVersion: 1,
  id: '018f6f4d-9751-7df0-a5fb-8f13f57a2801',
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

function Harness({
  initial = draft(),
  canonicalSlug,
}: {
  initial?: BlogPostDraft
  canonicalSlug?: string
}) {
  const [value, setValue] = useState(initial)
  return <BlogPostMetadataEditor draft={value} canonicalSlug={canonicalSlug} onChange={setValue} />
}

describe('BlogPostMetadataEditor', () => {
  it('제목에서 slug를 제안하고 수동 수정 이후에는 덮어쓰지 않는다', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByLabelText('제목'), '첫 제목')
    expect(screen.getByLabelText('slug')).toHaveValue('첫-제목')
    await user.clear(screen.getByLabelText('slug'))
    await user.type(screen.getByLabelText('slug'), 'custom-slug')
    await user.type(screen.getByLabelText('제목'), ' 변경')

    expect(screen.getByLabelText('slug')).toHaveValue('custom-slug')
  })

  it('canonical 공개 글의 slug를 잠근다', () => {
    render(
      <Harness
        initial={{
          ...draft(),
          title: '글',
          slug: 'published',
          status: 'published',
          publishedAt: '2026-07-13',
        }}
        canonicalSlug="published"
      />,
    )

    expect(screen.getByLabelText('slug')).toBeDisabled()
  })
})
