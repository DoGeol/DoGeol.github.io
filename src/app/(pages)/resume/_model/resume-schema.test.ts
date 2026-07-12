import { describe, expect, expectTypeOf, it } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import {
  resumeDraftSchema,
  resumeSchema,
  type ResumeData,
  type ResumeDraft,
} from '@/app/(pages)/resume/_model/resume-schema'

describe('resume schema', () => {
  it('valid fixture를 strict schema로 검증한다', () => {
    expect(resumeSchema.parse(createResumeFixture())).toMatchObject({
      schemaVersion: 1,
    })
  })

  it('draft와 strict의 TypeScript shape가 같다', () => {
    expectTypeOf<ResumeDraft>().toEqualTypeOf<ResumeData>()
  })

  it('section type 중복을 거부한다', () => {
    const duplicate = createResumeFixture()
    duplicate.sections[1] = structuredClone(duplicate.sections[0])

    expect(() => resumeSchema.parse(duplicate)).toThrow(/section type.*중복|누락/i)
  })

  it('경력 종료일이 시작일보다 앞서면 거부한다', () => {
    const reversed = createResumeFixture()
    const experience = reversed.sections.find((section) => section.type === 'experience')
    if (!experience) throw new Error('fixture experience section 누락')
    experience.data.items[0].histories[0].endDate = '2023-12-31'

    expect(() => resumeSchema.parse(reversed)).toThrow(/종료일/i)
  })

  it('catalog에 없는 기술 참조를 거부한다', () => {
    const missingSkill = createResumeFixture()
    const missingSkillExperience = missingSkill.sections.find(
      (section) => section.type === 'experience',
    )
    if (!missingSkillExperience) {
      throw new Error('fixture experience section 누락')
    }
    missingSkillExperience.data.items[0].histories[0].skills[0].skillId = 'missing'

    expect(() => resumeSchema.parse(missingSkill)).toThrow(/기술/i)
  })

  it('draft는 빈 required text를 보존하고 strict는 거부한다', () => {
    const blankDraft = createResumeFixture()
    const blankExperience = blankDraft.sections.find((section) => section.type === 'experience')
    if (!blankExperience) throw new Error('fixture experience section 누락')
    blankExperience.data.items[0].companyName = ''

    expect(resumeDraftSchema.parse(blankDraft)).toBeTruthy()
    expect(() => resumeSchema.parse(blankDraft)).toThrow(/회사명/i)
  })

  it('알 수 없는 template을 거부한다', () => {
    const unknownTemplate = {
      ...createResumeFixture(),
      templateId: 'unknown',
    }

    expect(() => resumeSchema.parse(unknownTemplate)).toThrow()
  })

  it('extra key를 거부한다', () => {
    const extraKey = {
      ...createResumeFixture(),
      unexpected: true,
    }

    expect(() => resumeSchema.parse(extraKey)).toThrow()
  })

  it('document 전체의 중복 ID를 거부한다', () => {
    const duplicateId = createResumeFixture()
    duplicateId.sections[0].id = duplicateId.skillCatalog[0].id

    expect(() => resumeSchema.parse(duplicateId)).toThrow(/ID.*중복/i)
  })

  it('section이 누락되면 거부한다', () => {
    const missingSection = createResumeFixture()
    missingSection.sections.pop()

    expect(() => resumeSchema.parse(missingSection)).toThrow(/누락/i)
  })

  it.each([
    ['email', 'not-an-email'],
    ['tel', 'invalid'],
    ['site', 'ftp://example.com'],
    ['github', 'github.com/example'],
  ] as const)('유효하지 않은 %s contact를 거부한다', (type, value) => {
    const invalidContact = createResumeFixture()
    const information = invalidContact.sections.find((section) => section.type === 'information')
    if (!information) throw new Error('fixture information section 누락')
    information.data.contacts[0] = {
      ...information.data.contacts[0],
      type,
      value,
    }

    expect(() => resumeSchema.parse(invalidContact)).toThrow(/연락처/i)
  })

  it('root 기준이 아닌 asset path를 거부한다', () => {
    const invalidAssetPath = createResumeFixture()
    invalidAssetPath.assets.profileFront = 'profile/photo.webp'

    expect(() => resumeSchema.parse(invalidAssetPath)).toThrow()
  })

  it('draft는 빈 date를 보존하고 strict는 거부한다', () => {
    const blankDate = createResumeFixture()
    const introduce = blankDate.sections.find((section) => section.type === 'introduce')
    if (!introduce) throw new Error('fixture introduce section 누락')
    introduce.data.updatedAt = ''

    expect(resumeDraftSchema.parse(blankDate)).toBeTruthy()
    expect(() => resumeSchema.parse(blankDate)).toThrow()
  })

  it('종료월이 시작월보다 앞서면 거부한다', () => {
    const reversedMonth = createResumeFixture()
    const projects = reversedMonth.sections.find((section) => section.type === 'projects')
    if (!projects) throw new Error('fixture projects section 누락')
    projects.data.items[0].endMonth = '2023-12'

    expect(() => resumeSchema.parse(reversedMonth)).toThrow(/종료월/i)
  })

  it('null 종료일과 종료월을 허용한다', () => {
    const openEnded = createResumeFixture()
    const experience = openEnded.sections.find((section) => section.type === 'experience')
    if (!experience) throw new Error('fixture experience section 누락')
    experience.data.items[0].histories[0].endDate = null
    const projects = openEnded.sections.find((section) => section.type === 'projects')
    if (!projects) throw new Error('fixture projects section 누락')
    projects.data.items[0].endMonth = null

    expect(resumeSchema.parse(openEnded)).toBeTruthy()
  })
})
