'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown'

interface Props {
  content: string
}

export default function MarkdownPlugin({ content }: Props) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.update(() => {
      $convertFromMarkdownString(content, TRANSFORMERS)
    })
  }, [editor, content])

  return null
}
