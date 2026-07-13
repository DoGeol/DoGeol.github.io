import type { BlogBlock, BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

export type BlogAssetSource = {
  provider: 'public'
  path: string
}

export type AssetValidationResult = { valid: true } | { valid: false; message: string }

export interface AssetProvider<Source extends BlogAssetSource = BlogAssetSource> {
  readonly id: Source['provider']
  resolvePreviewUrl(source: Source): string
  validate(source: Source): Promise<AssetValidationResult>
}

const collectBlockSources = (blocks: BlogBlock[]): BlogAssetSource[] =>
  blocks.flatMap((block) => {
    const own =
      block.type === 'image' && typeof block.props.url === 'string'
        ? [{ provider: 'public' as const, path: block.props.url }]
        : []
    return [...own, ...collectBlockSources(block.children)]
  })

export const collectBlogAssetSources = (draft: BlogPostDraft): BlogAssetSource[] => [
  ...(draft.coverImage === null ? [] : [draft.coverImage.source]),
  ...collectBlockSources(draft.blocks),
]

export const validateBlogAssets = async (draft: BlogPostDraft, provider: AssetProvider) => {
  const results = await Promise.all(
    collectBlogAssetSources(draft).map(async (source) => ({
      source,
      result: await provider.validate(source),
    })),
  )
  return results.flatMap(({ source, result }) =>
    result.valid ? [] : [{ path: source.path, message: result.message }],
  )
}
