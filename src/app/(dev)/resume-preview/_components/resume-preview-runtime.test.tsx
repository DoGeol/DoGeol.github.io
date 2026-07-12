import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import { ResumePreviewRuntime } from './resume-preview-runtime'
import { createSelectableRegionRenderer } from './selectable-region-renderer'

const sendFromParent = (data: unknown, overrides: Partial<MessageEventInit> = {}) => {
  window.dispatchEvent(
    new MessageEvent('message', {
      data,
      origin: window.location.origin,
      source: window.parent,
      ...overrides,
    }),
  )
}

describe('ResumePreviewRuntime', () => {
  const postMessage = vi.spyOn(window, 'postMessage')

  beforeEach(() => {
    postMessage.mockClear()
    document.title = ''
  })

  afterEach(cleanup)

  it('mount하면 parent에 정확한 origin으로 READY를 보낸다', () => {
    render(<ResumePreviewRuntime initialResume={createResumeFixture()} />)

    expect(postMessage).toHaveBeenCalledWith({ type: 'PREVIEW_READY' }, window.location.origin)
  })

  it('valid draft를 받고 title과 회사명을 갱신한다', async () => {
    render(<ResumePreviewRuntime initialResume={createResumeFixture()} />)
    const nextDraft = createResumeFixture()
    nextDraft.metadata.title = '새 이력서 제목'
    const experience = nextDraft.sections.find((section) => section.type === 'experience')
    if (experience === undefined || experience.type !== 'experience')
      throw new Error('fixture 오류')
    experience.data.items[0].companyName = '새 회사'

    sendFromParent({ type: 'RENDER_DRAFT', draft: nextDraft, selectedRegionId: null })

    await waitFor(() => expect(document.title).toBe('새 이력서 제목'))
    expect(screen.getByText('새 회사')).toBeVisible()
  })

  it('select mode에서 click과 Enter로 arbitrary stable region을 선택한다', () => {
    const draft = createResumeFixture()
    const experience = draft.sections.find((section) => section.type === 'experience')
    if (experience === undefined || experience.type !== 'experience')
      throw new Error('fixture 오류')
    experience.data.items[0].id = 'arbitrary:id/1'
    render(<ResumePreviewRuntime initialResume={draft} />)
    postMessage.mockClear()

    const region = document.querySelector<HTMLElement>('[data-preview-region-id="arbitrary:id/1"]')
    if (region === null) throw new Error('region 미렌더링')
    fireEvent.click(region)
    fireEvent.keyDown(region, { key: 'Enter' })

    expect(postMessage).toHaveBeenNthCalledWith(
      1,
      { type: 'SELECT_REGION', regionId: 'arbitrary:id/1', regionType: 'experience' },
      window.location.origin,
    )
    expect(postMessage).toHaveBeenNthCalledWith(
      2,
      { type: 'SELECT_REGION', regionId: 'arbitrary:id/1', regionType: 'experience' },
      window.location.origin,
    )
  })

  it('nested click은 가장 구체적인 region만 선택한다', () => {
    render(<ResumePreviewRuntime initialResume={createResumeFixture()} />)
    postMessage.mockClear()

    const detail = document.querySelector<HTMLElement>(
      '[data-preview-region-id="project-detail-1"]',
    )
    if (detail === null) throw new Error('detail 미렌더링')
    fireEvent.click(detail)

    expect(postMessage).toHaveBeenCalledTimes(1)
    expect(postMessage).toHaveBeenCalledWith(
      { type: 'SELECT_REGION', regionId: 'project-detail-1', regionType: 'text' },
      window.location.origin,
    )
  })

  it('host의 기존 className과 click/key handler를 보존해 merge한다', () => {
    const originalClick = vi.fn()
    const originalKeyDown = vi.fn()
    const send = vi.fn()
    const renderer = createSelectableRegionRenderer({ selectedRegionId: 'custom-id', send })
    render(
      renderer({
        id: 'custom-id',
        type: 'section',
        label: '사용자 영역',
        children: (
          <article className="original-class" onClick={originalClick} onKeyDown={originalKeyDown} />
        ),
      }),
    )
    const region = screen.getByLabelText('사용자 영역 편집')

    fireEvent.click(region)
    fireEvent.keyDown(region, { key: 'Escape' })

    expect(region).toHaveClass('original-class', 'outline-primary-500')
    expect(originalClick).toHaveBeenCalledOnce()
    expect(originalKeyDown).toHaveBeenCalledOnce()
    expect(send).toHaveBeenCalledOnce()
  })

  it('actual mode는 editor attribute, interactive tabindex와 outline class를 만들지 않는다', async () => {
    render(<ResumePreviewRuntime initialResume={createResumeFixture()} />)
    sendFromParent({ type: 'SET_PREVIEW_MODE', mode: 'actual' })

    await waitFor(() => expect(document.querySelector('[data-preview-region-id]')).toBeNull())
    expect(document.querySelector('[data-preview-region-type]')).toBeNull()
    expect(document.querySelector('[data-preview-selected]')).toBeNull()
    expect(document.querySelector('[tabindex="0"]')).toBeNull()
    expect(document.querySelector('[class*="outline"]')).toBeNull()
  })

  it.each([
    ['origin', { origin: 'https://attacker.example' }],
    ['source', { source: { postMessage() {} } as unknown as WindowProxy }],
    ['message', {}],
  ])('invalid %s는 draft와 selection을 바꾸지 않는다', (_label, overrides) => {
    render(<ResumePreviewRuntime initialResume={createResumeFixture()} />)
    postMessage.mockClear()
    const nextDraft = createResumeFixture()
    const experience = nextDraft.sections.find((section) => section.type === 'experience')
    if (experience === undefined || experience.type !== 'experience')
      throw new Error('fixture 오류')
    experience.data.items[0].companyName = '공격자 회사'

    sendFromParent(
      { type: 'RENDER_DRAFT', draft: nextDraft, selectedRegionId: 'experience-1' },
      overrides,
    )

    expect(screen.queryByText('공격자 회사')).not.toBeInTheDocument()
    expect(document.querySelector('[data-preview-selected="true"]')).toBeNull()
  })
})
