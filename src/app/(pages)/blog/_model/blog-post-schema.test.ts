import { describe, expect, it } from 'vitest'

import { blogPostSchema, type BlogPostInput } from './blog-post-schema'

const validPost = (): BlogPostInput => ({
  schemaVersion: 1,
  id: '018f6f4d-9751-7df0-a5fb-8f13f57a2001',
  title: 'React Server Components를 이해하는 방법',
  slug: 'react-server-components',
  summary: '서버 컴포넌트의 경계와 데이터 흐름을 정리합니다.',
  status: 'published',
  publishedAt: '2026-07-13',
  updatedAt: '2026-07-13',
  tags: ['React', 'Next.js'],
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
})

describe('blogPostSchema', () => {
  it('공개 글의 표준 metadata와 BlockNote JSON을 허용한다', () => {
    expect(blogPostSchema.parse(validPost()).slug).toBe('react-server-components')
  })

  it('공개 글에 발행일이 없으면 거부한다', () => {
    const result = blogPostSchema.safeParse({ ...validPost(), publishedAt: null })

    expect(result.success).toBe(false)
  })

  it('허용하지 않은 BlockNote block을 거부한다', () => {
    const result = blogPostSchema.safeParse({
      ...validPost(),
      blocks: [
        {
          id: '018f6f4d-9751-7df0-a5fb-8f13f57a2002',
          type: 'video',
          props: {},
          content: [],
          children: [],
        },
      ],
    })

    expect(result.success).toBe(false)
  })

  it('public provider의 이미지가 /blog/ 밖을 가리키면 거부한다', () => {
    const result = blogPostSchema.safeParse({
      ...validPost(),
      coverImage: {
        source: { provider: 'public', path: '/profile/pdg.png' },
        alt: '대표 이미지',
        caption: null,
      },
    })

    expect(result.success).toBe(false)
  })
})
