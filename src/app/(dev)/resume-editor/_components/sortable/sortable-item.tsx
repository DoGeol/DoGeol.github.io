'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type SortableHandleContextValue = {
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners
  setActivatorNodeRef: (element: HTMLElement | null) => void
}

const SortableHandleContext = createContext<SortableHandleContextValue | null>(null)

export const useSortableHandle = () => {
  const value = useContext(SortableHandleContext)
  if (value === null) throw new Error('SortableHandle은 SortableItem 안에서 사용해야 합니다')
  return value
}

type SortableItemProps = {
  id: string
  children: ReactNode
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

  return (
    <SortableHandleContext.Provider value={{ attributes, listeners, setActivatorNodeRef }}>
      <div
        ref={setNodeRef}
        style={{
          opacity: isDragging ? 0.5 : undefined,
          transform: CSS.Transform.toString(transform),
          transition: reduceMotion ? undefined : transition,
        }}
      >
        {children}
      </div>
    </SortableHandleContext.Provider>
  )
}
