export const resolveSortableMove = (
  ids: string[],
  activeId: string,
  overId: string | null,
): { from: number; to: number } | null => {
  if (new Set(ids).size !== ids.length) throw new Error('Sortable ID가 중복되었습니다')
  if (overId === null || activeId === overId) return null
  const from = ids.indexOf(activeId)
  const to = ids.indexOf(overId)
  return from < 0 || to < 0 ? null : { from, to }
}
