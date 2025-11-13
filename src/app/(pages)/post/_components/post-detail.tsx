'use client'

import { motion } from 'framer-motion'
import { Post } from '@/shared/types/post'
import { BackButton } from '@/app/(pages)/post/_components/back-button'
import { PropsWithChildren } from 'react'

type Props = {
  post: Post
}

export function PostDetail({ post, children }: PropsWithChildren<Props>) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 md:py-20">
      <BackButton />
      {post.thumbnail && (
        <motion.img
          src={post.thumbnail}
          alt={`${post.title} 썸네일`}
          className="mb-8 w-full rounded-lg object-cover"
          layoutId={`post-thumbnail-${post.slug}`}
        />
      )}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          {new Date(post.date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      <div className="mdx-content">{children}</div>
    </article>
  )
}
