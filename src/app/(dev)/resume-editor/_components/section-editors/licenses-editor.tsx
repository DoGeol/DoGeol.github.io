import { useFormContext, useWatch } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { TextField } from '@/app/(dev)/resume-editor/_components/fields/text-field'
import { createDefaultItem } from '@/app/(dev)/resume-editor/_model/default-items'

import {
  focusLastInput,
  SortableItemRegion,
  shouldDeleteItem,
  useResumeFieldArray,
} from '@/app/(dev)/resume-editor/_components/section-editors/section-editor-helpers'
import { SortableList } from '@/app/(dev)/resume-editor/_components/sortable/sortable-list'

type Props = {
  sectionIndex: number
  selectedRegionId: string | null
  onSelectedRegionChange: (id: string) => void
}
export function LicensesEditor({ sectionIndex, selectedRegionId, onSelectedRegionChange }: Props) {
  const form = useFormContext<ResumeDraft>()
  const name = `sections.${sectionIndex}.data.items` as const
  const items = useResumeFieldArray(name)
  const section = useWatch({ control: form.control, name: `sections.${sectionIndex}` })
  if (section.type !== 'licenses') return null
  return (
    <div data-item-list="licenses" className="space-y-3">
      <SortableList
        containerId={`licenses-${section.id}`}
        entries={items.fields.map((item, index) => ({
          id: String(item.id),
          label: section.data.items[index]?.title || '새 자격증',
        }))}
        onMove={items.move}
      >
        {items.fields.map((item, index) => {
          const base = `${name}.${index}` as const
          const value = section.data.items[index]
          if (value === undefined) return null
          return (
            <SortableItemRegion
              key={item.formKey}
              id={String(item.id)}
              label={value.title || '새 자격증'}
              selected={selectedRegionId === item.id}
            >
              <TextField name={`${base}.title`} label="자격증명" />
              <TextField name={`${base}.acquiredAt`} label="취득일" type="date" />
              <TextField name={`${base}.issuer`} label="발급 기관" />
              <button
                type="button"
                aria-label={`${value.title || '자격증'} 삭제`}
                onClick={() => {
                  if (!shouldDeleteItem(value, '자격증을 삭제할까요?')) return
                  items.remove(index)
                  if (selectedRegionId === item.id) onSelectedRegionChange(section.id)
                }}
                className="rounded border px-3 py-2 text-sm"
              >
                자격증 삭제
              </button>
            </SortableItemRegion>
          )
        })}
      </SortableList>
      <button
        type="button"
        onClick={() => {
          items.append(createDefaultItem('license'))
          focusLastInput('licenses')
        }}
        className="rounded border px-3 py-2 text-sm"
      >
        자격증 추가
      </button>
    </div>
  )
}
