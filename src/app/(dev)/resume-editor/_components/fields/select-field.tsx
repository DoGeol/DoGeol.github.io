import { useFormContext, type FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

import {
  FieldShell,
  fieldControlClassName,
} from '@/app/(dev)/resume-editor/_components/fields/field-shell'

type SelectFieldProps = {
  name: FieldPath<ResumeDraft>
  label: string
  options: readonly { value: string; label: string }[]
  help?: string
}

export function SelectField({ name, label, options, help }: SelectFieldProps) {
  const { register } = useFormContext<ResumeDraft>()
  return (
    <FieldShell name={name} label={label} help={help}>
      {({ inputId, describedBy, invalid }) => (
        <select
          {...register(name)}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={fieldControlClassName}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  )
}
