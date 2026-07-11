import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AccordionItem, AccordionRoot, AccordionTitle } from '@/shared/ui/Accordion'

describe('AccordionRoot', () => {
  it('초기 값과 toggle 이후 값을 onChange에 전달한다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <AccordionRoot values={[]} onChange={onChange}>
        <AccordionItem value="profile">
          <AccordionTitle>프로필</AccordionTitle>
        </AccordionItem>
      </AccordionRoot>,
    )

    expect(onChange).toHaveBeenLastCalledWith([])

    await user.click(screen.getByText('프로필'))

    expect(onChange).toHaveBeenLastCalledWith(['profile'])
  })

  it('multiple이 false이면 마지막으로 선택한 값만 유지한다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <AccordionRoot values={[]} multiple={false} onChange={onChange}>
        <AccordionItem value="first">
          <AccordionTitle>첫 번째</AccordionTitle>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionTitle>두 번째</AccordionTitle>
        </AccordionItem>
      </AccordionRoot>,
    )

    await user.click(screen.getByText('첫 번째'))
    await user.click(screen.getByText('두 번째'))

    expect(onChange).toHaveBeenLastCalledWith(['second'])
  })
})
