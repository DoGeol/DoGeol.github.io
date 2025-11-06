'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown'

interface Props {
  slug: string
}

export default function ToolbarPlugin({ slug }: Props) {
  const [editor] = useLexicalComposerContext()

  const handleDownload = () => {
    editor.update(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS)
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${slug}.mdx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="absolute top-[-50px] right-0 flex gap-2">
      <button
        onClick={handleDownload}
        className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600">
        Download MDX
      </button>
    </div>
  )
}
