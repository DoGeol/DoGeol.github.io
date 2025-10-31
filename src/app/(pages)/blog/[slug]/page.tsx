import { Metadata } from 'next'
import { getPostBySlug, getPosts } from '@/shared/lib/posts'

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
  console.log(11111, slug)
  const { default: Post } = await import(`../../../../../content/blog/${slug}.mdx`)

  return <Post />
}

export const dynamicParams = false
