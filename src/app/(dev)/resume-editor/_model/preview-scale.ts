export interface Size {
  width: number
  height: number
}

export const calculatePreviewScale = (available: Size, viewport: Size) => {
  const values = [available.width, available.height, viewport.width, viewport.height]
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new Error('프리뷰 크기는 0보다 큰 유한수여야 합니다')
  }
  return Math.min(1, available.width / viewport.width, available.height / viewport.height)
}
