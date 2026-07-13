import type { AssetProvider, AssetValidationResult, BlogAssetSource } from './asset-provider'

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export class LocalPublicAssetProvider implements AssetProvider {
  readonly id = 'public' as const

  constructor(private readonly fetcher: Fetcher = fetch) {}

  resolvePreviewUrl(source: BlogAssetSource) {
    return source.path
  }

  async validate(source: BlogAssetSource): Promise<AssetValidationResult> {
    if (!source.path.startsWith('/blog/')) {
      return { valid: false, message: '/blog/ 아래 경로를 입력하세요.' }
    }
    try {
      const response = await this.fetcher(source.path, { method: 'HEAD' })
      return response.ok
        ? { valid: true }
        : { valid: false, message: 'public asset을 찾을 수 없습니다.' }
    } catch {
      return { valid: false, message: 'public asset을 확인할 수 없습니다.' }
    }
  }
}
