import { useId } from 'react'
import { useFormContext, type FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

export interface SectionCardProps {
  regionId: string
  title: string
  expanded: boolean
  selected: boolean
  onExpandedChange: (expanded: boolean) => void
  visibleName: FieldPath<ResumeDraft>
  dragHandle: React.ReactNode
  children: React.ReactNode
}

export function SectionCard({
  regionId,
  title,
  expanded,
  selected,
  onExpandedChange,
  visibleName,
  dragHandle,
  children,
}: SectionCardProps) {
  const panelId = useId()
  return (
    <section
      data-editor-region-id={regionId}
      className={`rounded-lg border bg-white shadow-sm dark:bg-neutral-900 ${selected ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2 dark:border-blue-400 dark:ring-blue-400 dark:ring-offset-neutral-950' : 'border-slate-200 dark:border-neutral-700'}`}
    >
      <div className="flex items-center gap-3 p-4">
        {dragHandle}
        <h2 className="min-w-0 flex-1 text-lg font-semibold">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => onExpandedChange(!expanded)}
            className="w-full text-left"
          >
            {title}
          </button>
        </h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            role="switch"
            aria-label={`${title} 표시`}
            {...useVisibleField(visibleName)}
          />
          표시
        </label>
      </div>
      {expanded && (
        <div
          id={panelId}
          className="space-y-4 border-t border-slate-200 p-4 dark:border-neutral-700"
        >
          {children}
        </div>
      )}
    </section>
  )
}

const useVisibleField = (name: FieldPath<ResumeDraft>) => {
  const { register } = useFormContext<ResumeDraft>()
  return register(name)
}
