'use client'

import type { PartialBlock } from '@blocknote/core'
import { ko } from '@blocknote/core/locales'
import { BlockNoteView } from '@blocknote/ariakit'
import { useCreateBlockNote } from '@blocknote/react'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

import type { BlogBlock } from '@/app/(pages)/blog/_model/blog-post-schema'

import { blogBlockNoteSchema } from '../_model/blog-blocknote-schema'

type BlogPartialBlock = PartialBlock<
  typeof blogBlockNoteSchema.blockSchema,
  typeof blogBlockNoteSchema.inlineContentSchema,
  typeof blogBlockNoteSchema.styleSchema
>

export function BlockNoteSurface({
  blocks,
  editable,
  onChange,
}: {
  blocks: BlogBlock[]
  editable: boolean
  onChange: (blocks: BlogBlock[]) => void
}) {
  const { resolvedTheme } = useTheme()
  const editor = useCreateBlockNote({
    schema: blogBlockNoteSchema,
    dictionary: ko,
    initialContent: blocks as unknown as BlogPartialBlock[],
  })

  useEffect(() => {
    if (editable) return
    editor.replaceBlocks(editor.document, blocks as unknown as BlogPartialBlock[])
  }, [blocks, editable, editor])

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      formattingToolbar={editable}
      linkToolbar={editable}
      slashMenu={editable}
      sideMenu={editable}
      filePanel={editable}
      tableHandles={editable}
      emojiPicker={false}
      onChange={editable ? () => onChange(editor.document as unknown as BlogBlock[]) : undefined}
    />
  )
}
