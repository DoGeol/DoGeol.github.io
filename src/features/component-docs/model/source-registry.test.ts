import { describe, expect, it } from 'vitest'

import { readSource } from './source-registry'

describe('source registry', () => {
  it('reads only allowlisted component source', async () => {
    await expect(readSource('accordion-root')).resolves.toContain('export const AccordionRoot')
  })

  it('does not accept arbitrary paths', async () => {
    await expect(readSource('../package.json' as never)).rejects.toThrow('Unknown source id')
  })
})
