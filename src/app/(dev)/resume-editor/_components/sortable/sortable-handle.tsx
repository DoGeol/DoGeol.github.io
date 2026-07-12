'use client'

import { useSortableHandle } from '@/app/(dev)/resume-editor/_components/sortable/sortable-item'

type SortableHandleProps = {
  label: string
}

export function SortableHandle({ label }: SortableHandleProps) {
  const { attributes, listeners, setActivatorNodeRef } = useSortableHandle()

  return (
    <button
      ref={setActivatorNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      aria-label={`${label} 순서 변경`}
      className="cursor-grab touch-none rounded border border-slate-300 px-2 py-1 text-sm active:cursor-grabbing dark:border-neutral-600"
    >
      <span aria-hidden="true">↕</span>
    </button>
  )
}
