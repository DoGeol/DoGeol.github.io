import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { assertDevelopmentRoutesExcluded } from './check-static-export.mjs'

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
  ])('%s에 dev 산출물이 있으면 거부한다', async (file, content) => {
    await writeExport(file, content)
    expect(() => assertDevelopmentRoutesExcluded(tempRoot)).toThrow(/development-only/i)
  })
})
