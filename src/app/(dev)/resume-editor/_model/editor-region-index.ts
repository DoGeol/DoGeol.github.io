import type { FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

export type EditorRegionIndex = Map<string, FieldPath<ResumeDraft>>

export type EditorNavigationTarget = {
  regionId: string | null
  sectionId: string | null
}

export const buildEditorRegionIndex = (draft: ResumeDraft): EditorRegionIndex => {
  const index: EditorRegionIndex = new Map()

  draft.skillCatalog.forEach((skill, skillIndex) => {
    index.set(skill.id, `skillCatalog.${skillIndex}`)
  })

  draft.sections.forEach((section, sectionIndex) => {
    const sectionPath = `sections.${sectionIndex}` as const
    index.set(section.id, sectionPath)

    switch (section.type) {
      case 'information':
        section.data.contacts.forEach((contact, contactIndex) => {
          index.set(contact.id, `${sectionPath}.data.contacts.${contactIndex}`)
        })
        break

      case 'introduce':
        section.data.paragraphs.forEach((paragraph, paragraphIndex) => {
          index.set(paragraph.id, `${sectionPath}.data.paragraphs.${paragraphIndex}`)
        })
        break

      case 'experience':
        section.data.items.forEach((experience, experienceIndex) => {
          const experiencePath = `${sectionPath}.data.items.${experienceIndex}` as const
          index.set(experience.id, experiencePath)
          experience.serviceSummary.forEach((summary, summaryIndex) => {
            index.set(summary.id, `${experiencePath}.serviceSummary.${summaryIndex}`)
          })
          experience.experienceSummary.forEach((summary, summaryIndex) => {
            index.set(summary.id, `${experiencePath}.experienceSummary.${summaryIndex}`)
          })
          experience.histories.forEach((history, historyIndex) => {
            const historyPath = `${experiencePath}.histories.${historyIndex}` as const
            index.set(history.id, historyPath)
            history.works.forEach((work, workIndex) => {
              index.set(work.id, `${historyPath}.works.${workIndex}`)
            })
            history.skills.forEach((skill, skillIndex) => {
              index.set(skill.id, `${historyPath}.skills.${skillIndex}`)
            })
          })
        })
        break

      case 'projects':
        section.data.items.forEach((project, projectIndex) => {
          const projectPath = `${sectionPath}.data.items.${projectIndex}` as const
          index.set(project.id, projectPath)
          project.works.forEach((work, workIndex) => {
            const workPath = `${projectPath}.works.${workIndex}` as const
            index.set(work.id, workPath)
            work.details.forEach((detail, detailIndex) => {
              index.set(detail.id, `${workPath}.details.${detailIndex}`)
            })
          })
        })
        break

      case 'education':
      case 'activity':
      case 'licenses':
        section.data.items.forEach((item, itemIndex) => {
          index.set(item.id, `${sectionPath}.data.items.${itemIndex}`)
        })
        break
    }
  })

  return index
}

export const buildPreviewRegionParents = (draft: ResumeDraft): ReadonlyMap<string, string> => {
  const parents = new Map<string, string>()
  const index = buildEditorRegionIndex(draft)

  draft.sections.forEach((section, sectionIndex) => {
    const sectionPath = `sections.${sectionIndex}`
    index.forEach((fieldPath, regionId) => {
      if (fieldPath === sectionPath || fieldPath.startsWith(`${sectionPath}.`)) {
        parents.set(regionId, section.id)
      }
    })
  })

  return parents
}

export const findEditorNavigationTarget = (
  draft: ResumeDraft,
  fieldPath: FieldPath<ResumeDraft>,
): EditorNavigationTarget => {
  const sectionMatch = /^sections\.(\d+)/.exec(fieldPath)
  const sectionIndex = sectionMatch === null ? null : Number(sectionMatch[1])
  const sectionId = sectionIndex === null ? null : (draft.sections[sectionIndex]?.id ?? null)
  let regionId: string | null = sectionId
  let longestPath = sectionIndex === null ? -1 : `sections.${sectionIndex}`.length

  buildEditorRegionIndex(draft).forEach((candidatePath, candidateId) => {
    if (
      (fieldPath === candidatePath || fieldPath.startsWith(`${candidatePath}.`)) &&
      candidatePath.length > longestPath
    ) {
      regionId = candidateId
      longestPath = candidatePath.length
    }
  })

  return { regionId, sectionId }
}
