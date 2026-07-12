import { useFormContext } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { NullableDateField } from '@/app/(dev)/resume-editor/_components/fields/nullable-date-field'
import { TextField } from '@/app/(dev)/resume-editor/_components/fields/text-field'
import { createDefaultItem } from '@/app/(dev)/resume-editor/_model/default-items'

import {
  focusLastInput,
  ItemRegion,
  shouldDeleteItem,
  useResumeFieldArray,
} from '@/app/(dev)/resume-editor/_components/section-editors/section-editor-helpers'

type Props = {
  sectionIndex: number
  selectedRegionId: string | null
  onSelectedRegionChange: (id: string) => void
}
export function EducationEditor({ sectionIndex, selectedRegionId, onSelectedRegionChange }: Props) {
  const form = useFormContext<ResumeDraft>()
  const name = `sections.${sectionIndex}.data.items` as const
  const items = useResumeFieldArray(name)
  const section = form.getValues(`sections.${sectionIndex}`)
  if (section.type !== 'education') return null
  return (
    <div data-item-list="education" className="space-y-3">
      {items.fields.map((item, index) => {
        const base = `${name}.${index}` as const
        const value = section.data.items[index]!
        return (
          <ItemRegion
            key={item.formKey}
            id={String(item.id)}
            label={value.school || '새 학력'}
            selected={selectedRegionId === item.id}
          >
            <TextField name={`${base}.school`} label="학교명" />
            <TextField name={`${base}.startMonth`} label="입학월" type="month" />
            <NullableDateField name={`${base}.endMonth`} label="졸업월" inputType="month" />
            <label className="flex gap-2">
              <input type="checkbox" {...form.register(`${base}.graduated`)} />
              졸업
            </label>
            <TextField name={`${base}.major`} label="전공" />
            <TextField name={`${base}.summary`} label="학력 요약" multiline />
            <button
              type="button"
              aria-label={`${value.school || '학력'} 삭제`}
              onClick={() => {
                if (!shouldDeleteItem(value, '학력을 삭제할까요?')) return
                items.remove(index)
                if (selectedRegionId === item.id) onSelectedRegionChange(section.id)
              }}
              className="rounded border px-3 py-2 text-sm"
            >
              학력 삭제
            </button>
          </ItemRegion>
        )
      })}
      <button
        type="button"
        onClick={() => {
          items.append(createDefaultItem('education'))
          focusLastInput('education')
        }}
        className="rounded border px-3 py-2 text-sm"
      >
        학력 추가
      </button>
    </div>
  )
}
