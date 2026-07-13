import { blogPostSchema, type BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

export const serializeBlogPostForExport = (draft: BlogPostDraft, canonicalSlug?: string) => {
  if (canonicalSlug !== undefined && draft.status === 'published' && draft.slug !== canonicalSlug) {
    return {
      success: false as const,
      issues: [{ path: ['slug'], message: '공개된 글의 slug는 변경할 수 없습니다' }],
    }
  }
  const result = blogPostSchema.safeParse(draft)
  if (!result.success) return { success: false as const, issues: result.error.issues }
  return {
    success: true as const,
    filename: `${result.data.slug}.json`,
    json: `${JSON.stringify(result.data, null, 2)}\n`,
  }
}

export const downloadBlogPostJson = (filename: string, json: string, documentObject: Document) => {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json;charset=utf-8' }))
  const anchor = documentObject.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
