import { getCanonicalBlogPosts } from '@/app/(pages)/blog/_model/blog-post-data'

import { BlogEditorDashboard } from './_components/blog-editor-dashboard'

export default async function BlogEditorPage() {
  const { all } = await getCanonicalBlogPosts()
  return <BlogEditorDashboard canonicalPosts={all} />
}
