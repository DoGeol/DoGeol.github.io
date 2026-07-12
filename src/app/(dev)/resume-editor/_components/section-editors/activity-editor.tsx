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
export function ActivityEditor({ sectionIndex, selectedRegionId, onSelectedRegionChange }: Props) {
  const form = useFormContext<ResumeDraft>()
  const name = `sections.${sectionIndex}.data.items` as const
  const items = useResumeFieldArray(name)
  const section = form.getValues(`sections.${sectionIndex}`)
  if (section.type !== 'activity') return null
  return (
    <div data-item-list="activity" className="space-y-3">
      {items.fields.map((item, index) => {
        const base = `${name}.${index}` as const
        const value = section.data.items[index]!
        return (
          <ItemRegion
            key={item.formKey}
            id={String(item.id)}
            label={value.title || '새 활동'}
            selected={selectedRegionId === item.id}
          >
            <TextField name={`${base}.title`} label="활동명" />
            <TextField name={`${base}.startMonth`} label="시작월" type="month" />
            <NullableDateField name={`${base}.endMonth`} label="종료월" inputType="month" />
            <TextField name={`${base}.summary`} label="활동 요약" multiline />
            <button
              type="button"
              aria-label={`${value.title || '활동'} 삭제`}
              onClick={() => {
                if (!shouldDeleteItem(value, '활동을 삭제할까요?')) return
                items.remove(index)
                if (selectedRegionId === item.id) onSelectedRegionChange(section.id)
              }}
              className="rounded border px-3 py-2 text-sm"
            >
              활동 삭제
            </button>
          </ItemRegion>
        )
      })}
      <button
        type="button"
        onClick={() => {
          items.append(createDefaultItem('activity'))
          focusLastInput('activity')
        }}
        className="rounded border px-3 py-2 text-sm"
      >
        활동 추가
      </button>
    </div>
  )
}
