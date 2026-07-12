import { describe, expect, it } from 'vitest'

import { resolveSortableMove } from '@/app/(dev)/resume-editor/_model/sortable-move'

describe('resolveSortableMove', () => {
  it('stable ID로 이동 전후 index를 찾는다', () => {
    expect(resolveSortableMove(['a', 'b', 'c'], 'a', 'c')).toEqual({ from: 0, to: 2 })
  })

  it.each([
    ['같은 위치', ['a', 'b'], 'a', 'a'],
    ['active ID 누락', ['a', 'b'], 'missing', 'b'],
    ['over ID 누락', ['a', 'b'], 'a', 'missing'],
    ['list 밖 drop', ['a', 'b'], 'a', null],
  ] as const)('%s이면 이동하지 않는다', (_label, ids, activeId, overId) => {
    expect(resolveSortableMove([...ids], activeId, overId)).toBeNull()
  })

  it('중복 ID는 schema invariant 오류를 낸다', () => {
    expect(() => resolveSortableMove(['a', 'a'], 'a', 'a')).toThrow('Sortable ID가 중복되었습니다')
  })
})
