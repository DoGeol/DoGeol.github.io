import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { EditorUI } from '@/app/(pages)/admin/editor/editor-ui'

async function getAllPosts() {
  if (process.env.NODE_ENV === 'production') {
    return []
  }

  const postsDirectory = path.join(process.cwd(), 'content/post')
  const filenames = fs.readdirSync(postsDirectory)

  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const filePath = path.join(postsDirectory, filename)
    const content = fs.readFileSync(filePath, 'utf8')
    return { slug, content }
  })

  return posts
}

export default async function Page() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  const posts = await getAllPosts()

  return <EditorUI posts={posts} />
}
