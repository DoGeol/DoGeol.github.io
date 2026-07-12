import { useFieldArray, useFormContext, type FieldArrayPath, type FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { createDefaultItem } from '@/app/(dev)/resume-editor/_model/default-items'

import { TextField } from '@/app/(dev)/resume-editor/_components/fields/text-field'

type RepeatableTextFieldProps = {
  name: FieldPath<ResumeDraft>
  label: string
  addLabel: string
  selectedRegionId?: string | null
  owningSectionId?: string
  onSelectedRegionChange?: (regionId: string) => void
}

const hasContent = (value: unknown) =>
  typeof value === 'object' && value !== null && 'text' in value && String(value.text).trim() !== ''

export function RepeatableTextField({
  name,
  label,
  addLabel,
  selectedRegionId,
  owningSectionId,
  onSelectedRegionChange,
}: RepeatableTextFieldProps) {
  const { control, getValues } = useFormContext<ResumeDraft>()
  const fieldArray = useFieldArray({
    control,
    name: name as FieldArrayPath<ResumeDraft>,
    keyName: 'formKey',
  })

  const add = () => {
    fieldArray.append(createDefaultItem('text'))
    window.requestAnimationFrame(() => {
      const inputs = document.querySelectorAll<HTMLElement>(
        `[data-repeatable-name="${name}"] input:not([readonly]), [data-repeatable-name="${name}"] textarea, [data-repeatable-name="${name}"] select`,
      )
      inputs.item(inputs.length - 1)?.focus()
    })
  }

  return (
    <fieldset data-repeatable-name={name} className="space-y-3">
      <legend className="text-sm font-semibold">{label}</legend>
      {fieldArray.fields.map((field, index) => (
        <div
          key={field.formKey}
          data-editor-region-id={String(field.id)}
          className="flex items-end gap-2"
        >
          <div className="min-w-0 flex-1">
            <TextField
              name={`${name}.${index}.text` as FieldPath<ResumeDraft>}
              label={label}
              multiline
            />
          </div>
          <button
            type="button"
            aria-label={`${label} 삭제`}
            onClick={() => {
              const value = getValues(`${name}.${index}` as FieldPath<ResumeDraft>)
              if (hasContent(value) && !window.confirm(`${label}을 삭제할까요?`)) return
              fieldArray.remove(index)
              if (
                selectedRegionId === field.id &&
                owningSectionId !== undefined &&
                onSelectedRegionChange !== undefined
              ) {
                onSelectedRegionChange(owningSectionId)
              }
            }}
            className="rounded border px-3 py-2 text-sm"
          >
            삭제
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="rounded border px-3 py-2 text-sm">
        {addLabel}
      </button>
    </fieldset>
  )
}
