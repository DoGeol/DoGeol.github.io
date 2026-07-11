import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { CodeTabs } from './code-tabs'

afterEach(cleanup)

describe('CodeTabs', () => {
  it('switches from preview to selectable code', async () => {
    render(
      <CodeTabs code="const demo = true" highlightedCode="<pre>const demo = true</pre>">
        <p>미리보기</p>
      </CodeTabs>,
    )
    expect(screen.getByText('미리보기')).toBeVisible()
    await userEvent.click(screen.getByRole('tab', { name: 'Code' }))
    expect(screen.getByText('const demo = true')).toBeVisible()
  })
})
