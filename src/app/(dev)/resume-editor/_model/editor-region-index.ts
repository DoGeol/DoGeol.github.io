import type { FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

export type EditorRegionIndex = Map<string, FieldPath<ResumeDraft>>

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
