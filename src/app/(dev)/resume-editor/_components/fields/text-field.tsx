import { useFormContext, type FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

import { FieldShell } from '@/app/(dev)/resume-editor/_components/fields/field-shell'

type TextFieldProps = {
  name: FieldPath<ResumeDraft>
  label: string
  help?: string
  multiline?: boolean
  type?: 'text' | 'url' | 'email' | 'tel' | 'date' | 'month'
  readOnly?: boolean
}

const fieldClassName =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100'

export function TextField({
  name,
  label,
  help,
  multiline = false,
  type = 'text',
  readOnly = false,
}: TextFieldProps) {
  const { register } = useFormContext<ResumeDraft>()

  return (
    <FieldShell name={name} label={label} help={help}>
      {({ inputId, describedBy, invalid }) => {
        const props = {
          ...register(name),
          id: inputId,
          'aria-describedby': describedBy,
          'aria-invalid': invalid,
          className: fieldClassName,
          readOnly,
        }
        return multiline ? <textarea {...props} rows={4} /> : <input {...props} type={type} />
      }}
    </FieldShell>
  )
}
