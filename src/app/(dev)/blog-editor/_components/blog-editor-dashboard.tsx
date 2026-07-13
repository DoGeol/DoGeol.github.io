'use client'

import Link from 'next/link'

import type { BlogPost } from '@/app/(pages)/blog/_model/blog-post-schema'

import { useBlogDraftStorage } from '../_model/use-blog-draft-storage'

export function BlogEditorDashboard({ canonicalPosts }: { canonicalPosts: BlogPost[] }) {
  const {
    state: { drafts },
  } = useBlogDraftStorage()

  const canonicalIds = new Set(canonicalPosts.map(({ id }) => id))
  const sessionOnly = Object.values(drafts).filter(({ id }) => !canonicalIds.has(id))
  const posts = [...canonicalPosts.map((post) => drafts[post.id] ?? post), ...sessionOnly]

  return (
    <main
      data-blog-editor-client-marker="blog-editor-client-only-marker"
      className="min-h-dvh bg-slate-50 px-5 py-10 text-slate-950 dark:bg-neutral-950 dark:text-white"
    >
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-neutral-200 pb-7 dark:border-neutral-800">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              LOCAL BLOG EDITOR
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">블로그 글 관리</h1>
            <p className="mt-2 text-sm text-neutral-500">
              현재 탭의 초안만 자동 저장되며 저장소 파일은 직접 변경하지 않습니다.
            </p>
          </div>
          <Link
            href="/blog-editor/edit?postId=new"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            새 글 작성
          </Link>
        </header>
        {posts.length === 0 ? (
          <div className="py-24 text-center text-neutral-500">아직 작성한 글이 없습니다.</div>
        ) : (
          <ul className="mt-8 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white px-5 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}
                    >
                      {post.status}
                    </span>
                    {drafts[post.id] !== undefined && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">session 초안</span>
                    )}
                  </div>
                  <Link
                    href={`/blog-editor/edit?postId=${encodeURIComponent(post.id)}`}
                    className="mt-2 block truncate text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {post.title.trim() || '제목 없는 글'}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500">
                    /{post.slug || 'slug-미정'} · 수정 {post.updatedAt}
                  </p>
                </div>
                <Link
                  href={`/blog-editor/edit?postId=${encodeURIComponent(post.id)}`}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
                >
                  편집
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
