import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  assertBlogStaticExportFiles,
  assertDevelopmentRoutesExcluded,
} from './check-static-export.mjs'

describe('assertDevelopmentRoutesExcluded', () => {
  let tempRoot: string

  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(tmpdir(), 'static-export-'))
  })

  afterEach(async () => {
    await rm(tempRoot, { recursive: true, force: true })
  })

  const writeExport = async (file: string, content: string) => {
    const target = path.join(tempRoot, file)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, content)
  }

  it('일반 public export를 허용한다', async () => {
    await writeExport('index.html', '<main>public</main>')
    expect(() => assertDevelopmentRoutesExcluded(tempRoot)).not.toThrow()
  })

  it.each([
    ['resume-editor.html', '<main>editor</main>'],
    ['_next/static/chunks/editor.js', 'resume-editor-dev-only-marker'],
    ['_next/static/chunks/shared.js', 'resume-editor-client-only-marker'],
    ['blog-editor.html', '<main>blog editor</main>'],
    ['_next/static/chunks/blog-editor.js', 'blog-editor-client-only-marker'],
    ['_next/static/chunks/storage.js', 'blog-editor:drafts:v1'],
  ])('%s에 dev 산출물이 있으면 거부한다', async (file, content) => {
    await writeExport(file, content)
    expect(() => assertDevelopmentRoutesExcluded(tempRoot)).toThrow(/development-only/i)
  })

  it('블로그 공개 route와 feed 산출물을 요구한다', async () => {
    for (const file of [
      'blog.html',
      'blog/react-server-components.html',
      'blog/rss.xml',
      'sitemap.xml',
    ]) {
      await writeExport(file, 'public')
    }

    expect(() => assertBlogStaticExportFiles(tempRoot)).not.toThrow()
  })

  it('블로그 공개 산출물이 빠지면 거부한다', async () => {
    await writeExport('blog.html', 'public')

    expect(() => assertBlogStaticExportFiles(tempRoot)).toThrow(/공개 산출물이 없습니다/)
  })
})
