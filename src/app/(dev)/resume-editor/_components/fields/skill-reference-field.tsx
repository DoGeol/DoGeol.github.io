import { useFieldArray, useFormContext, useWatch, type FieldArrayPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { createSkillReference } from '@/app/(dev)/resume-editor/_model/default-items'
import { SortableHandle } from '@/app/(dev)/resume-editor/_components/sortable/sortable-handle'
import { SortableItem } from '@/app/(dev)/resume-editor/_components/sortable/sortable-item'
import { SortableList } from '@/app/(dev)/resume-editor/_components/sortable/sortable-list'

type SkillReferenceFieldProps = {
  name: FieldArrayPath<ResumeDraft>
  label?: string
  selectedRegionId?: string | null
  owningSectionId?: string
  onSelectedRegionChange?: (regionId: string) => void
  containerId?: string
}

export function SkillReferenceField({
  name,
  label = '사용 기술',
  selectedRegionId,
  owningSectionId,
  onSelectedRegionChange,
  containerId = `skill-references-${name}`,
}: SkillReferenceFieldProps) {
  const { control } = useFormContext<ResumeDraft>()
  const catalog = useWatch({ control, name: 'skillCatalog' })
  const references = useWatch({ control, name })
  const fieldArray = useFieldArray({
    control,
    name,
    keyName: 'formKey',
  })
  const selected = Array.isArray(references)
    ? references.flatMap((reference) =>
        typeof reference === 'object' && reference !== null && 'skillId' in reference
          ? [String(reference.skillId)]
          : [],
      )
    : []

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">{label}</legend>
      <SortableList
        containerId={containerId}
        entries={fieldArray.fields.map((reference, index) => {
          const skillId = selected[index]
          const skill = catalog.find((candidate) => candidate.id === skillId)
          return { id: String(reference.id), label: `${skill?.label ?? skillId} 사용 기술` }
        })}
        onMove={fieldArray.move}
      >
        <div className="space-y-2">
          {fieldArray.fields.map((reference, index) => {
            const skillId = selected[index]
            const skill = catalog.find((candidate) => candidate.id === skillId)
            const itemLabel = `${skill?.label ?? skillId} 사용 기술`
            return (
              <SortableItem key={reference.formKey} id={String(reference.id)}>
                <div
                  data-editor-region-id={String(reference.id)}
                  className="flex items-center gap-2"
                >
                  <SortableHandle label={itemLabel} />
                  <span className="text-sm">{skill?.label ?? skillId}</span>
                </div>
              </SortableItem>
            )
          })}
        </div>
      </SortableList>
      {catalog.map((skill) => {
        const selectedIndex = selected.indexOf(skill.id)
        return (
          <label key={skill.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedIndex >= 0}
              onChange={(event) => {
                if (event.target.checked) fieldArray.append(createSkillReference(skill.id))
                else if (selectedIndex >= 0) {
                  const removedId = fieldArray.fields[selectedIndex]?.id
                  fieldArray.remove(selectedIndex)
                  if (
                    selectedRegionId === removedId &&
                    owningSectionId !== undefined &&
                    onSelectedRegionChange !== undefined
                  ) {
                    onSelectedRegionChange(owningSectionId)
                  }
                }
              }}
            />
            {skill.label || skill.id}
            {selectedIndex >= 0 && <span className="text-slate-500">선택 {selectedIndex + 1}</span>}
          </label>
        )
      })}
      {catalog.length === 0 && <p className="text-sm text-slate-500">등록된 기술이 없습니다.</p>}
    </fieldset>
  )
}
