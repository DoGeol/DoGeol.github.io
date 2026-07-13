import Link from 'next/link'
import type { ReactNode } from 'react'

import type { BlogPost } from '../_model/blog-post-schema'
import { buildBlogToc, calculateReadingMinutes } from '../_model/blog-toc'
import { ArticleEnhancements } from './article-enhancements'

const formatDate = (date: string | null) => date?.replaceAll('-', '.') ?? ''

export function BlogArticle({ post, children }: { post: BlogPost; children: ReactNode }) {
  const toc = buildBlogToc(post.blocks)
  const readingMinutes = calculateReadingMinutes(post.blocks)
  return (
    <>
      <div className="tablet:px-8 tablet:py-12 mx-auto max-w-7xl px-5 py-8">
        <Link
          href="/blog"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          ← 블로그로 돌아가기
        </Link>
        <div className="pc:grid-cols-[minmax(0,52rem)_16rem] pc:gap-16 pc:grid mt-8">
          <article className="min-w-0">
            <header className="border-b border-neutral-200 pb-7 dark:border-neutral-800">
              <h1 className="tablet:text-[2.5rem] tablet:leading-[1.15] text-4xl font-black tracking-tight text-slate-950 dark:text-white">
                {post.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                {post.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-5 text-sm text-neutral-500">
                <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
                <span>읽는 시간 {readingMinutes}분</span>
                {post.updatedAt !== post.publishedAt && (
                  <span>수정 {formatDate(post.updatedAt)}</span>
                )}
              </div>
            </header>
            {post.coverImage !== null && (
              <figure className="mt-8">
                <img
                  src={post.coverImage.source.path}
                  alt={post.coverImage.alt}
                  className="w-full rounded-xl"
                />
                {post.coverImage.caption !== null && (
                  <figcaption className="mt-2 text-center text-sm text-neutral-500">
                    {post.coverImage.caption}
                  </figcaption>
                )}
              </figure>
            )}
            {toc.length > 0 && (
              <details className="pc:hidden my-8 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                <summary className="cursor-pointer font-semibold">이 글의 목차</summary>
                <ol className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {toc.map((item) => (
                    <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
                      <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                  ))}
                </ol>
              </details>
            )}
            <div className="blog-article-body" data-blog-article-body>
              {children}
            </div>
            <ArticleEnhancements />
          </article>
          <aside
            className="pc:block sticky top-8 hidden h-fit border-l border-neutral-200 pl-6 dark:border-neutral-800"
            aria-label="이 글의 목차"
          >
            <p className="mb-4 text-sm font-bold text-slate-900 dark:text-white">이 글의 목차</p>
            <ol className="space-y-3 text-sm text-neutral-500">
              {toc.map((item, index) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
                  <a
                    className={`blog-toc-link hover:text-blue-600 dark:hover:text-blue-400 ${index === 0 ? 'is-active' : ''}`}
                    href={`#${item.id}`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </>
  )
}
