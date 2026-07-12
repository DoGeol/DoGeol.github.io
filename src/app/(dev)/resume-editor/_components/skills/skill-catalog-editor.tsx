'use client'

import { useId, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { SelectField } from '@/app/(dev)/resume-editor/_components/fields/select-field'
import { TextField } from '@/app/(dev)/resume-editor/_components/fields/text-field'
import { skillCategoryOptions } from '@/app/(dev)/resume-editor/_components/skills/skill-editor-options'
import {
  focusLastInput,
  SortableItemRegion,
  useResumeFieldArray,
} from '@/app/(dev)/resume-editor/_components/section-editors/section-editor-helpers'
import { SortableList } from '@/app/(dev)/resume-editor/_components/sortable/sortable-list'
import { createDefaultItem } from '@/app/(dev)/resume-editor/_model/default-items'
import { removeSkillAndReferences } from '@/app/(dev)/resume-editor/_model/remove-skill'

type SkillCatalogEditorProps = {
  selectedRegionId: string | null
  onSelectedRegionChange: (regionId: string) => void
}

export function SkillCatalogEditor({
  selectedRegionId,
  onSelectedRegionChange,
}: SkillCatalogEditorProps) {
  const panelId = useId()
  const form = useFormContext<ResumeDraft>()
  const skills = useResumeFieldArray('skillCatalog')
  const catalog = useWatch({ control: form.control, name: 'skillCatalog' })
  const [manuallyOpen, setManuallyOpen] = useState(false)
  const selectedCatalogSkill = catalog.some((skill) => skill.id === selectedRegionId)
  const expanded = manuallyOpen || selectedCatalogSkill

  return (
    <div data-item-list="skillCatalog" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">기술 목록</h3>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          disabled={selectedCatalogSkill}
          onClick={() => setManuallyOpen((current) => !current)}
          className="rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {selectedCatalogSkill
            ? '선택한 기술 편집 중'
            : expanded
              ? '기술 목록 닫기'
              : `기술 목록 ${catalog.length}개 열기`}
        </button>
      </div>
      {expanded && (
        <div id={panelId} className="space-y-3">
          <SortableList
            containerId="skill-catalog"
            entries={skills.fields.map((skill, index) => ({
              id: String(skill.id),
              label: `${catalog[index]?.label || skill.id} 기술`,
            }))}
            onMove={skills.move}
          >
            {skills.fields.map((skill, index) => {
              const current = catalog[index]
              const currentId = current?.id ?? String(skill.id)
              const currentLabel = current?.label ?? ''
              return (
                <SortableItemRegion
                  key={skill.formKey}
                  id={currentId}
                  label={`${currentLabel || '새 기술'} 기술`}
                  selected={selectedRegionId === currentId}
                >
                  <TextField name={`skillCatalog.${index}.id`} label="기술 ID" readOnly />
                  <TextField name={`skillCatalog.${index}.label`} label="기술명" />
                  <SelectField
                    name={`skillCatalog.${index}.category`}
                    label="기술 분류"
                    options={skillCategoryOptions}
                  />
                  <button
                    type="button"
                    aria-label={`${currentLabel || currentId} 기술 삭제`}
                    onClick={() => {
                      const selectedSkill = form.getValues(`skillCatalog.${index}`)
                      const source = form.getValues()
                      const referenceSection = source.sections.find(
                        (section) =>
                          section.type === 'experience' &&
                          section.data.items.some((item) =>
                            item.histories.some((history) =>
                              history.skills.some(
                                (reference) =>
                                  reference.id === selectedRegionId &&
                                  reference.skillId === selectedSkill.id,
                              ),
                            ),
                          ),
                      )
                      const fallbackRegionId =
                        selectedRegionId === selectedSkill.id
                          ? (source.sections[0]?.id ?? null)
                          : (referenceSection?.id ?? null)
                      const result = removeSkillAndReferences(source, selectedSkill.id)
                      if (
                        !window.confirm(
                          `기술을 삭제하면 경력의 참조 ${result.removedReferenceCount}개도 함께 삭제됩니다. 계속할까요?`,
                        )
                      )
                        return
                      form.reset(result.draft, {
                        keepDefaultValues: true,
                        keepTouched: true,
                      })
                      void form.trigger()
                      if (fallbackRegionId !== null) onSelectedRegionChange(fallbackRegionId)
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  >
                    기술 삭제
                  </button>
                </SortableItemRegion>
              )
            })}
          </SortableList>
          <button
            type="button"
            onClick={() => {
              skills.append(createDefaultItem('catalog-skill'))
              focusLastInput('skillCatalog')
            }}
            className="rounded border px-3 py-2 text-sm"
          >
            기술 추가
          </button>
        </div>
      )}
    </div>
  )
}
