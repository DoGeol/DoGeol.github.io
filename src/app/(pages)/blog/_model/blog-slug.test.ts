import { describe, expect, it } from 'vitest'

import { createSuggestedSlug, updateSuggestedSlug } from './blog-slug'

describe('blog slug', () => {
  it('한글과 숫자를 유지하고 공백과 기호를 하이픈으로 정리한다', () => {
    expect(createSuggestedSlug('React 19와 Server Components!')).toBe(
      'react-19와-server-components',
    )
  })

  it('사용자가 slug를 직접 수정한 뒤에는 제목 변경으로 덮어쓰지 않는다', () => {
    expect(
      updateSuggestedSlug({
        currentSlug: '직접-정한-slug',
        previousSuggestedSlug: '처음-제목',
        nextTitle: '바뀐 제목',
      }),
    ).toEqual({ slug: '직접-정한-slug', suggestedSlug: '바뀐-제목' })
  })
})
