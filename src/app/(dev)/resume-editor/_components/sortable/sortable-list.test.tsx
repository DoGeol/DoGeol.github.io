import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SortableHandle } from '@/app/(dev)/resume-editor/_components/sortable/sortable-handle'
import { SortableItem } from '@/app/(dev)/resume-editor/_components/sortable/sortable-item'
import { SortableList } from '@/app/(dev)/resume-editor/_components/sortable/sortable-list'

const entries = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'bravo', label: 'Bravo' },
  { id: 'charlie', label: 'Charlie' },
]

const otherEntries = [
  { id: 'delta', label: 'Delta' },
  { id: 'echo', label: 'Echo' },
]

const renderHarness = (onMove = vi.fn()) => {
  render(
    <SortableList containerId="test-items" entries={entries} onMove={onMove}>
      {entries.map((entry) => (
        <SortableItem key={entry.id} id={entry.id}>
          <article aria-label={entry.label}>
            <SortableHandle label={entry.label} />
            <label>
              {entry.label} 값
              <input />
            </label>
            <button type="button">{entry.label} 삭제</button>
          </article>
        </SortableItem>
      ))}
    </SortableList>,
  )
  return onMove
}

const renderTwoLists = (firstMove = vi.fn(), secondMove = vi.fn()) => {
  render(
    <>
      <SortableList containerId="first-items" entries={entries} onMove={firstMove}>
        {entries.map((entry) => (
          <SortableItem key={entry.id} id={entry.id}>
            <article aria-label={entry.label}>
              <SortableHandle label={entry.label} />
            </article>
          </SortableItem>
        ))}
      </SortableList>
      <SortableList containerId="second-items" entries={otherEntries} onMove={secondMove}>
        {otherEntries.map((entry) => (
          <SortableItem key={entry.id} id={entry.id}>
            <article aria-label={entry.label}>
              <SortableHandle label={entry.label} />
            </article>
          </SortableItem>
        ))}
      </SortableList>
    </>,
  )
  return { firstMove, secondMove }
}

describe('accessible sortable primitives', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    )
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const article = this.matches('article') ? this : this.querySelector('article')
      const label = article?.getAttribute('aria-label')
      const index = entries.findIndex((entry) => entry.label === label)
      const otherIndex = otherEntries.findIndex((entry) => entry.label === label)
      return otherIndex >= 0
        ? new DOMRect(300, otherIndex * 50, 100, 40)
        : new DOMRect(0, Math.max(index, 0) * 50, 100, 40)
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('각 항목에 이름이 있는 handle만 제공한다', () => {
    renderHarness()

    for (const entry of entries) {
      expect(screen.getByRole('button', { name: `${entry.label} 순서 변경` })).toBeVisible()
    }
  })

  it('input이나 삭제 button pointer down은 drag를 시작하지 않는다', async () => {
    const user = userEvent.setup()
    renderHarness()

    await user.pointer({
      target: screen.getByRole('textbox', { name: 'Alpha 값' }),
      keys: '[MouseLeft>]',
    })
    await user.pointer({
      target: screen.getByRole('button', { name: 'Alpha 삭제' }),
      keys: '[MouseLeft>]',
    })

    expect(screen.queryByText(/항목을 들었습니다/)).not.toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Alpha' }).parentElement).not.toHaveStyle({
      opacity: '0.5',
    })
  })

  it('keyboard로 한 칸 이동하고 한국어 상태를 알린다', async () => {
    const user = userEvent.setup()
    const onMove = renderHarness()
    const handle = screen.getByRole('button', { name: 'Alpha 순서 변경' })
    handle.focus()

    await user.keyboard('[Space]')
    expect(
      await screen.findByText('Alpha 항목을 들었습니다. 현재 1번째 위치, 전체 3개입니다.'),
    ).toBeInTheDocument()
    await user.keyboard('[ArrowDown]')
    expect(
      await screen.findByText('2번째 위치로 이동했습니다. 전체 3개입니다.'),
    ).toBeInTheDocument()
    await user.keyboard('[Space]')

    expect(onMove).toHaveBeenCalledOnce()
    expect(onMove).toHaveBeenCalledWith(0, 1)
    expect(
      await screen.findByText('Alpha 항목을 2번째 위치에 놓았습니다. 전체 3개입니다.'),
    ).toBeInTheDocument()
  })

  it('Escape와 같은 위치 drop은 이동하지 않는다', async () => {
    const user = userEvent.setup()
    const onMove = renderHarness()
    const handle = screen.getByRole('button', { name: 'Alpha 순서 변경' })
    handle.focus()

    await user.keyboard('[Space][Escape]')
    expect(
      await screen.findByText(
        'Alpha 항목의 순서 변경을 취소했습니다. 현재 1번째 위치, 전체 3개입니다.',
      ),
    ).toBeInTheDocument()

    handle.focus()
    await user.keyboard('[Space][Space]')
    await waitFor(() => expect(onMove).not.toHaveBeenCalled())
  })

  it('활성화된 pointer를 list 밖에 놓으면 원래 위치를 알리고 이동하지 않는다', async () => {
    const user = userEvent.setup()
    const onMove = renderHarness()
    const handle = screen.getByRole('button', { name: 'Alpha 순서 변경' })

    await user.pointer({ target: handle, keys: '[MouseLeft>]', coords: { x: 10, y: 10 } })
    await user.pointer({ target: handle, coords: { x: 20, y: 10 } })
    await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'))
    expect(
      await screen.findByText('Alpha 항목을 들었습니다. 현재 1번째 위치, 전체 3개입니다.'),
    ).toBeInTheDocument()

    await user.pointer({ target: document.body, coords: { x: 500, y: 500 } })
    expect(
      await screen.findByText('Alpha 항목이 목록 밖에 있습니다. 현재 1번째 위치, 전체 3개입니다.'),
    ).toBeInTheDocument()
    await user.pointer({ target: document.body, keys: '[/MouseLeft]', coords: { x: 500, y: 500 } })

    expect(onMove).not.toHaveBeenCalled()
    expect(
      await screen.findByText(
        'Alpha 항목을 목록 밖에 놓아 이동하지 않았습니다. 현재 1번째 위치, 전체 3개입니다.',
      ),
    ).toBeInTheDocument()
  })

  it('활성화된 pointer를 다른 container에 놓아도 어느 list도 이동하지 않는다', async () => {
    const user = userEvent.setup()
    const { firstMove, secondMove } = renderTwoLists()
    const source = screen.getByRole('button', { name: 'Alpha 순서 변경' })
    const foreignTarget = screen.getByRole('button', { name: 'Delta 순서 변경' })

    await user.pointer({ target: source, keys: '[MouseLeft>]', coords: { x: 10, y: 10 } })
    await user.pointer({ target: source, coords: { x: 20, y: 10 } })
    await waitFor(() => expect(source).toHaveAttribute('aria-pressed', 'true'))
    await user.pointer({ target: foreignTarget, coords: { x: 310, y: 110 } })
    await user.pointer({ target: foreignTarget, keys: '[/MouseLeft]', coords: { x: 310, y: 110 } })

    await waitFor(() => expect(source).not.toHaveAttribute('aria-pressed', 'true'))
    expect(firstMove).not.toHaveBeenCalled()
    expect(secondMove).not.toHaveBeenCalled()
  })
})
