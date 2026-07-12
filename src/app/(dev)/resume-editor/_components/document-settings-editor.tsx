import { useFormContext } from 'react-hook-form'

import { resumeTemplateOptions } from '@/app/(pages)/resume/_templates/registry'
import { createDefaultItem } from '@/app/(dev)/resume-editor/_model/default-items'
import { removeSkillAndReferences } from '@/app/(dev)/resume-editor/_model/remove-skill'

import { SelectField } from '@/app/(dev)/resume-editor/_components/fields/select-field'
import { TextField } from '@/app/(dev)/resume-editor/_components/fields/text-field'
import {
  focusLastInput,
  SortableItemRegion,
  useResumeFieldArray,
} from '@/app/(dev)/resume-editor/_components/section-editors/section-editor-helpers'
import { SortableList } from '@/app/(dev)/resume-editor/_components/sortable/sortable-list'
import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

const skillCategoryOptions = [
  ['frontend', '프론트엔드'],
  ['app', '앱'],
  ['backend', '백엔드'],
  ['devops', 'DevOps'],
  ['analysis', '분석'],
  ['collaboration', '협업'],
  ['etc', '기타'],
] as const

type DocumentSettingsEditorProps = {
  selectedRegionId: string | null
  onSelectedRegionChange: (regionId: string) => void
}

export function DocumentSettingsEditor({
  selectedRegionId,
  onSelectedRegionChange,
}: DocumentSettingsEditorProps) {
  const form = useFormContext<ResumeDraft>()
  const skills = useResumeFieldArray('skillCatalog')

  return (
    <section
      data-document-settings=""
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
    >
      <h2 className="text-lg font-semibold">문서 설정</h2>
      <p className="text-sm">
        스키마 버전 <span className="rounded bg-slate-100 px-2 py-1">1</span>
      </p>
      <SelectField name="templateId" label="템플릿" options={resumeTemplateOptions} />
      <TextField name="metadata.title" label="이력서 제목" />
      <TextField name="metadata.socialTitle" label="소셜 제목" />
      <TextField name="metadata.description" label="설명" multiline />
      <TextField name="assets.profileFront" label="앞면 프로필 이미지 경로" />
      <TextField name="assets.profileBack" label="뒷면 프로필 이미지 경로" />
      <div data-item-list="skillCatalog" className="space-y-3">
        <h3 className="font-semibold">기술 목록</h3>
        <SortableList
          containerId="skill-catalog"
          entries={skills.fields.map((skill, index) => ({
            id: String(skill.id),
            label: `${form.getValues(`skillCatalog.${index}`).label || skill.id} 기술`,
          }))}
          onMove={skills.move}
        >
          {skills.fields.map((skill, index) => {
            const current = form.getValues(`skillCatalog.${index}`)
            return (
              <SortableItemRegion
                key={skill.formKey}
                id={String(skill.id)}
                label={`${current.label || '새 기술'} 기술`}
                selected={selectedRegionId === skill.id}
              >
                <TextField name={`skillCatalog.${index}.id`} label="기술 ID" readOnly />
                <TextField name={`skillCatalog.${index}.label`} label="기술명" />
                <SelectField
                  name={`skillCatalog.${index}.category`}
                  label="기술 분류"
                  options={skillCategoryOptions.map(([value, label]) => ({ value, label }))}
                />
                <button
                  type="button"
                  aria-label={`${current.label || current.id} 기술 삭제`}
                  onClick={() => {
                    const source = form.getValues()
                    const referenceSection = source.sections.find(
                      (section) =>
                        section.type === 'experience' &&
                        section.data.items.some((item) =>
                          item.histories.some((history) =>
                            history.skills.some(
                              (reference) =>
                                reference.id === selectedRegionId &&
                                reference.skillId === current.id,
                            ),
                          ),
                        ),
                    )
                    const fallbackRegionId =
                      selectedRegionId === current.id
                        ? (source.sections[0]?.id ?? null)
                        : (referenceSection?.id ?? null)
                    const result = removeSkillAndReferences(source, current.id)
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
    </section>
  )
}
