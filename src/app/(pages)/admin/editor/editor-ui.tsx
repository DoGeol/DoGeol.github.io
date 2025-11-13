'use client'

import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  frontmatterPlugin,
  linkPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import the MDXEditor with SSR disabled
const Editor = dynamic(() => import('@mdxeditor/editor').then((mod) => mod.MDXEditor), {
  ssr: false,
})

// Define the props for the UI component
interface EditorUIProps {
  posts: { slug: string; content: string }[]
}

export function EditorUI({ posts }: EditorUIProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [editorKey, setEditorKey] = useState<number>(0)

  useEffect(() => {
    if (posts.length > 0 && !selectedSlug) {
      const firstPost = posts[0]
      setSelectedSlug(firstPost.slug)
      setContent(firstPost.content)
      setEditorKey((prev) => prev + 1) // Force re-render
    }
  }, [posts, selectedSlug])

  const handlePostChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value
    const post = posts.find((p) => p.slug === slug)
    if (post) {
      setSelectedSlug(post.slug)
      setContent(post.content)
      setEditorKey((prev) => prev + 1) // Force re-render of editor
    }
  }

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedSlug}.mdx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Define plugins for the editor
  const allPlugins = [
    toolbarPlugin({
      toolbarContents: () => (
        <>
          {' '}
          <button onClick={handleSave}>Save</button>
        </>
      ),
    }),
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    frontmatterPlugin(),
    linkPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'tsx' }),
    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', tsx: 'TypeScript' } }),
    markdownShortcutPlugin(),
  ]

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <label htmlFor="post-select">Select Post: </label>
        <select id="post-select" value={selectedSlug} onChange={handlePostChange}>
          {posts.map((post) => (
            <option key={post.slug} value={post.slug}>
              {post.slug}
            </option>
          ))}
        </select>
      </div>
      {content && (
        <div className="min-h-0 flex-1">
          <Editor
            key={editorKey}
            markdown={content}
            onChange={setContent}
            plugins={allPlugins}
            contentEditableClassName="mdx-content"
          />
        </div>
      )}
    </div>
  )
}
