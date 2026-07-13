import { describe, expect, it, vi } from 'vitest'

import { LocalPublicAssetProvider } from './local-public-asset-provider'
import { collectBlogAssetSources, validateBlogAssets } from './asset-provider'
import type { BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

describe('LocalPublicAssetProvider', () => {
  it('/blog/ asset을 같은 URL로 해석하고 존재 여부를 검사한다', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    const provider = new LocalPublicAssetProvider(fetcher)
    const source = { provider: 'public' as const, path: '/blog/images/post.webp' }

    expect(provider.resolvePreviewUrl(source)).toBe('/blog/images/post.webp')
    await expect(provider.validate(source)).resolves.toEqual({ valid: true })
    expect(fetcher).toHaveBeenCalledWith('/blog/images/post.webp', { method: 'HEAD' })
  })

  it('/blog/ 밖의 경로와 404 응답을 거부한다', async () => {
    const provider = new LocalPublicAssetProvider(
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    )

    await expect(
      provider.validate({ provider: 'public', path: '/profile/pdg.png' }),
    ).resolves.toEqual({ valid: false, message: '/blog/ 아래 경로를 입력하세요.' })
    await expect(
      provider.validate({ provider: 'public', path: '/blog/missing.webp' }),
    ).resolves.toEqual({ valid: false, message: 'public asset을 찾을 수 없습니다.' })
  })

  it('대표 이미지와 중첩된 본문 이미지 경로를 수집한다', () => {
    const draft = {
      coverImage: {
        source: { provider: 'public', path: '/blog/cover.webp' },
        alt: 'cover',
        caption: null,
      },
      blocks: [
        {
          id: 'image',
          type: 'image',
          props: { url: '/blog/body.webp', name: 'body' },
          content: [],
          children: [],
        },
      ],
    } as unknown as BlogPostDraft

    expect(collectBlogAssetSources(draft)).toEqual([
      { provider: 'public', path: '/blog/cover.webp' },
      { provider: 'public', path: '/blog/body.webp' },
    ])
  })

  it('provider 검증 실패에 asset 경로를 연결한다', async () => {
    const draft = {
      coverImage: {
        source: { provider: 'public', path: '/blog/missing.webp' },
        alt: 'cover',
        caption: null,
      },
      blocks: [],
    } as unknown as BlogPostDraft
    const provider = new LocalPublicAssetProvider(
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    )

    await expect(validateBlogAssets(draft, provider)).resolves.toEqual([
      { path: '/blog/missing.webp', message: 'public asset을 찾을 수 없습니다.' },
    ])
  })
})
