import { describe, expect, it } from 'vitest'

import { createBlogRssXml } from './blog-feed'
import type { BlogPost } from './blog-post-schema'

const publishedPost: BlogPost = {
  schemaVersion: 1,
  id: '018f6f4d-9751-7df0-a5fb-8f13f57a2301',
  title: 'RSC & 정적 출력',
  slug: 'rsc-static',
  summary: '<정적> 페이지를 설명합니다.',
  status: 'published',
  publishedAt: '2026-07-13',
  updatedAt: '2026-07-13',
  tags: ['React'],
  coverImage: null,
  blocks: [{ id: 'p', type: 'paragraph', props: {}, content: [], children: [] }],
}

describe('createBlogRssXml', () => {
  it('공개 글 metadata를 escape한 RSS 2.0 XML로 만든다', () => {
    const xml = createBlogRssXml([publishedPost])

    expect(xml).toContain('<title>RSC &amp; 정적 출력</title>')
    expect(xml).toContain('&lt;정적&gt; 페이지를 설명합니다.')
    expect(xml).toContain('https://dogeol.github.io/blog/rsc-static')
    expect(xml).toContain('<category>React</category>')
  })
})
