import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HighlightedText from '@/features/highlighted-text'

describe('HighlightedText', () => {
  it('별표 두 개로 감싼 텍스트를 strong으로 렌더링한다', () => {
    render(
      <p>
        <HighlightedText text="안녕하세요 **React** 개발자입니다." />
      </p>,
    )

    expect(screen.getByText('React').tagName).toBe('STRONG')
    expect(screen.getByText(/안녕하세요/).parentElement).toHaveTextContent(
      '안녕하세요 React 개발자입니다.',
    )
  })

  it('강조 표시가 없는 텍스트를 그대로 렌더링한다', () => {
    render(<HighlightedText text="일반 텍스트" />)

    expect(screen.getByText('일반 텍스트')).toBeInTheDocument()
  })

  it('newline과 강조를 함께 렌더링한다', () => {
    const { container } = render(<HighlightedText text={'안녕하세요.\n개발자 **테스트**입니다.'} />)

    expect(screen.getByText('테스트').tagName).toBe('STRONG')
    expect(container.querySelectorAll('br')).toHaveLength(1)
  })
})
