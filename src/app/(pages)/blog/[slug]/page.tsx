import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogArticle } from '../_components/blog-article'
import { BlogBlockContent } from '../_components/blog-block-content'
import { getCanonicalBlogPosts } from '../_model/blog-post-data'

export const dynamicParams = false

export async function generateStaticParams() {
  const { published } = await getCanonicalBlogPosts()
  return published.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { published } = await getCanonicalBlogPosts()
  const requestedSlug = (await params).slug
  const post = published.find(({ slug }) => slug === requestedSlug)
  if (post === undefined) return {}
  const url = `https://dogeol.github.io/blog/${post.slug}`
  const image = post.coverImage?.source.path ?? '/logo.png'
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [image],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { published } = await getCanonicalBlogPosts()
  const slug = (await params).slug
  const post = published.find((item) => item.slug === slug)
  if (post === undefined) notFound()
  return (
    <BlogArticle post={post}>
      <BlogBlockContent blocks={post.blocks} />
    </BlogArticle>
  )
}
