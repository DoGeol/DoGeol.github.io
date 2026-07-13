import type { Metadata, NextPage } from 'next'

import { BlogPostFilter } from './_components/blog-post-filter'
import { getCanonicalBlogPosts } from './_model/blog-post-data'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Blog`,
  }
}

const Page: NextPage = () => {
  return <BlogPage />
}

async function BlogPage() {
  const { published } = await getCanonicalBlogPosts()
  const summaries = published.map((post) => ({
    schemaVersion: post.schemaVersion,
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    status: post.status,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    tags: post.tags,
    coverImage: post.coverImage,
  }))
  return (
    <div className="tablet:px-8 tablet:py-20 mx-auto max-w-5xl px-5 py-14">
      <header className="mb-12 max-w-3xl">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">PDG TECH BLOG</p>
        <h1 className="tablet:text-5xl mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          기술과 일에 관한 기록
        </h1>
        <p className="mt-5 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
          프론트엔드 개발, 제품 설계와 더 나은 협업 방식을 기록합니다.
        </p>
      </header>
      <BlogPostFilter posts={summaries} />
    </div>
  )
}

export default Page
