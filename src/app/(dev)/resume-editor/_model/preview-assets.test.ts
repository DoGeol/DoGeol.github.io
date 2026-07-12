import { describe, expect, it } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import { collectPreviewAssets } from './preview-assets'

describe('collectPreviewAssets', () => {
  it('profile과 experience logo의 현재 form path를 수집한다', () => {
    expect(collectPreviewAssets(createResumeFixture())).toEqual([
      { fieldPath: 'assets.profileFront', url: '/profile/pdg-real.webp' },
      { fieldPath: 'assets.profileBack', url: '/profile/pdg-profile.webp' },
      { fieldPath: 'sections.2.data.items.0.logoPath', url: '/company/logo/laud.webp' },
    ])
  })
})
