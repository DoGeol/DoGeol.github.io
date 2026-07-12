import { useFormContext } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { NullableDateField } from '@/app/(dev)/resume-editor/_components/fields/nullable-date-field'
import { RepeatableTextField } from '@/app/(dev)/resume-editor/_components/fields/repeatable-text-field'
import { TextField } from '@/app/(dev)/resume-editor/_components/fields/text-field'
import { createDefaultItem } from '@/app/(dev)/resume-editor/_model/default-items'

import {
  containsEditorRegionId,
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

function ProjectWorks({
  name,
  selectedRegionId,
  owningSectionId,
  parentId,
  onSelectedRegionChange,
}: {
  name: `sections.${number}.data.items.${number}.works`
  selectedRegionId: string | null
  owningSectionId: string
  parentId: string
  onSelectedRegionChange: (id: string) => void
}) {
  const form = useFormContext<ResumeDraft>()
  const works = useResumeFieldArray(name)
  return (
    <div data-item-list={name} className="space-y-3">
      <h4 className="font-semibold">프로젝트 업무</h4>
      <SortableList
        containerId={`project-works-${parentId}`}
        entries={works.fields.map((work, index) => ({
          id: String(work.id),
          label: form.getValues(`${name}.${index}`).title || '새 프로젝트 업무',
        }))}
        onMove={works.move}
      >
        {works.fields.map((work, index) => {
          const base = `${name}.${index}` as const
          const value = form.getValues(base)
          return (
            <SortableItemRegion
              key={work.formKey}
              id={String(work.id)}
              label={value.title || '새 프로젝트 업무'}
              selected={selectedRegionId === work.id}
            >
              <TextField name={`${base}.title`} label="프로젝트 역할" />
              <RepeatableTextField
                name={`${base}.details`}
                label="업무 상세"
                addLabel="상세 추가"
                selectedRegionId={selectedRegionId}
                owningSectionId={owningSectionId}
                onSelectedRegionChange={onSelectedRegionChange}
                containerId={`project-details-${String(work.id)}`}
              />
              <button
                type="button"
                aria-label={`${value.title || '프로젝트 업무'} 삭제`}
                onClick={() => {
                  if (!shouldDeleteItem(value, '프로젝트 업무를 삭제할까요?')) return
                  works.remove(index)
                  if (selectedRegionId !== null && containsEditorRegionId(value, selectedRegionId))
                    onSelectedRegionChange(owningSectionId)
                }}
                className="rounded border px-3 py-2 text-sm"
              >
                업무 삭제
              </button>
            </SortableItemRegion>
          )
        })}
      </SortableList>
      <button
        type="button"
        onClick={() => {
          works.append(createDefaultItem('project-work'))
          focusLastInput(name)
        }}
        className="rounded border px-3 py-2 text-sm"
      >
        프로젝트 업무 추가
      </button>
    </div>
  )
}

export function ProjectsEditor({ sectionIndex, selectedRegionId, onSelectedRegionChange }: Props) {
  const form = useFormContext<ResumeDraft>()
  const base = `sections.${sectionIndex}.data.items` as const
  const projects = useResumeFieldArray(base)
  const section = form.getValues(`sections.${sectionIndex}`)
  if (section.type !== 'projects') return null
  return (
    <div data-item-list="projects" className="space-y-4">
      <SortableList
        containerId={`projects-${section.id}`}
        entries={projects.fields.map((project, index) => ({
          id: String(project.id),
          label: section.data.items[index]?.title || '새 프로젝트',
        }))}
        onMove={projects.move}
      >
        {projects.fields.map((project, index) => {
          const itemBase = `${base}.${index}` as const
          const value = section.data.items[index]!
          return (
            <SortableItemRegion
              key={project.formKey}
              id={String(project.id)}
              label={value.title || '새 프로젝트'}
              selected={selectedRegionId === project.id}
            >
              <TextField name={`${itemBase}.title`} label="프로젝트명" />
              <TextField name={`${itemBase}.startMonth`} label="시작월" type="month" />
              <NullableDateField name={`${itemBase}.endMonth`} label="종료월" inputType="month" />
              <TextField name={`${itemBase}.companyName`} label="회사명" />
              <TextField name={`${itemBase}.summary`} label="프로젝트 요약" multiline />
              <ProjectWorks
                name={`${itemBase}.works`}
                selectedRegionId={selectedRegionId}
                owningSectionId={section.id}
                parentId={String(project.id)}
                onSelectedRegionChange={onSelectedRegionChange}
              />
              <button
                type="button"
                aria-label={`${value.title || '프로젝트'} 삭제`}
                onClick={() => {
                  if (!shouldDeleteItem(value, '프로젝트를 삭제할까요?')) return
                  projects.remove(index)
                  if (selectedRegionId !== null && containsEditorRegionId(value, selectedRegionId))
                    onSelectedRegionChange(section.id)
                }}
                className="rounded border px-3 py-2 text-sm"
              >
                프로젝트 삭제
              </button>
            </SortableItemRegion>
          )
        })}
      </SortableList>
      <button
        type="button"
        onClick={() => {
          projects.append(createDefaultItem('project'))
          focusLastInput('projects')
        }}
        className="rounded border px-3 py-2 text-sm"
      >
        프로젝트 추가
      </button>
    </div>
  )
}
