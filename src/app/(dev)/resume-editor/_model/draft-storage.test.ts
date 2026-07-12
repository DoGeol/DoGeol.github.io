import { beforeEach, describe, expect, it } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import {
  clearResumeDraft,
  readResumeDraft,
  RESUME_DRAFT_STORAGE_KEY,
  writeResumeDraft,
} from './draft-storage'

describe('resume draft storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('round-trips a valid versioned draft', () => {
    const draft = createResumeFixture()

    writeResumeDraft(sessionStorage, draft, new Date('2026-07-12T00:00:00.000Z'))

    expect(readResumeDraft(sessionStorage)).toEqual({
      status: 'restored',
      draft,
      savedAt: '2026-07-12T00:00:00.000Z',
    })
  })

  it.each([
    ['malformed JSON', '{broken'],
    [
      'a version mismatch',
      JSON.stringify({
        schemaVersion: 2,
        savedAt: '2026-07-12T00:00:00.000Z',
        draft: createResumeFixture(),
      }),
    ],
    [
      'a draft shape mismatch',
      JSON.stringify({
        schemaVersion: 1,
        savedAt: '2026-07-12T00:00:00.000Z',
        draft: { schemaVersion: 1 },
      }),
    ],
  ])('discards %s', (_label, raw) => {
    sessionStorage.setItem(RESUME_DRAFT_STORAGE_KEY, raw)

    expect(readResumeDraft(sessionStorage)).toEqual({ status: 'discarded' })
    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()
  })

  it('returns empty when no draft exists', () => {
    expect(readResumeDraft(sessionStorage)).toEqual({ status: 'empty' })
  })

  it('clears the current-tab draft', () => {
    writeResumeDraft(sessionStorage, createResumeFixture())

    clearResumeDraft(sessionStorage)

    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()
  })
})
