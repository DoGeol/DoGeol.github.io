import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { blogPostSchema, type BlogBlock, type BlogPost } from './blog-post-schema'

type BlogPostSource = {
  file: string
  post: BlogPost
}

export type BlogPostCollection = {
  all: BlogPost[]
  published: BlogPost[]
}

const collectImagePaths = (blocks: BlogBlock[]): string[] =>
  blocks.flatMap((block) => {
    const own =
      block.type === 'image' && typeof block.props.url === 'string' ? [block.props.url] : []
    return [...own, ...collectImagePaths(block.children)]
  })

const assertUnique = (sources: BlogPostSource[], field: 'id' | 'slug') => {
  const seen = new Map<string, string>()
  for (const source of sources) {
    const value = source.post[field]
    const previous = seen.get(value)
    if (previous !== undefined) {
      throw new Error(`${field} 중복: ${previous}, ${source.file} (${value})`)
    }
    seen.set(value, source.file)
  }
}

const assertAssetsExist = async (
  source: BlogPostSource,
  publicDirectory: string,
): Promise<void> => {
  const paths = [
    ...(source.post.coverImage === null ? [] : [source.post.coverImage.source.path]),
    ...collectImagePaths(source.post.blocks),
  ]
  for (const assetPath of paths) {
    const absolute = path.join(publicDirectory, assetPath.replace(/^\//, ''))
    try {
      await access(absolute)
    } catch {
      throw new Error(`${source.file}: asset이 없습니다: ${assetPath}`)
    }
  }
}

export async function loadBlogPosts({
  postsDirectory,
  publicDirectory,
}: {
  postsDirectory: string
  publicDirectory: string
}): Promise<BlogPostCollection> {
  const entries = await readdir(postsDirectory, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort()
  const sources = await Promise.all(
    files.map(async (file): Promise<BlogPostSource> => {
      const raw = await readFile(path.join(postsDirectory, file), 'utf8')
      let input: unknown
      try {
        input = JSON.parse(raw)
      } catch (error) {
        throw new Error(`${file}: JSON을 읽을 수 없습니다`, { cause: error })
      }
      const result = blogPostSchema.safeParse(input)
      if (!result.success) {
        throw new Error(
          `${file}: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`,
        )
      }
      return { file, post: result.data }
    }),
  )
  assertUnique(sources, 'id')
  assertUnique(sources, 'slug')
  await Promise.all(sources.map((source) => assertAssetsExist(source, publicDirectory)))

  const all = sources.map(({ post }) => post)
  const published = all
    .filter((post) => post.status === 'published')
    .sort((left, right) => (right.publishedAt ?? '').localeCompare(left.publishedAt ?? ''))
  return { all, published }
}

const canonicalPostsDirectory = path.join(process.cwd(), 'src/app/(pages)/blog/_data/posts')

export const getCanonicalBlogPosts = () =>
  loadBlogPosts({
    postsDirectory: canonicalPostsDirectory,
    publicDirectory: path.join(process.cwd(), 'public'),
  })
