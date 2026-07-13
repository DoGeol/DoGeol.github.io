import type { BlogPost } from './blog-post-schema'

const SITE_URL = 'https://dogeol.github.io'

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const rssDate = (date: string) => new Date(`${date}T00:00:00+09:00`).toUTCString()

export const createBlogRssXml = (posts: BlogPost[]) => {
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.summary)}</description>`,
        `      <pubDate>${rssDate(post.publishedAt ?? post.updatedAt)}</pubDate>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n')
    })
    .join('\n')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>PDG Dev Notes</title>',
    `    <link>${SITE_URL}/blog</link>`,
    '    <description>프론트엔드 개발, 제품 설계와 협업에 관한 기록</description>',
    '    <language>ko-KR</language>',
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}
