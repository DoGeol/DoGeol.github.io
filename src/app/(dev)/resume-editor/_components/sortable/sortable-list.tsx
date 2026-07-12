'use client'

import { useMemo, useState, type ReactNode } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  type ScreenReaderInstructions,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { resolveSortableMove } from '@/app/(dev)/resume-editor/_model/sortable-move'

export interface SortableEntry {
  id: string
  label: string
}

interface SortableListProps {
  containerId: string
  entries: SortableEntry[]
  onMove: (from: number, to: number) => void
  children: ReactNode
}

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    '순서를 변경하려면 스페이스 키를 누르세요. 방향키로 이동하고, 스페이스 키로 놓거나 Escape 키로 취소하세요.',
}

const sortableCollisionDetection: CollisionDetection = (args) =>
  args.pointerCoordinates === null ? closestCenter(args) : pointerWithin(args)

export function SortableList({ containerId, entries, onMove, children }: SortableListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const ids = entries.map(({ id }) => id)
  const labels = useMemo(() => new Map(entries.map(({ id, label }) => [id, label])), [entries])
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const getLabel = (id: string | number) => labels.get(String(id)) ?? String(id)
  const getPosition = (id: string | number) => ids.indexOf(String(id)) + 1
  const describePosition = (id: string | number) =>
    `현재 ${getPosition(id)}번째 위치, 전체 ${ids.length}개입니다.`
  const announcements: Announcements = {
    onDragStart({ active }) {
      return `${getLabel(active.id)} 항목을 들었습니다. ${describePosition(active.id)}`
    },
    onDragMove({ active, over }) {
      if (over === null)
        return `${getLabel(active.id)} 항목이 목록 밖에 있습니다. ${describePosition(active.id)}`
      if (over.id === active.id) return undefined
      return `${getPosition(over.id)}번째 위치로 이동했습니다. 전체 ${ids.length}개입니다.`
    },
    onDragOver({ active, over }) {
      if (over === null)
        return `${getLabel(active.id)} 항목이 목록 밖에 있습니다. ${describePosition(active.id)}`
      if (over.id === active.id) return undefined
      return `${getPosition(over.id)}번째 위치로 이동했습니다. 전체 ${ids.length}개입니다.`
    },
    onDragEnd({ active, over }) {
      if (over === null)
        return `${getLabel(active.id)} 항목을 목록 밖에 놓아 이동하지 않았습니다. ${describePosition(active.id)}`
      return `${getLabel(active.id)} 항목을 ${getPosition(over.id)}번째 위치에 놓았습니다. 전체 ${ids.length}개입니다.`
    },
    onDragCancel({ active }) {
      return `${getLabel(active.id)} 항목의 순서 변경을 취소했습니다. ${describePosition(active.id)}`
    },
  }

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id))
  const handleDragCancel = () => setActiveId(null)
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    const move = resolveSortableMove(ids, String(active.id), over === null ? null : String(over.id))
    if (move !== null) onMove(move.from, move.to)
  }

  return (
    <DndContext
      id={containerId}
      accessibility={{ announcements, screenReaderInstructions }}
      collisionDetection={sortableCollisionDetection}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <SortableContext id={containerId} items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay dropAnimation={null}>
        {activeId === null ? null : (
          <div
            aria-hidden="true"
            className="pointer-events-none rounded border border-blue-400 bg-white px-3 py-2 text-sm shadow-lg dark:bg-neutral-900"
          >
            {labels.get(activeId)}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
