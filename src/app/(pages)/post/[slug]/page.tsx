import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts } from '@/shared/lib/posts'
import { mdxComponents } from '@/shared/components/mdx-components'
import { MDXRemote } from 'next-mdx-remote/rsc'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return {
    title: post.title,
    description: post.summary,
  }
}

export function generateStaticParams() {
  const posts = getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 md:py-20">
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

      <div>
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  )
}
