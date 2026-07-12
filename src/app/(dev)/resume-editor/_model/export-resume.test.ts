import { afterEach, describe, expect, it, vi } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import { downloadResumeJson, serializeResumeForExport } from './export-resume'

describe('resume JSON export', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns issue paths for an invalid draft', () => {
    const draft = createResumeFixture()
    draft.metadata.title = ''

    const result = serializeResumeForExport(draft)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.map((issue) => issue.path)).toContainEqual(['metadata', 'title'])
    }
  })

  it('serializes a valid resume as deterministic pretty JSON with a final newline', () => {
    const draft = createResumeFixture()

    expect(serializeResumeForExport(draft)).toEqual({
      success: true,
      data: draft,
      json: `${JSON.stringify(draft, null, 2)}\n`,
    })
  })

  it('downloads the serialized resume with the fixed filename and cleans up browser resources', () => {
    const createObjectUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:resume')
    const revokeObjectUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const clickedAnchors: HTMLAnchorElement[] = []
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clickedAnchors.push(this)
    })

    downloadResumeJson('{"schemaVersion":1}\n', document)

    expect(createObjectUrl).toHaveBeenCalledOnce()
    const blob = createObjectUrl.mock.calls[0]?.[0]
    if (!(blob instanceof Blob)) throw new Error('JSON Blob이 생성되지 않았습니다')
    expect(blob.type).toBe('application/json;charset=utf-8')
    expect(click).toHaveBeenCalledOnce()
    const anchor = clickedAnchors[0]
    if (anchor === undefined) throw new Error('download anchor가 클릭되지 않았습니다')
    expect(anchor.download).toBe('resume.json')
    expect(anchor.href).toBe('blob:resume')
    expect(anchor.hidden).toBe(true)
    expect(anchor.isConnected).toBe(false)
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:resume')
  })
})
