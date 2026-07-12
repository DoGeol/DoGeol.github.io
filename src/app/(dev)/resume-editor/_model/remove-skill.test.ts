import { describe, expect, it } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import { removeSkillAndReferences } from './remove-skill'

describe('removeSkillAndReferences', () => {
  it('원본을 변경하지 않고 catalog와 모든 경력 기술 참조를 제거한다', () => {
    const source = createResumeFixture()
    const original = structuredClone(source)

    const result = removeSkillAndReferences(source, 'typescript')

    expect(source).toEqual(original)
    expect(result.removedReferenceCount).toBe(1)
    expect(result.draft.skillCatalog).toEqual([])
    const experience = result.draft.sections.find((section) => section.type === 'experience')
    expect(experience?.data.items[0]?.histories[0]?.skills).toEqual([])
  })
})
