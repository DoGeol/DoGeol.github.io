import type { BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

export const createBlogPostDraft = ({
  date,
  postId,
  blockId,
}: {
  date: string
  postId: string
  blockId: string
}): BlogPostDraft => ({
  schemaVersion: 1,
  id: postId,
  title: '',
  slug: '',
  summary: '',
  status: 'draft',
  publishedAt: null,
  updatedAt: date,
  tags: [],
  coverImage: null,
  blocks: [{ id: blockId, type: 'paragraph', props: {}, content: [], children: [] }],
})
