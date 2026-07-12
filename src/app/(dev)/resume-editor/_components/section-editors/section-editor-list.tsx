import { useEffect } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { buildEditorRegionIndex } from '@/app/(dev)/resume-editor/_model/editor-region-index'
import { getResumeSectionLabel } from '@/app/(dev)/resume-editor/_model/editor-labels'

import { ActivityEditor } from '@/app/(dev)/resume-editor/_components/section-editors/activity-editor'
import { EducationEditor } from '@/app/(dev)/resume-editor/_components/section-editors/education-editor'
import { ExperienceEditor } from '@/app/(dev)/resume-editor/_components/section-editors/experience-editor'
import { InformationEditor } from '@/app/(dev)/resume-editor/_components/section-editors/information-editor'
import { IntroduceEditor } from '@/app/(dev)/resume-editor/_components/section-editors/introduce-editor'
import { LicensesEditor } from '@/app/(dev)/resume-editor/_components/section-editors/licenses-editor'
import { ProjectsEditor } from '@/app/(dev)/resume-editor/_components/section-editors/projects-editor'
import { SectionCard } from '@/app/(dev)/resume-editor/_components/section-editors/section-card'

type SectionEditorListProps = {
  selectedRegionId: string | null
  onSelectedRegionChange: (regionId: string) => void
  openSectionIds: ReadonlySet<string>
  onOpenSectionIdsChange: (sectionIds: Set<string>) => void
}

const assertNever = (value: never): never => {
  throw new Error(`지원하지 않는 section: ${JSON.stringify(value)}`)
}

export function SectionEditorList({
  selectedRegionId,
  onSelectedRegionChange,
  openSectionIds,
  onOpenSectionIdsChange,
}: SectionEditorListProps) {
  const form = useFormContext<ResumeDraft>()
  const { fields: sectionFields } = useFieldArray({
    control: form.control,
    name: 'sections',
    keyName: 'formKey',
  })
  const sections = useWatch({ control: form.control, name: 'sections' })

  useEffect(() => {
    if (selectedRegionId === null) return
    const path = buildEditorRegionIndex(form.getValues()).get(selectedRegionId)
    if (path === undefined) return
    const match = /^sections\.(\d+)/.exec(path)
    if (match === null) return
    const section = form.getValues(`sections.${Number(match[1])}`)
    queueMicrotask(() => {
      if (!openSectionIds.has(section.id)) {
        onOpenSectionIdsChange(new Set([...openSectionIds, section.id]))
      }
    })

    if (form.getValues('sections').some((candidate) => candidate.id === selectedRegionId)) return

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const region = Array.from(
          document.querySelectorAll<HTMLElement>('[data-editor-region-id]'),
        ).find((element) => element.dataset.editorRegionId === selectedRegionId)
        region?.scrollIntoView?.({ block: 'nearest' })
        region
          ?.querySelector<HTMLElement>('input:not([type="hidden"]), textarea, select, button')
          ?.focus()
      })
    })
  }, [form, onOpenSectionIdsChange, openSectionIds, selectedRegionId])

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => {
        const expanded = openSectionIds.has(section.id)
        const commonProps = {
          sectionIndex,
          selectedRegionId,
          onSelectedRegionChange,
        }
        let editor: React.ReactNode
        switch (section.type) {
          case 'information':
            editor = <InformationEditor {...commonProps} />
            break
          case 'introduce':
            editor = <IntroduceEditor {...commonProps} sectionId={section.id} />
            break
          case 'experience':
            editor = <ExperienceEditor {...commonProps} />
            break
          case 'projects':
            editor = <ProjectsEditor {...commonProps} />
            break
          case 'education':
            editor = <EducationEditor {...commonProps} />
            break
          case 'activity':
            editor = <ActivityEditor {...commonProps} />
            break
          case 'licenses':
            editor = <LicensesEditor {...commonProps} />
            break
          default:
            editor = assertNever(section)
        }

        return (
          <SectionCard
            key={sectionFields[sectionIndex]?.formKey ?? section.id}
            regionId={section.id}
            title={getResumeSectionLabel(section.type)}
            expanded={expanded}
            selected={selectedRegionId === section.id}
            visibleName={`sections.${sectionIndex}.visible`}
            onExpandedChange={(nextExpanded) => {
              const next = new Set(openSectionIds)
              if (nextExpanded) next.add(section.id)
              else next.delete(section.id)
              onOpenSectionIdsChange(next)
              onSelectedRegionChange(section.id)
            }}
          >
            {editor}
          </SectionCard>
        )
      })}
      {new Set(sections.map((section) => section.id)).size !== 7 && (
        <p role="alert">필수 section 구성이 올바르지 않습니다.</p>
      )}
    </div>
  )
}
