import { useRef } from 'react'
import { useController, useFormContext, type FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

import { FieldShell } from '@/app/(dev)/resume-editor/_components/fields/field-shell'

type NullableDateFieldProps = {
  name: FieldPath<ResumeDraft>
  label: string
  inputType: 'date' | 'month'
}

const todayValue = (type: 'date' | 'month') =>
  new Date().toISOString().slice(0, type === 'date' ? 10 : 7)

export function NullableDateField({ name, label, inputType }: NullableDateFieldProps) {
  const { control } = useFormContext<ResumeDraft>()
  const { field, fieldState } = useController({ control, name })
  const lastValue = useRef(
    typeof field.value === 'string' && field.value !== '' ? field.value : null,
  )
  const ongoing = field.value === null

  return (
    <FieldShell name={name} label={label}>
      {({ inputId, describedBy }) => (
        <div className="space-y-2">
          <input
            id={inputId}
            ref={field.ref}
            name={field.name}
            type={inputType}
            value={typeof field.value === 'string' ? field.value : ''}
            disabled={ongoing}
            aria-describedby={describedBy}
            aria-invalid={fieldState.invalid}
            onBlur={field.onBlur}
            onChange={(event) => {
              lastValue.current = event.target.value
              field.onChange(event.target.value)
            }}
            className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ongoing}
              onChange={(event) => {
                if (event.target.checked) {
                  if (typeof field.value === 'string' && field.value !== '')
                    lastValue.current = field.value
                  field.onChange(null)
                } else {
                  field.onChange(lastValue.current ?? todayValue(inputType))
                }
              }}
            />
            현재 진행 중
          </label>
        </div>
      )}
    </FieldShell>
  )
}
