import { createBlogRssXml } from '../_model/blog-feed'
import { getCanonicalBlogPosts } from '../_model/blog-post-data'

export const dynamic = 'force-static'

export async function GET() {
  const { published } = await getCanonicalBlogPosts()
  return new Response(createBlogRssXml(published), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
