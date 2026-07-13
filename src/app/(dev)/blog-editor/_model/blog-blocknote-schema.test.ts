import { describe, expect, it } from 'vitest'

import { blogBlockNoteSchema } from './blog-blocknote-schema'

describe('blogBlockNoteSchema', () => {
  it('기술 블로그 block만 허용한다', () => {
    expect(Object.keys(blogBlockNoteSchema.blockSchema).sort()).toEqual([
      'bulletListItem',
      'checkListItem',
      'codeBlock',
      'divider',
      'heading',
      'image',
      'numberedListItem',
      'paragraph',
      'quote',
      'table',
    ])
  })
})
