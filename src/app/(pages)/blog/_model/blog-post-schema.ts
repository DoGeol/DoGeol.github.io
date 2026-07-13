import { z } from 'zod'

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다')

const publicAssetSourceSchema = z.object({
  provider: z.literal('public'),
  path: z.string().regex(/^\/blog\/.+/, '블로그 asset은 /blog/ 아래 경로여야 합니다'),
})

export const blogImageSchema = z.object({
  source: publicAssetSourceSchema,
  alt: z.string().trim().min(1, '이미지 대체 텍스트가 필요합니다'),
  caption: z.string().trim().min(1).nullable(),
})

const textInlineContentSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  styles: z.record(z.string(), z.unknown()),
})

const linkInlineContentSchema = z
  .object({
    type: z.literal('link'),
    href: z.string(),
    content: z.union([z.string(), z.array(textInlineContentSchema)]),
  })
  .superRefine(({ href }, context) => {
    if (/^(https?:|mailto:|\/|#)/.test(href)) return
    context.addIssue({ code: 'custom', message: '허용하지 않는 링크 형식입니다', path: ['href'] })
  })

const inlineContentSchema = z.union([textInlineContentSchema, linkInlineContentSchema])
const tableContentSchema = z.object({
  type: z.literal('tableContent'),
  rows: z.array(
    z.object({
      cells: z.array(z.union([z.string(), z.array(inlineContentSchema)])),
    }),
  ),
})

const allowedBlockTypes = [
  'paragraph',
  'heading',
  'bulletListItem',
  'numberedListItem',
  'checkListItem',
  'quote',
  'codeBlock',
  'table',
  'image',
  'divider',
] as const

export type BlogBlock = {
  id: string
  type: (typeof allowedBlockTypes)[number]
  props: Record<string, unknown>
  content?: Array<z.infer<typeof inlineContentSchema>> | z.infer<typeof tableContentSchema>
  children: BlogBlock[]
}

export const blogBlockSchema: z.ZodType<BlogBlock> = z.lazy(() =>
  z
    .object({
      id: z.string().min(1),
      type: z.enum(allowedBlockTypes),
      props: z.record(z.string(), z.unknown()),
      content: z.union([z.array(inlineContentSchema), tableContentSchema]).optional(),
      children: z.array(blogBlockSchema),
    })
    .superRefine((block, context) => {
      if (block.type === 'heading') {
        const level = block.props.level
        if (level !== 2 && level !== 3 && level !== 4) {
          context.addIssue({ code: 'custom', message: '본문 제목은 H2~H4만 허용합니다' })
        }
      }
      if (block.type === 'image') {
        const url = block.props.url
        const name = block.props.name
        if (typeof url !== 'string' || !/^\/blog\/.+/.test(url)) {
          context.addIssue({ code: 'custom', message: '이미지는 /blog/ 경로여야 합니다' })
        }
        if (typeof name !== 'string' || name.trim() === '') {
          context.addIssue({ code: 'custom', message: '이미지 대체 텍스트가 필요합니다' })
        }
      }
    }),
)

export const blogPostSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.uuid(),
    title: z.string().trim().min(1).max(120),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .regex(/^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u),
    summary: z.string().trim().min(1).max(240),
    status: z.enum(['draft', 'published']),
    publishedAt: isoDateSchema.nullable(),
    updatedAt: isoDateSchema,
    tags: z.array(z.string().trim().min(1).max(30)).max(8),
    coverImage: blogImageSchema.nullable(),
    blocks: z.array(blogBlockSchema).min(1),
  })
  .superRefine((post, context) => {
    if (post.status === 'published' && post.publishedAt === null) {
      context.addIssue({
        code: 'custom',
        message: '공개 글에는 발행일이 필요합니다',
        path: ['publishedAt'],
      })
    }
    if (new Set(post.tags.map((tag) => tag.toLocaleLowerCase('ko-KR'))).size !== post.tags.length) {
      context.addIssue({ code: 'custom', message: '태그가 중복되었습니다', path: ['tags'] })
    }
  })

export type BlogPost = z.infer<typeof blogPostSchema>
export type BlogPostInput = z.input<typeof blogPostSchema>
export type BlogPostSummary = Omit<BlogPost, 'blocks'>

export const blogPostDraftSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.uuid(),
  title: z.string().max(120),
  slug: z.string().max(120),
  summary: z.string().max(240),
  status: z.enum(['draft', 'published']),
  publishedAt: isoDateSchema.nullable(),
  updatedAt: isoDateSchema,
  tags: z.array(z.string().max(30)).max(8),
  coverImage: z
    .object({
      source: z.object({ provider: z.literal('public'), path: z.string() }),
      alt: z.string(),
      caption: z.string().nullable(),
    })
    .nullable(),
  blocks: z.array(blogBlockSchema).min(1),
})

export type BlogPostDraft = z.infer<typeof blogPostDraftSchema>
