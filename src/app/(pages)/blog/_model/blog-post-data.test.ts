import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { loadBlogPosts } from './blog-post-data'

const roots: string[] = []

const createRoot = async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'blog-posts-'))
  roots.push(root)
  const postsDirectory = path.join(root, 'posts')
  const publicDirectory = path.join(root, 'public')
  await mkdir(postsDirectory)
  await mkdir(path.join(publicDirectory, 'blog'), { recursive: true })
  return { postsDirectory, publicDirectory }
}

const post = (overrides: Record<string, unknown> = {}) => ({
  schemaVersion: 1,
  id: '018f6f4d-9751-7df0-a5fb-8f13f57a2001',
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
      id: '018f6f4d-9751-7df0-a5fb-8f13f57a2002',
      type: 'paragraph',
      props: {},
      content: [{ type: 'text', text: '본문', styles: {} }],
      children: [],
    },
  ],
  ...overrides,
})

afterEach(async () => {
  const { rm } = await import('node:fs/promises')
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})

describe('loadBlogPosts', () => {
  it('JSON 글을 읽어 공개 글과 초안을 분리한다', async () => {
    const root = await createRoot()
    await writeFile(path.join(root.postsDirectory, 'test-post.json'), JSON.stringify(post()))
    await writeFile(
      path.join(root.postsDirectory, 'draft.json'),
      JSON.stringify(
        post({
          id: '018f6f4d-9751-7df0-a5fb-8f13f57a2010',
          slug: 'draft',
          status: 'draft',
          publishedAt: null,
        }),
      ),
    )

    const result = await loadBlogPosts(root)

    expect(result.all).toHaveLength(2)
    expect(result.published.map(({ slug }) => slug)).toEqual(['test-post'])
  })

  it('slug가 중복되면 두 파일 이름을 포함해 실패한다', async () => {
    const root = await createRoot()
    await writeFile(path.join(root.postsDirectory, 'first.json'), JSON.stringify(post()))
    await writeFile(
      path.join(root.postsDirectory, 'second.json'),
      JSON.stringify(post({ id: '018f6f4d-9751-7df0-a5fb-8f13f57a2020' })),
    )

    await expect(loadBlogPosts(root)).rejects.toThrow(
      /first\.json.*second\.json|second\.json.*first\.json/,
    )
  })

  it('대표 이미지가 public에 없으면 파일과 asset 경로를 포함해 실패한다', async () => {
    const root = await createRoot()
    await writeFile(
      path.join(root.postsDirectory, 'test-post.json'),
      JSON.stringify(
        post({
          coverImage: {
            source: { provider: 'public', path: '/blog/missing.webp' },
            alt: '대표 이미지',
            caption: null,
          },
        }),
      ),
    )

    await expect(loadBlogPosts(root)).rejects.toThrow(/test-post\.json.*\/blog\/missing\.webp/)
  })
})
