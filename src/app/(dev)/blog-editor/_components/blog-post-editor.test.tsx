import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'
import type { AssetProvider } from '../_model/asset-provider'

vi.mock('./dynamic-block-note-surface', () => ({
  DynamicBlockNoteSurface: ({ editable }: { editable: boolean }) => (
    <div data-testid={editable ? 'body-editor' : 'body-preview'} />
  ),
}))

import { BlogPostEditor } from './blog-post-editor'

afterEach(cleanup)

const draft: BlogPostDraft = {
  schemaVersion: 1,
  id: '018f6f4d-9751-7df0-a5fb-8f13f57a2901',
  title: '편집할 글',
  slug: 'editable-post',
  summary: '편집할 글의 요약입니다.',
  status: 'draft',
  publishedAt: null,
  updatedAt: '2026-07-13',
  tags: ['React'],
  coverImage: null,
  blocks: [{ id: 'paragraph', type: 'paragraph', props: {}, content: [], children: [] }],
}

describe('BlogPostEditor', () => {
  it('편집과 프리뷰 surface를 렌더링하고 모바일 tab을 전환한다', async () => {
    const user = userEvent.setup()
    render(<BlogPostEditor initialDraft={draft} />)

    expect(screen.getByTestId('body-editor')).toBeVisible()
    expect(screen.getByTestId('body-preview')).toBeVisible()
    const previewTab = screen.getByRole('tab', { name: '프리뷰' })
    await user.click(previewTab)
    expect(previewTab).toHaveAttribute('aria-selected', 'true')

    const editTab = screen.getByRole('tab', { name: '편집' })
    editTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(previewTab).toHaveFocus()
    expect(previewTab).toHaveAttribute('aria-selected', 'true')
  })

  it('asset 검증이 실패하면 JSON 내보내기를 차단한다', async () => {
    const user = userEvent.setup()
    const assetProvider: AssetProvider = {
      id: 'public',
      resolvePreviewUrl: ({ path }) => path,
      validate: async () => ({ valid: false, message: 'asset 없음' }),
    }
    render(
      <BlogPostEditor
        initialDraft={{
          ...draft,
          coverImage: {
            source: { provider: 'public', path: '/blog/missing.webp' },
            alt: '대표 이미지',
            caption: null,
          },
        }}
        assetProvider={assetProvider}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'JSON 내보내기' }))
    expect(await screen.findByText('/blog/missing.webp: asset 없음')).toBeVisible()
  })
})
