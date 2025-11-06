'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { editorTheme } from './theme'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TRANSFORMERS } from '@lexical/markdown'
import MarkdownPlugin from './markdown-plugin'
import ToolbarPlugin from './toolbar-plugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'

const editorConfig = {
  namespace: 'MDXEditor',
  theme: editorTheme,
  onError(error: Error) {
    throw error
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
  ],
}

interface Props {
  content: string
  slug: string
}

export default function MDXEditor({ content, slug }: Props) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container relative rounded-md border border-gray-300 p-4 dark:border-gray-700">
        <ToolbarPlugin slug={slug} />
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input h-full min-h-[400px]" />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <MarkdownPlugin content={content} />
      </div>
    </LexicalComposer>
  )
}
