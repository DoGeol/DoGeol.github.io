import {
  useFieldArray,
  useFormContext,
  useWatch,
  type FieldArrayPath,
  type FieldPath,
} from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { createSkillReference } from '@/app/(dev)/resume-editor/_model/default-items'

type SkillReferenceFieldProps = {
  name: FieldPath<ResumeDraft>
  label?: string
  selectedRegionId?: string | null
  owningSectionId?: string
  onSelectedRegionChange?: (regionId: string) => void
}

export function SkillReferenceField({
  name,
  label = '사용 기술',
  selectedRegionId,
  owningSectionId,
  onSelectedRegionChange,
}: SkillReferenceFieldProps) {
  const { control, getValues } = useFormContext<ResumeDraft>()
  const catalog = useWatch({ control, name: 'skillCatalog' })
  const fieldArray = useFieldArray({
    control,
    name: name as FieldArrayPath<ResumeDraft>,
    keyName: 'formKey',
  })
  const references = getValues(name)
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
      {catalog.map((skill) => {
        const selectedIndex = selected.indexOf(skill.id)
        return (
          <label
            key={skill.id}
            data-editor-region-id={
              selectedIndex >= 0 ? String(fieldArray.fields[selectedIndex]?.id) : undefined
            }
            className="flex items-center gap-2 text-sm"
          >
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
