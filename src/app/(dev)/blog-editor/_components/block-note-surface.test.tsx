import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@blocknote/react', () => ({
  useCreateBlockNote: () => ({ document: [], replaceBlocks: vi.fn() }),
}))
vi.mock('@blocknote/ariakit', () => ({
  BlockNoteView: ({ editable }: { editable: boolean }) => (
    <div data-testid={editable ? 'editable-blocknote' : 'readonly-blocknote'} />
  ),
}))
vi.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light' }) }))

import { BlockNoteSurface } from './block-note-surface'

afterEach(cleanup)

describe('BlockNoteSurface', () => {
  it('편집과 읽기 전용 surface를 같은 컴포넌트 계약으로 렌더링한다', () => {
    const blocks = [
      { id: 'paragraph', type: 'paragraph' as const, props: {}, content: [], children: [] },
    ]
    const { rerender } = render(
      <BlockNoteSurface blocks={blocks} editable onChange={() => undefined} />,
    )
    expect(screen.getByTestId('editable-blocknote')).toBeVisible()

    rerender(<BlockNoteSurface blocks={blocks} editable={false} onChange={() => undefined} />)
    expect(screen.getByTestId('readonly-blocknote')).toBeVisible()
  })
})
