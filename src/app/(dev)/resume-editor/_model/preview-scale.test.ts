import { describe, expect, it } from 'vitest'

import { calculatePreviewScale } from './preview-scale'

describe('calculatePreviewScale', () => {
  it('stage 안에 viewport를 맞추되 확대하지 않는다', () => {
    expect(calculatePreviewScale({ width: 720, height: 700 }, { width: 1440, height: 1000 })).toBe(
      0.5,
    )
    expect(
      calculatePreviewScale({ width: 1600, height: 1200 }, { width: 1440, height: 1000 }),
    ).toBe(1)
  })

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    '0보다 큰 유한수가 아닌 %s를 거부한다',
    (invalid) => {
      expect(() =>
        calculatePreviewScale({ width: invalid, height: 100 }, { width: 100, height: 100 }),
      ).toThrow('프리뷰 크기는 0보다 큰 유한수여야 합니다')
    },
  )
})
