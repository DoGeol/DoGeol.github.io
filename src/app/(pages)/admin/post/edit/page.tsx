import { getPosts } from '@/shared/lib/posts'
import { getPostBySlug } from '@/shared/lib/posts'
import EditorClient from './editor-client'

export default async function EditPage() {
  const posts = getPosts()
  const allPostData = await Promise.all(
    posts.map(async (post) => {
      const { content } = await getPostBySlug(post.slug)
      return { slug: post.slug, title: post.title, content }
    }),
  )

  return <EditorClient allPostData={allPostData} />
}
