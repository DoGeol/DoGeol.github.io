import { get, useFormContext, type FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

export const getFieldDomId = (name: FieldPath<ResumeDraft>) => `field-${name.replaceAll('.', '-')}`

type FieldShellProps = {
  name: FieldPath<ResumeDraft>
  label: string
  help?: string
  children: (ids: {
    inputId: string
    describedBy: string | undefined
    invalid: boolean
  }) => React.ReactNode
}

export function FieldShell({ name, label, help, children }: FieldShellProps) {
  const { formState } = useFormContext<ResumeDraft>()
  const error = get(formState.errors, name) as { message?: unknown } | undefined
  const inputId = getFieldDomId(name)
  const helpId = help === undefined ? undefined : `${inputId}-help`
  const errorId = error?.message === undefined ? undefined : `${inputId}-error`
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-800 dark:text-neutral-200"
      >
        {label}
      </label>
      {children({ inputId, describedBy, invalid: errorId !== undefined })}
      {help !== undefined && (
        <p id={helpId} className="text-xs text-slate-500 dark:text-neutral-400">
          {help}
        </p>
      )}
      {errorId !== undefined && (
        <p id={errorId} className="text-sm text-red-700 dark:text-red-300">
          {String(error?.message)}
        </p>
      )}
    </div>
  )
}
