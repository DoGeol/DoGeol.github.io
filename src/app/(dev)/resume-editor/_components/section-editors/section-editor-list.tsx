import { useEffect, useEffectEvent } from 'react'
import { useFieldArray, useFormContext, useWatch, type FieldPath } from 'react-hook-form'

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
import { SortableHandle } from '@/app/(dev)/resume-editor/_components/sortable/sortable-handle'
import { SortableItem } from '@/app/(dev)/resume-editor/_components/sortable/sortable-item'
import { SortableList } from '@/app/(dev)/resume-editor/_components/sortable/sortable-list'

type SectionEditorListProps = {
  selectedRegionId: string | null
  onSelectedRegionChange: (regionId: string) => void
  openSectionIds: ReadonlySet<string>
  onOpenSectionIdsChange: (sectionIds: Set<string>) => void
  focusRequest?: EditorFocusRequest | null
}

export type EditorFocusRequest = {
  token: number
  regionId: string | null
  sectionId: string | null
  fieldPath: FieldPath<ResumeDraft>
}

const assertNever = (value: never): never => {
  throw new Error(`지원하지 않는 section: ${JSON.stringify(value)}`)
}

export function SectionEditorList({
  selectedRegionId,
  onSelectedRegionChange,
  openSectionIds,
  onOpenSectionIdsChange,
  focusRequest = null,
}: SectionEditorListProps) {
  const form = useFormContext<ResumeDraft>()
  const { fields: sectionFields, move: moveSection } = useFieldArray({
    control: form.control,
    name: 'sections',
    keyName: 'formKey',
  })
  const sections = useWatch({ control: form.control, name: 'sections' })
  const sectionFormKeys = new Map(
    sectionFields.map((section) => [String(section.id), section.formKey]),
  )
  const ensureSectionOpen = useEffectEvent((sectionId: string) => {
    if (!openSectionIds.has(sectionId)) {
      onOpenSectionIdsChange(new Set([...openSectionIds, sectionId]))
    }
  })

  useEffect(() => {
    const draft = form.getValues()
    const requestedRegionId = focusRequest?.regionId ?? selectedRegionId
    const path =
      focusRequest?.fieldPath ??
      (requestedRegionId === null
        ? undefined
        : buildEditorRegionIndex(draft).get(requestedRegionId))
    if (path === undefined) return
    const match = /^sections\.(\d+)/.exec(path)
    const section = match === null ? undefined : draft.sections[Number(match[1])]
    const sectionId = focusRequest?.sectionId ?? section?.id ?? null
    if (sectionId !== null) ensureSectionOpen(sectionId)

    const isSectionSelection =
      focusRequest === null &&
      draft.sections.some((candidate) => candidate.id === requestedRegionId)
    if (isSectionSelection) return

    if (focusRequest !== null) {
      const exactField = document.getElementById(
        `field-${focusRequest.fieldPath.replaceAll('.', '-')}`,
      )
      exactField?.scrollIntoView?.({ block: 'nearest' })
      exactField?.focus()
      return
    }

    let active = true
    let outerFrame: number | null = null
    let innerFrame: number | null = null
    outerFrame = window.requestAnimationFrame(() => {
      if (!active) return
      innerFrame = window.requestAnimationFrame(() => {
        if (!active) return
        const region = Array.from(
          document.querySelectorAll<HTMLElement>('[data-editor-region-id]'),
        ).find((element) => element.dataset.editorRegionId === requestedRegionId)
        region?.scrollIntoView?.({ block: 'nearest' })
        const field = region?.querySelector<HTMLElement>(
          'input:not([type="hidden"]), textarea, select',
        )
        const fallbackButton = region?.querySelector<HTMLElement>(
          'button:not([aria-roledescription="sortable"])',
        )
        ;(field ?? fallbackButton)?.focus()
      })
    })

    return () => {
      active = false
      if (outerFrame !== null) window.cancelAnimationFrame(outerFrame)
      if (innerFrame !== null) window.cancelAnimationFrame(innerFrame)
    }
  }, [focusRequest, form, selectedRegionId])

  return (
    <SortableList
      containerId="resume-sections"
      entries={sections.map((section) => ({
        id: section.id,
        label: getResumeSectionLabel(section.type),
      }))}
      onMove={moveSection}
    >
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

          const label = getResumeSectionLabel(section.type)
          return (
            <SortableItem key={sectionFormKeys.get(section.id) ?? section.id} id={section.id}>
              <SectionCard
                regionId={section.id}
                title={label}
                dragHandle={<SortableHandle label={label} />}
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
            </SortableItem>
          )
        })}
        {new Set(sections.map((section) => section.id)).size !== 7 && (
          <p role="alert">필수 section 구성이 올바르지 않습니다.</p>
        )}
      </div>
    </SortableList>
  )
}
