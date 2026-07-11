import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CopyButton } from './copy-button'

afterEach(cleanup)

describe('CopyButton', () => {
  it('copies source and announces success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    render(<CopyButton code="const answer = 42" />)
    await userEvent.click(screen.getByRole('button', { name: '코드 복사' }))
    expect(writeText).toHaveBeenCalledWith('const answer = 42')
    expect(screen.getByRole('status')).toHaveTextContent('복사됨')
  })

  it('announces clipboard failures', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error()) } })
    render(<CopyButton code="source" />)
    await userEvent.click(screen.getByRole('button', { name: '코드 복사' }))
    expect(screen.getByRole('status')).toHaveTextContent('복사 실패')
  })
})
