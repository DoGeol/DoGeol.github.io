import { describe, expect, it } from 'vitest'

import { componentDocs, getAdjacentDocs, getComponentDoc } from './catalog'

describe('component docs catalog', () => {
  it('keeps unique slugs and section ids in the intended order', () => {
    expect(componentDocs.map(({ slug }) => slug)).toEqual(['accordion', 'input'])
    expect(new Set(componentDocs.map(({ slug }) => slug)).size).toBe(componentDocs.length)

    for (const doc of componentDocs) {
      const ids = doc.sections.map(({ id }) => id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('returns known documents and rejects unknown slugs', () => {
    expect(getComponentDoc('accordion')?.title).toBe('Accordion')
    expect(getComponentDoc('missing')).toBeUndefined()
  })

  it('returns adjacent documents', () => {
    expect(getAdjacentDocs('accordion')).toEqual({ previous: undefined, next: componentDocs[1] })
    expect(getAdjacentDocs('input')).toEqual({ previous: componentDocs[0], next: undefined })
  })
})
