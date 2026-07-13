import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { BlogBlockContent } from '../_components/blog-block-content'
import type { BlogBlock } from './blog-post-schema'

describe('BlogBlockContent', () => {
  it('BlockNote JSON을 정적 React HTML로 만들고 heading anchor를 추가한다', async () => {
    const blocks: BlogBlock[] = [
      {
        id: 'heading-a',
        type: 'heading',
        props: { level: 2 },
        content: [{ type: 'text', text: '정적 렌더링', styles: {} }],
        children: [],
      },
      {
        id: 'paragraph-a',
        type: 'paragraph',
        props: {},
        content: [{ type: 'text', text: '공개 페이지 본문', styles: { bold: true } }],
        children: [],
      },
    ]

    const html = renderToStaticMarkup(await BlogBlockContent({ blocks }))

    expect(html).toContain('id="heading-heading-a"')
    expect(html).toContain('<h2')
    expect(html).toContain('공개 페이지 본문')
    expect(html).not.toContain('contenteditable="true"')
  })

  it('연속된 list item을 하나의 의미 있는 목록으로 묶는다', async () => {
    const blocks: BlogBlock[] = ['첫 항목', '둘째 항목'].map((text, index) => ({
      id: `item-${index}`,
      type: 'bulletListItem',
      props: {},
      content: [{ type: 'text', text, styles: {} }],
      children: [],
    }))

    const html = renderToStaticMarkup(await BlogBlockContent({ blocks }))

    expect(html).toContain('<ul><li><span>첫 항목</span></li><li><span>둘째 항목</span></li></ul>')
  })

  it('중첩 list children도 정적 markup으로 완전히 해석한다', async () => {
    const blocks: BlogBlock[] = [
      {
        id: 'parent',
        type: 'bulletListItem',
        props: {},
        content: [{ type: 'text', text: '부모', styles: {} }],
        children: [
          {
            id: 'child',
            type: 'bulletListItem',
            props: {},
            content: [{ type: 'text', text: '자식', styles: {} }],
            children: [],
          },
        ],
      },
    ]

    const html = renderToStaticMarkup(await BlogBlockContent({ blocks }))

    expect(html).toContain('<ul><li><span>부모</span><ul><li><span>자식</span></li></ul></li></ul>')
  })
})
