const trimHyphens = (value: string) => value.replace(/^-+|-+$/g, '')

export const createSuggestedSlug = (title: string) =>
  trimHyphens(
    title
      .normalize('NFKC')
      .toLocaleLowerCase('ko-KR')
      .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
      .replace(/-{2,}/g, '-'),
  )

export const updateSuggestedSlug = ({
  currentSlug,
  previousSuggestedSlug,
  nextTitle,
}: {
  currentSlug: string
  previousSuggestedSlug: string
  nextTitle: string
}) => {
  const suggestedSlug = createSuggestedSlug(nextTitle)
  return {
    slug: currentSlug === '' || currentSlug === previousSuggestedSlug ? suggestedSlug : currentSlug,
    suggestedSlug,
  }
}
