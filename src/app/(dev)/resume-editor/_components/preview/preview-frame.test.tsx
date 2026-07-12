import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import { PreviewFrame } from './preview-frame'

let resizeCallback: ResizeObserverCallback | null = null

class ResizeObserverMock implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallback = callback
  }
  disconnect() {}
  observe() {}
  unobserve() {}
}

const reportStageSize = (width: number, height: number) => {
  if (resizeCallback === null) throw new Error('ResizeObserver 미등록')
  resizeCallback(
    [{ contentRect: { width, height } } as unknown as ResizeObserverEntry],
    {} as ResizeObserver,
  )
}

const ready = (iframe: HTMLIFrameElement) => {
  if (iframe.contentWindow === null) throw new Error('iframe contentWindow 없음')
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { type: 'PREVIEW_READY' },
      origin: window.location.origin,
      source: iframe.contentWindow,
    }),
  )
}

describe('PreviewFrame', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  })

  afterEach(() => {
    cleanup()
    resizeCallback = null
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('정확한 iframe을 렌더링하고 READY 전에는 아무 message도 보내지 않는다', () => {
    render(
      <PreviewFrame
        draft={createResumeFixture()}
        selectedRegionId={null}
        onSelectedRegionChange={vi.fn()}
      />,
    )
    const iframe = screen.getByTitle<HTMLIFrameElement>('실제 이력서 프리뷰')
    if (iframe.contentWindow === null) throw new Error('iframe contentWindow 없음')
    const postMessage = vi.spyOn(iframe.contentWindow, 'postMessage')

    expect(iframe).toHaveAttribute('src', '/resume-preview')
    expect(iframe).toHaveAttribute('width', '1440')
    expect(iframe).toHaveAttribute('height', '1000')
    expect(postMessage).not.toHaveBeenCalled()
  })

  it('READY 후 bridge가 검증한 latest draft와 mode만 정확한 origin으로 보낸다', async () => {
    const draft = createResumeFixture()
    const { rerender } = render(
      <PreviewFrame draft={draft} selectedRegionId={null} onSelectedRegionChange={vi.fn()} />,
    )
    const iframe = screen.getByTitle<HTMLIFrameElement>('실제 이력서 프리뷰')
    if (iframe.contentWindow === null) throw new Error('iframe contentWindow 없음')
    const postMessage = vi.spyOn(iframe.contentWindow, 'postMessage')
    ready(iframe)

    await waitFor(() =>
      expect(postMessage).toHaveBeenCalledWith(
        { type: 'RENDER_DRAFT', draft, selectedRegionId: null },
        window.location.origin,
      ),
    )
    expect(postMessage).toHaveBeenCalledWith(
      { type: 'SET_PREVIEW_MODE', mode: 'select' },
      window.location.origin,
    )

    postMessage.mockClear()
    const updated = {
      ...draft,
      metadata: { ...draft.metadata, title: '브리지에서 검증한 제목' },
    }
    rerender(
      <PreviewFrame draft={updated} selectedRegionId={null} onSelectedRegionChange={vi.fn()} />,
    )
    await waitFor(() =>
      expect(postMessage).toHaveBeenCalledWith(
        { type: 'RENDER_DRAFT', draft: updated, selectedRegionId: null },
        window.location.origin,
      ),
    )
  })

  it('exact iframe source의 SELECT_REGION만 callback한다', () => {
    const onSelectedRegionChange = vi.fn()
    render(
      <PreviewFrame
        draft={createResumeFixture()}
        selectedRegionId={null}
        onSelectedRegionChange={onSelectedRegionChange}
      />,
    )
    const iframe = screen.getByTitle<HTMLIFrameElement>('실제 이력서 프리뷰')
    if (iframe.contentWindow === null) throw new Error('iframe contentWindow 없음')
    const message = { type: 'SELECT_REGION', regionId: 'experience-1', regionType: 'experience' }
    window.dispatchEvent(
      new MessageEvent('message', {
        data: message,
        origin: window.location.origin,
        source: window,
      }),
    )
    window.dispatchEvent(
      new MessageEvent('message', {
        data: message,
        origin: window.location.origin,
        source: iframe.contentWindow,
      }),
    )

    expect(onSelectedRegionChange).toHaveBeenCalledTimes(1)
    expect(onSelectedRegionChange).toHaveBeenCalledWith('experience-1')
  })

  it('세 preset이 실제 iframe dimensions와 stage scale을 바꾼다', async () => {
    render(
      <PreviewFrame
        draft={createResumeFixture()}
        selectedRegionId={null}
        onSelectedRegionChange={vi.fn()}
      />,
    )
    act(() => reportStageSize(720, 700))
    const iframe = screen.getByTitle<HTMLIFrameElement>('실제 이력서 프리뷰')
    expect(iframe.style.transform).toBe('scale(0.5)')

    fireEvent.click(screen.getByRole('radio', { name: '태블릿 768×1024' }))
    expect(iframe).toHaveAttribute('width', '768')
    expect(iframe).toHaveAttribute('height', '1024')
    expect(iframe.style.transform).toBe('scale(0.68359375)')

    fireEvent.click(screen.getByRole('radio', { name: '모바일 390×844' }))
    expect(iframe).toHaveAttribute('width', '390')
    expect(iframe).toHaveAttribute('height', '844')
    expect(iframe.style.transform).toBe('scale(0.8293838862559242)')
  })

  it('3초 handshake timeout과 iframe key를 바꾸는 retry를 제공한다', () => {
    vi.useFakeTimers()
    render(
      <PreviewFrame
        draft={createResumeFixture()}
        selectedRegionId={null}
        onSelectedRegionChange={vi.fn()}
      />,
    )
    const firstFrame = screen.getByTitle('실제 이력서 프리뷰')

    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByRole('alert')).toHaveTextContent('프리뷰에 연결하지 못했습니다')
    fireEvent.click(screen.getByRole('button', { name: '다시 연결' }))

    const secondFrame = screen.getByTitle('실제 이력서 프리뷰')
    expect(secondFrame).not.toBe(firstFrame)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByRole('alert')).toBeVisible()
  })

  it('READY handshake가 완료되면 timeout을 취소한다', () => {
    vi.useFakeTimers()
    render(
      <PreviewFrame
        draft={createResumeFixture()}
        selectedRegionId={null}
        onSelectedRegionChange={vi.fn()}
      />,
    )
    ready(screen.getByTitle<HTMLIFrameElement>('실제 이력서 프리뷰'))

    act(() => vi.advanceTimersByTime(3000))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
