import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { DocsSidebar, MobileDocsNav } from './navigation'

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
})

describe('component docs navigation', () => {
  it('groups links and marks the current component', () => {
    render(<DocsSidebar currentSlug="accordion" />)
    expect(screen.getByText('Disclosure')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Accordion' })).toHaveAttribute('aria-current', 'page')
  })

  it('opens and closes the mobile dialog with Escape', async () => {
    const user = userEvent.setup()
    render(<MobileDocsNav currentSlug="input" />)
    const menu = screen.getByRole('button', { name: '메뉴 열기' })
    await user.click(menu)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(menu).toHaveFocus()
  })

  it('renders the mobile dialog at the document root', async () => {
    const user = userEvent.setup()
    render(<MobileDocsNav currentSlug="accordion" />)

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }))

    expect(screen.getByRole('dialog').parentElement).toBe(document.body)
  })

  it('locks body scrolling while the mobile dialog is open', async () => {
    const user = userEvent.setup()
    render(<MobileDocsNav currentSlug="input" />)

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }))
    expect(document.body).toHaveStyle({ overflow: 'hidden' })

    await user.click(screen.getByRole('button', { name: '메뉴 닫기' }))
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' })
  })
})
