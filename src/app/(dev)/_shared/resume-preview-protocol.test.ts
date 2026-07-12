import { describe, expect, it } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import { parseEditorToPreviewMessage, parsePreviewToEditorMessage } from './resume-preview-protocol'

const origin = 'https://example.com'
const expectedSource = window as unknown as WindowProxy
const otherSource = { postMessage() {} } as unknown as WindowProxy

const event = (data: unknown, overrides: Partial<MessageEventInit> = {}) =>
  new MessageEvent('message', { data, origin, source: expectedSource, ...overrides })

describe('resume preview protocol', () => {
  it('정확한 네 message를 허용한다', () => {
    expect(
      parseEditorToPreviewMessage(
        event({ type: 'RENDER_DRAFT', draft: createResumeFixture(), selectedRegionId: null }),
        origin,
        expectedSource,
      ),
    ).toMatchObject({ type: 'RENDER_DRAFT' })
    expect(
      parseEditorToPreviewMessage(
        event({ type: 'SET_PREVIEW_MODE', mode: 'actual' }),
        origin,
        expectedSource,
      ),
    ).toEqual({ type: 'SET_PREVIEW_MODE', mode: 'actual' })
    expect(
      parsePreviewToEditorMessage(event({ type: 'PREVIEW_READY' }), origin, expectedSource),
    ).toEqual({ type: 'PREVIEW_READY' })
    expect(
      parsePreviewToEditorMessage(
        event({ type: 'SELECT_REGION', regionId: 'arbitrary:id/1', regionType: 'experience' }),
        origin,
        expectedSource,
      ),
    ).toEqual({ type: 'SELECT_REGION', regionId: 'arbitrary:id/1', regionType: 'experience' })
  })

  it.each([
    ['다른 origin', event({ type: 'PREVIEW_READY' }, { origin: 'https://attacker.example' })],
    ['다른 source', event({ type: 'PREVIEW_READY' }, { source: otherSource })],
    ['unknown type', event({ type: 'UNKNOWN' })],
    ['extra key', event({ type: 'PREVIEW_READY', extra: true })],
    [
      'invalid region type',
      event({ type: 'SELECT_REGION', regionId: 'id', regionType: 'unknown' }),
    ],
    ['blank region id', event({ type: 'SELECT_REGION', regionId: '', regionType: 'section' })],
  ])('%s preview message를 거부한다', (_label, messageEvent) => {
    expect(parsePreviewToEditorMessage(messageEvent, origin, expectedSource)).toBeNull()
  })

  it.each([
    ['다른 origin', event({ type: 'SET_PREVIEW_MODE', mode: 'select' }, { origin: 'null' })],
    ['다른 source', event({ type: 'SET_PREVIEW_MODE', mode: 'select' }, { source: otherSource })],
    ['unknown type', event({ type: 'UNKNOWN' })],
    ['extra key', event({ type: 'SET_PREVIEW_MODE', mode: 'select', extra: true })],
    ['invalid mode', event({ type: 'SET_PREVIEW_MODE', mode: 'edit' })],
    ['invalid draft', event({ type: 'RENDER_DRAFT', draft: {}, selectedRegionId: null })],
    [
      'blank selected region id',
      event({ type: 'RENDER_DRAFT', draft: createResumeFixture(), selectedRegionId: '' }),
    ],
  ])('%s editor message를 거부한다', (_label, messageEvent) => {
    expect(parseEditorToPreviewMessage(messageEvent, origin, expectedSource)).toBeNull()
  })
})
