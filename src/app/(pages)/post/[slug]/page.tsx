import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts } from '@/shared/lib/posts'
import { mdxComponents } from '@/shared/components/mdx-editor/mdx-components'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { PostDetail } from '@/app/(pages)/post/_components/post-detail'

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
    <PostDetail post={post}>
      <MDXRemote source={post.content} components={mdxComponents} />
    </PostDetail>
  )
}
