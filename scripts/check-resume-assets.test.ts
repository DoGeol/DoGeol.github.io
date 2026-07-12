import { afterEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { createResumeFixture } from '@/test/fixtures/resume'

import { assertResumeAssets, collectResumeAssetPaths } from './check-resume-assets.mjs'

const roots: string[] = []

const createRoot = () => {
  const root = mkdtempSync(path.join(tmpdir(), 'check-resume-assets-'))
  roots.push(root)
  return root
}

const writeAsset = (root: string, assetPath: string) => {
  const filePath = path.join(root, 'public', assetPath.slice(1))
  mkdirSync(path.dirname(filePath), { recursive: true })
  writeFileSync(filePath, '')
}

const createFixture = () => {
  const fixture = createResumeFixture()
  fixture.assets = {
    profileFront: '/profile/front.webp',
    profileBack: '/profile/back.webp',
  }
  const experience = fixture.sections.find((section) => section.type === 'experience')
  if (experience) experience.data.items[0]!.logoPath = '/company/logo/company.webp'
  return fixture
}

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }))
})

describe('resume asset validator', () => {
  it('프로필과 회사 로고 경로를 입력 순서대로 수집한다', () => {
    expect(collectResumeAssetPaths(createFixture())).toEqual([
      '/profile/front.webp',
      '/profile/back.webp',
      '/company/logo/company.webp',
    ])
  })

  it('누락된 asset을 보고한다', () => {
    const root = createRoot()
    const fixture = createFixture()
    writeAsset(root, '/profile/front.webp')

    expect(() => assertResumeAssets(root, fixture)).toThrow(/profile\/back\.webp/)
  })

  it('모든 asset 파일이 있으면 통과한다', () => {
    const root = createRoot()
    const fixture = createFixture()
    collectResumeAssetPaths(fixture).forEach((assetPath) => writeAsset(root, assetPath))

    expect(() => assertResumeAssets(root, fixture)).not.toThrow()
  })

  it('public root를 벗어나는 traversal을 거부한다', () => {
    const root = createRoot()
    const fixture = createFixture()
    fixture.assets.profileFront = '/../secret.webp'

    expect(() => assertResumeAssets(root, fixture)).toThrow(/\.\./)
  })

  it('root-relative URL이 아닌 filesystem 절대 경로를 거부한다', () => {
    const root = createRoot()
    const fixture = createFixture()
    fixture.assets.profileFront = path.join(root, 'private/front.webp')

    expect(() => assertResumeAssets(root, fixture)).toThrow(/root-relative/)
  })

  it('중복 URL을 한 번만 수집한다', () => {
    const fixture = createFixture()
    fixture.assets.profileBack = fixture.assets.profileFront
    const experience = fixture.sections.find((section) => section.type === 'experience')
    if (experience) experience.data.items[0]!.logoPath = fixture.assets.profileFront

    expect(collectResumeAssetPaths(fixture)).toEqual(['/profile/front.webp'])
  })

  it('누락된 여러 파일을 한 오류에 모두 보고한다', () => {
    const root = createRoot()

    expect(() => assertResumeAssets(root, createFixture())).toThrow(
      expect.objectContaining({
        message: expect.stringMatching(
          /profile\/front\.webp[\s\S]*profile\/back\.webp[\s\S]*company\/logo\/company\.webp/,
        ),
      }),
    )
  })
})
