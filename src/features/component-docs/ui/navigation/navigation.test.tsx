import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { DocsSidebar, MobileDocsNav } from './navigation'

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
})
