import { getCanonicalBlogPosts } from '@/app/(pages)/blog/_model/blog-post-data'

import { BlogPostEditorRoute } from '../_components/blog-post-editor-route'

export default async function BlogPostEditorPage() {
  const { all } = await getCanonicalBlogPosts()
  return <BlogPostEditorRoute canonicalPosts={all} today={new Date().toISOString().slice(0, 10)} />
}
