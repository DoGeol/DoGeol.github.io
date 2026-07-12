import { describe, expect, it } from 'vitest'

import { resumeDraftSchema } from '@/app/(pages)/resume/_model/resume-schema'
import { createResumeFixture } from '@/test/fixtures/resume'

import { createDefaultItem, createSkillReference } from './default-items'

const fixedId = (id: string) => () => id

describe('default resume items', () => {
  it.each([
    ['text', 'opaque-text-id', { id: 'opaque-text-id', text: '' }],
    [
      'contact',
      'opaque-contact-id',
      {
        id: 'opaque-contact-id',
        type: 'email',
        label: '',
        value: '',
        target: '_self',
      },
    ],
    [
      'catalog-skill',
      'opaque-catalog-id',
      { id: 'opaque-catalog-id', label: '', category: 'frontend' },
    ],
    [
      'experience',
      'opaque-experience-id',
      {
        id: 'opaque-experience-id',
        companyName: '',
        logoPath: '',
        serviceSummary: [],
        experienceSummary: [],
        employmentStatus: 'employed',
        histories: [],
      },
    ],
    [
      'history',
      'opaque-history-id',
      {
        id: 'opaque-history-id',
        department: '',
        role: '',
        startDate: '',
        endDate: null,
        works: [],
        skills: [],
      },
    ],
    [
      'project',
      'opaque-project-id',
      {
        id: 'opaque-project-id',
        title: '',
        startMonth: '',
        endMonth: null,
        companyName: '',
        summary: '',
        works: [],
      },
    ],
    [
      'project-work',
      'opaque-project-work-id',
      { id: 'opaque-project-work-id', title: '', details: [] },
    ],
    [
      'education',
      'opaque-education-id',
      {
        id: 'opaque-education-id',
        school: '',
        startMonth: '',
        endMonth: null,
        graduated: false,
        major: '',
        summary: '',
      },
    ],
    [
      'activity',
      'opaque-activity-id',
      { id: 'opaque-activity-id', title: '', startMonth: '', endMonth: null, summary: '' },
    ],
    [
      'license',
      'opaque-license-id',
      { id: 'opaque-license-id', title: '', acquiredAt: '', issuer: '' },
    ],
  ] as const)('creates the %s default from an injected stable ID', (type, id, expected) => {
    expect(createDefaultItem(type, fixedId(id))).toEqual(expected)
  })

  it('requires a selected catalog ID when creating a skill reference', () => {
    expect(createSkillReference('catalog-id', fixedId('opaque-reference-id'))).toEqual({
      id: 'opaque-reference-id',
      skillId: 'catalog-id',
    })
  })

  it('creates defaults that collectively pass the draft schema', () => {
    const draft = createResumeFixture()
    const sections = Object.fromEntries(draft.sections.map((section) => [section.type, section]))
    const information = sections.information
    const introduce = sections.introduce
    const experience = sections.experience
    const projects = sections.projects
    const education = sections.education
    const activity = sections.activity
    const licenses = sections.licenses

    if (
      information?.type !== 'information' ||
      introduce?.type !== 'introduce' ||
      experience?.type !== 'experience' ||
      projects?.type !== 'projects' ||
      education?.type !== 'education' ||
      activity?.type !== 'activity' ||
      licenses?.type !== 'licenses'
    ) {
      throw new Error('fixture에 필수 section이 없습니다')
    }

    const catalogSkill = createDefaultItem('catalog-skill', fixedId('new-catalog'))
    const history = createDefaultItem('history', fixedId('new-history'))
    history.works.push(createDefaultItem('text', fixedId('new-history-work')))
    history.skills.push(createSkillReference(catalogSkill.id, fixedId('new-skill-reference')))
    const experienceItem = createDefaultItem('experience', fixedId('new-experience'))
    experienceItem.serviceSummary.push(createDefaultItem('text', fixedId('new-service-summary')))
    experienceItem.experienceSummary.push(
      createDefaultItem('text', fixedId('new-experience-summary')),
    )
    experienceItem.histories.push(history)
    const projectWork = createDefaultItem('project-work', fixedId('new-project-work'))
    projectWork.details.push(createDefaultItem('text', fixedId('new-project-detail')))
    const project = createDefaultItem('project', fixedId('new-project'))
    project.works.push(projectWork)

    draft.skillCatalog = [catalogSkill]
    information.data.contacts = [createDefaultItem('contact', fixedId('new-contact'))]
    introduce.data.paragraphs = [createDefaultItem('text', fixedId('new-paragraph'))]
    experience.data.items = [experienceItem]
    projects.data.items = [project]
    education.data.items = [createDefaultItem('education', fixedId('new-education'))]
    activity.data.items = [createDefaultItem('activity', fixedId('new-activity'))]
    licenses.data.items = [createDefaultItem('license', fixedId('new-license'))]

    expect(resumeDraftSchema.parse(draft)).toEqual(draft)
  })
})
