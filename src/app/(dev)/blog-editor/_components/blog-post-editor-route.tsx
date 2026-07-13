'use client'

import Link from 'next/link'
import { useMemo, useSyncExternalStore } from 'react'

import type { BlogPost, BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

import { createBlogPostDraft } from '../_model/create-blog-post'
import { BlogPostEditor } from './blog-post-editor'

type EditorSelection =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; draft: BlogPostDraft; canonicalSlug?: string }

export function BlogPostEditorRoute({
  canonicalPosts,
  today,
}: {
  canonicalPosts: BlogPost[]
  today: string
}) {
  const search = useSyncExternalStore(
    (onChange) => {
      window.addEventListener('popstate', onChange)
      return () => window.removeEventListener('popstate', onChange)
    },
    () => window.location.search,
    () => null,
  )
  const selection = useMemo<EditorSelection>(() => {
    if (search === null) return { status: 'loading' }
    const postId = new URLSearchParams(search).get('postId')
    if (postId === 'new') {
      return {
        status: 'ready',
        draft: createBlogPostDraft({
          date: today,
          postId: crypto.randomUUID(),
          blockId: crypto.randomUUID(),
        }),
      }
    }

    const post = canonicalPosts.find(({ id }) => id === postId)
    return post === undefined
      ? { status: 'missing' }
      : {
          status: 'ready',
          draft: post,
          canonicalSlug: post.status === 'published' ? post.slug : undefined,
        }
  }, [canonicalPosts, search, today])

  if (selection.status === 'loading') {
    return <main className="grid min-h-dvh place-items-center">편집기를 준비하고 있습니다.</main>
  }

  if (selection.status === 'missing') {
    return (
      <main className="grid min-h-dvh place-items-center px-5 text-center">
        <div>
          <h1 className="text-xl font-bold">편집할 글을 찾을 수 없습니다.</h1>
          <Link href="/blog-editor" className="mt-4 inline-block text-blue-600 underline">
            글 관리로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  return (
    <BlogPostEditor
      key={selection.draft.id}
      initialDraft={selection.draft}
      canonicalSlug={selection.canonicalSlug}
    />
  )
}
