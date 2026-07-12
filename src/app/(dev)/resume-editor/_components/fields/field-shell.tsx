import { get, useFormContext, useFormState, type FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

export const getFieldDomId = (name: FieldPath<ResumeDraft>) => `field-${name.replaceAll('.', '-')}`

export const fieldControlClassName =
  'w-full rounded-md border border-slate-500 bg-white px-3 py-2 text-slate-950 aria-invalid:border-red-700 dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-100 dark:aria-invalid:border-red-400'

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
  const { control } = useFormContext<ResumeDraft>()
  const { errors } = useFormState({ control, name, exact: true })
  const error = get(errors, name) as { message?: unknown } | undefined
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
