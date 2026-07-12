import { useFormContext } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { SelectField } from '@/app/(dev)/resume-editor/_components/fields/select-field'
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

export function InformationEditor({
  sectionIndex,
  selectedRegionId,
  onSelectedRegionChange,
}: Props) {
  const form = useFormContext<ResumeDraft>()
  const base = `sections.${sectionIndex}.data` as const
  const contacts = useResumeFieldArray(`${base}.contacts`)
  const section = form.getValues(`sections.${sectionIndex}`)
  if (section.type !== 'information') return null
  return (
    <div className="space-y-4">
      <TextField name={`${base}.headline`} label="헤드라인" multiline />
      <div data-item-list="contacts" className="space-y-3">
        <SortableList
          containerId={`contacts-${section.id}`}
          entries={contacts.fields.map((contact, index) => ({
            id: String(contact.id),
            label: form.getValues(`${base}.contacts.${index}`).label || '새 연락처',
          }))}
          onMove={contacts.move}
        >
          {contacts.fields.map((contact, index) => {
            const value = form.getValues(`${base}.contacts.${index}`)
            return (
              <SortableItemRegion
                key={contact.formKey}
                id={String(contact.id)}
                label={value.label || '새 연락처'}
                selected={selectedRegionId === contact.id}
              >
                <SelectField
                  name={`${base}.contacts.${index}.type`}
                  label="연락처 유형"
                  options={[
                    { value: 'email', label: '이메일' },
                    { value: 'tel', label: '전화' },
                    { value: 'site', label: '웹사이트' },
                    { value: 'github', label: 'GitHub' },
                  ]}
                />
                <TextField name={`${base}.contacts.${index}.label`} label="연락처 라벨" />
                <TextField name={`${base}.contacts.${index}.value`} label="연락처 값" />
                <SelectField
                  name={`${base}.contacts.${index}.target`}
                  label="링크 열기"
                  options={[
                    { value: '_self', label: '현재 창' },
                    { value: '_blank', label: '새 창' },
                  ]}
                />
                <button
                  type="button"
                  aria-label={`${value.label || '연락처'} 삭제`}
                  onClick={() => {
                    if (!shouldDeleteItem(value, '연락처를 삭제할까요?')) return
                    contacts.remove(index)
                    if (selectedRegionId === contact.id) onSelectedRegionChange(section.id)
                  }}
                  className="rounded border px-3 py-2 text-sm"
                >
                  연락처 삭제
                </button>
              </SortableItemRegion>
            )
          })}
        </SortableList>
        <button
          type="button"
          onClick={() => {
            contacts.append(createDefaultItem('contact'))
            focusLastInput('contacts')
          }}
          className="rounded border px-3 py-2 text-sm"
        >
          연락처 추가
        </button>
      </div>
    </div>
  )
}
