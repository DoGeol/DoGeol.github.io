import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

export const removeSkillAndReferences = (source: ResumeDraft, skillId: string) => {
  const draft = structuredClone(source)
  draft.skillCatalog = draft.skillCatalog.filter((skill) => skill.id !== skillId)
  let removedReferenceCount = 0

  for (const section of draft.sections) {
    if (section.type !== 'experience') continue
    for (const item of section.data.items) {
      for (const history of item.histories) {
        const before = history.skills.length
        history.skills = history.skills.filter((reference) => reference.skillId !== skillId)
        removedReferenceCount += before - history.skills.length
      }
    }
  }

  return { draft, removedReferenceCount }
}
