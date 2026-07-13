import type { MetadataRoute } from 'next'

import { getCanonicalBlogPosts } from '@/app/(pages)/blog/_model/blog-post-data'

const SITE_URL = 'https://dogeol.github.io'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { published } = await getCanonicalBlogPosts()
  return [
    { url: SITE_URL, lastModified: '2026-07-13', changeFrequency: 'monthly', priority: 1 },
    {
      url: `${SITE_URL}/resume`,
      lastModified: '2025-10-15',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: published[0]?.updatedAt ?? '2026-07-13',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/old-resume`,
      lastModified: '2025-10-15',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/components`,
      lastModified: '2026-07-11',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/components/accordion`,
      lastModified: '2026-07-11',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/components/input`,
      lastModified: '2026-07-11',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...published.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
