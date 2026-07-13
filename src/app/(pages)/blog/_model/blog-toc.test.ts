import { describe, expect, it } from 'vitest'

import { buildBlogToc, calculateReadingMinutes } from './blog-toc'
import type { BlogBlock } from './blog-post-schema'

const blocks: BlogBlock[] = [
  {
    id: 'heading-a',
    type: 'heading',
    props: { level: 2 },
    content: [{ type: 'text', text: '서버 컴포넌트란?', styles: {} }],
    children: [
      {
        id: 'heading-b',
        type: 'heading',
        props: { level: 3 },
        content: [{ type: 'text', text: '기존 방식과의 차이', styles: {} }],
        children: [],
      },
    ],
  },
  {
    id: 'body',
    type: 'paragraph',
    props: {},
    content: [{ type: 'text', text: '하나 둘 셋 넷 다섯', styles: {} }],
    children: [],
  },
]

describe('blog toc', () => {
  it('중첩된 H2~H4를 문서 순서와 안정적인 block id로 만든다', () => {
    expect(buildBlogToc(blocks)).toEqual([
      { id: 'heading-heading-a', level: 2, text: '서버 컴포넌트란?' },
      { id: 'heading-heading-b', level: 3, text: '기존 방식과의 차이' },
    ])
  })

  it('본문 단어 수를 기준으로 최소 1분의 읽기 시간을 계산한다', () => {
    expect(calculateReadingMinutes(blocks, 200)).toBe(1)
  })
})
