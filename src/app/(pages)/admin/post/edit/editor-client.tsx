'use client'

import { useState } from 'react'
import MDXEditor from '@/shared/components/mdx-editor'

interface PostData {
  slug: string
  title: string
  content: string
}

interface Props {
  allPostData: PostData[]
}

export default function EditorClient({ allPostData }: Props) {
  const [selectedSlug, setSelectedSlug] = useState('')
  const [content, setContent] = useState<string | null>(null)

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value
    setSelectedSlug(slug)

    if (slug) {
      const post = allPostData.find((p) => p.slug === slug)
      setContent(post ? post.content : null)
    } else {
      setContent(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">MDX Editor</h1>
        <div className="w-1/3">
          <select
            value={selectedSlug}
            onChange={handleSelectChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700">
            <option value="">-- Select a post --</option>
            {allPostData.map((post) => (
              <option key={post.slug} value={post.slug}>
                {post.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {content !== null && selectedSlug && (
        <div className="prose dark:prose-invert max-w-none">
          <MDXEditor content={content} slug={selectedSlug} />
        </div>
      )}
    </div>
  )
}
