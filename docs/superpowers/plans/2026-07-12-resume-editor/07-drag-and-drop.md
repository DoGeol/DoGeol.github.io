# Task 7: accessible Drag & Drop

**Parent plan:** [Resume Editor Implementation Plan](../2026-07-12-resume-editor.md)

**Deliverable:** 섹션과 모든 object 반복 항목을 pointer, touch와 keyboard로 같은 배열 안에서만 안전하게 재정렬한다.

**Files:**

- Create: `src/app/(dev)/resume-editor/_components/sortable/sortable-list.tsx`
- Create: `src/app/(dev)/resume-editor/_components/sortable/sortable-item.tsx`
- Create: `src/app/(dev)/resume-editor/_components/sortable/sortable-handle.tsx`
- Create: `src/app/(dev)/resume-editor/_components/sortable/sortable-list.test.tsx`
- Create: `src/app/(dev)/resume-editor/_model/sortable-move.ts`
- Create: `src/app/(dev)/resume-editor/_model/sortable-move.test.ts`
- Modify: `src/app/(dev)/resume-editor/_components/document-settings-editor.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/section-editors/*.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/resume-editor.test.tsx`

**Interfaces:**

- Consumes: stable JSON IDs and each caller's `useFieldArray().move`
- Produces: `SortableList`, `SortableItem`, `SortableHandle`
- Produces: `resolveSortableMove(ids, activeId, overId)` pure boundary
- Constraint: no cross-container move, no drag activation from input/body, no direct array mutation.

- [ ] **Step 1: 실패하는 move resolver test를 작성한다**

```ts
expect(resolveSortableMove(['a', 'b', 'c'], 'a', 'c')).toEqual({ from: 0, to: 2 })
expect(resolveSortableMove(['a', 'b'], 'a', 'a')).toBeNull()
expect(resolveSortableMove(['a', 'b'], 'missing', 'b')).toBeNull()
expect(resolveSortableMove(['a', 'b'], 'a', null)).toBeNull()
```

Duplicate ID input은 schema invariant 위반을 조기에 알리도록 명시적 오류를 낸다.

Run: `pnpm vitest run 'src/app/(dev)/resume-editor/_model/sortable-move.test.ts'`

Expected: FAIL because the helper does not exist.

- [ ] **Step 2: move resolver를 구현하고 test를 통과시킨다**

```ts
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
```

Run: `pnpm vitest run 'src/app/(dev)/resume-editor/_model/sortable-move.test.ts'`

Expected: PASS.

- [ ] **Step 3: 실패하는 accessible sortable primitive test를 작성한다**

세 항목 harness와 `onMove` spy로 다음을 검증한다.

- 각 handle의 accessible name은 `{label} 순서 변경`이다.
- input에서 pointer down해도 drag start style/live text가 생기지 않는다.
- 첫 handle에 focus하고 `Space`, `ArrowDown`, `Space`를 누르면 `onMove(0, 1)`이 한 번 호출된다.
- `Escape`, same-position drop와 list 밖 drop은 `onMove`를 호출하지 않는다.
- live region은 `항목을 들었습니다`, `2번째 위치로 이동했습니다`, `놓았습니다`를 한국어로 알린다.

Run: `pnpm vitest run 'src/app/(dev)/resume-editor/_components/sortable/sortable-list.test.tsx'`

Expected: FAIL because sortable components do not exist.

- [ ] **Step 4: dnd-kit primitive를 구현한다**

`SortableList`의 public contract는 form library에 의존하지 않는다.

```ts
interface SortableEntry {
  id: string
  label: string
}

interface SortableListProps {
  containerId: string
  entries: SortableEntry[]
  onMove: (from: number, to: number) => void
  children: ReactNode
}
```

구현 세부사항:

- `DndContext`, `closestCenter`, `DragOverlay`를 list별로 둔다.
- sensors는 `PointerSensor({ activationConstraint: { distance: 8 } })`, `TouchSensor({ delay: 200, tolerance: 5 })`, `KeyboardSensor({ coordinateGetter: sortableKeyboardCoordinates })`다.
- `SortableContext` items는 JSON stable ID 배열이고 strategy는 `verticalListSortingStrategy`다.
- end event는 `resolveSortableMove`가 값을 반환할 때만 caller의 `onMove`를 호출한다.
- `SortableItem`은 `useSortable({ id })`, `CSS.Transform.toString(transform)`을 사용한다.
- listeners/attributes는 `SortableHandle` button에만 전달하고 item wrapper나 form input에는 전달하지 않는다.
- `window.matchMedia('(prefers-reduced-motion: reduce)')`가 true면 transition을 제거한다.
- active entry label로 lightweight `DragOverlay`를 렌더링하고 overlay는 interactive element를 복제하지 않는다.

`DndContext`의 `accessibility` prop에 한국어 `screenReaderInstructions`와 start/move/over/end/cancel announcement를 넣는다. 위치는 1부터 시작하고 전체 개수도 말한다.

- [ ] **Step 5: section 정렬 integration test를 작성한다**

Editor harness에서 section handle `Experience 순서 변경`을 keyboard로 한 칸 위로 옮긴 뒤 다음을 검증한다.

```ts
expect(getDraft().sections.map(({ type }) => type)).toEqual([
  'information',
  'experience',
  'introduce',
  'projects',
  'education',
  'activity',
  'licenses',
])
expect(getSelectedRegionId()).toBe('section-experience')
expect(buildEditorRegionIndex(getDraft()).get('section-experience')).toBe('sections.1')
```

Table-driven harness에 paragraph, summary, company, history work/skill reference, project/work/detail와 catalog skill 두 항목 fixture를 넣어 각 배열이 독립적으로 이동하는지 검증한다. 다른 list의 `overId`는 null이어야 한다.

- [ ] **Step 6: 모든 object field array에 sortable을 연결한다**

각 caller가 이미 보유한 `useFieldArray`의 `fields`와 `move`를 아래처럼 전달한다.

```tsx
<SortableList
  containerId="resume-sections"
  entries={fields.map((field) => ({ id: field.id, label: getResumeSectionLabel(field.type) }))}
  onMove={move}
>
  {fields.map((field, index) => (
    <SortableItem key={field.formKey} id={field.id}>
      <SectionCard index={index} dragHandle={<SortableHandle label={label} />} />
    </SortableItem>
  ))}
</SortableList>
```

`skillCatalog`, contacts, paragraphs, summary text, experience items, histories, history work/skill reference, projects, project works/details, education, activity와 licenses를 각각 독립 `SortableList`로 감싼다. 각 `containerId`는 부모 stable ID를 포함해 unique하게 만들고 label은 section명, 대표 text 또는 field label을 사용한다.

`move()` 뒤 선택은 stable `selectedRegionId`를 유지하고, `buildEditorRegionIndex`는 최신 draft로 새 path를 계산한다. section 순서는 출력 순서이므로 별도 order field를 만들지 않는다.

- [ ] **Step 7: DnD 회귀와 접근성을 검증한다**

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_model/sortable-move.test.ts' 'src/app/(dev)/resume-editor/_components/sortable/sortable-list.test.tsx'
pnpm vitest run 'src/app/(dev)/resume-editor/_components'
pnpm typecheck
pnpm lint
```

Expected: pointer/keyboard-independent pure tests와 keyboard component tests PASS. input typing, accordion toggle와 delete button click이 drag를 시작하지 않는다.

- [ ] **Step 8: Task 7을 커밋한다**

```bash
git add src/app/\(dev\)/resume-editor
git commit -m "feat(resume): 접근 가능한 항목 순서 변경 추가"
```
