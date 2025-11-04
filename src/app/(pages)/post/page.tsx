import type { Metadata } from 'next'
import { PostListItem } from '@/app/(pages)/post/_components/post-list-item'
import { getPosts } from '@/shared/lib/posts'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '블로그',
    description: 'DoGeol의 기술 블로그',
  }
}

export default function Page() {
  const posts = getPosts()

  return (
    <section className="tablet:py-20 mx-auto w-full max-w-7xl px-4 py-12">
      <div className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">블로그</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          기술, 개발, 그리고 일상에 대한 생각을 기록합니다.
        </p>
      </div>

      <div className="tablet:grid-cols-3 grid grid-cols-1 gap-x-8 gap-y-12">
        {posts.map((post) => (
          <PostListItem key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
