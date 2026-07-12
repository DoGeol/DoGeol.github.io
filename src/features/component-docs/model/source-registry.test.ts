// @vitest-environment node

import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { readSource } from './source-registry'

describe('source registry', () => {
  it('reads only allowlisted component source', async () => {
    await expect(readSource('accordion-root')).resolves.toContain('export const AccordionRoot')
  })

  it('does not accept arbitrary paths', async () => {
    await expect(readSource('../package.json' as never)).rejects.toThrow('Unknown source id')
  })

  it('각 allowlist 항목의 정적으로 한정된 reader로 소스를 읽는다', async () => {
    const registrySource = readFileSync(
      path.join(process.cwd(), 'src/features/component-docs/model/source-registry.ts'),
      'utf8',
    )

    await expect(readSource('input')).resolves.toContain('Input')
    await expect(readSource('accordion-examples')).resolves.toContain('Accordion')
    await expect(readSource('input-examples')).resolves.toContain('Input')
    expect(registrySource).not.toContain('let filePath')
    expect(registrySource).not.toContain('readFile(filePath')
  })
})
