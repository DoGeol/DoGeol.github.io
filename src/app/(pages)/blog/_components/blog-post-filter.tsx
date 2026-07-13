'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { BlogPostSummary } from '../_model/blog-post-schema'

const formatDate = (date: string | null) => date?.replaceAll('-', '.') ?? ''

export function BlogPostFilter({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<string | null>(null)
  const tags = useMemo(
    () =>
      Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b)),
    [posts],
  )
  const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR')
  const filtered = posts.filter((post) => {
    const matchesQuery =
      normalizedQuery === '' ||
      [post.title, post.summary, ...post.tags]
        .join(' ')
        .toLocaleLowerCase('ko-KR')
        .includes(normalizedQuery)
    return matchesQuery && (tag === null || post.tags.includes(tag))
  })

  return (
    <section aria-label="블로그 글 탐색">
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
        <label className="sr-only" htmlFor="blog-search">
          글 검색
        </label>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목, 요약, 태그 검색"
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-blue-950"
        />
        <div id="tags" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={tag === null}
            onClick={() => setTag(null)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm aria-pressed:border-blue-500 aria-pressed:bg-blue-50 aria-pressed:text-blue-700 dark:border-neutral-700 dark:aria-pressed:bg-blue-950 dark:aria-pressed:text-blue-300"
          >
            전체
          </button>
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={tag === item}
              onClick={() => setTag((current) => (current === item ? null : item))}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm aria-pressed:border-blue-500 aria-pressed:bg-blue-50 aria-pressed:text-blue-700 dark:border-neutral-700 dark:aria-pressed:bg-blue-950 dark:aria-pressed:text-blue-300"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">조건에 맞는 글이 없습니다.</p>
      ) : (
        <ol className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {filtered.map((post) => (
            <li key={post.id} className="py-8">
              <Link href={`/blog/${post.slug}`} className="group block max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <time dateTime={post.publishedAt ?? undefined}>
                    {formatDate(post.publishedAt)}
                  </time>
                  {post.updatedAt !== post.publishedAt && (
                    <span>수정 {formatDate(post.updatedAt)}</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {post.title}
                </h2>
                <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">
                  {post.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((postTag) => (
                    <span
                      key={postTag}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400"
                    >
                      #{postTag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
