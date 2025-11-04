'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Post } from '@/shared/types/post'

type Props = {
  post: Omit<Post, 'content'>
}

export function PostListItem({ post }: Props) {
  return (
    <motion.article
      className="group flex flex-col shadow-lg"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Link href={`/post/${post.slug}`} prefetch={false} className="flex h-full flex-col">
        {post.thumbnail && (
          <div className="flex-shrink-0">
            <motion.img
              src={post.thumbnail}
              alt={`${post.title} 썸네일`}
              className="aspect-video w-full rounded-t-lg object-cover"
              layoutId={`post-thumbnail-${post.slug}`}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between rounded-b-lg bg-white p-6 dark:bg-gray-800">
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {post.title}
            </h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300">{post.summary}</p>
          </div>
          <div className="mt-6 flex items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
