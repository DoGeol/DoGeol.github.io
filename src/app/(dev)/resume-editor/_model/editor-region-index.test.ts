import { describe, expect, it } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import { buildEditorRegionIndex } from './editor-region-index'

describe('buildEditorRegionIndex', () => {
  it('maps stable nested IDs to their current field paths', () => {
    const index = buildEditorRegionIndex(createResumeFixture())

    expect(index.get('section-experience')).toBe('sections.2')
    expect(index.get('experience-1')).toBe('sections.2.data.items.0')
    expect(index.get('history-1')).toBe('sections.2.data.items.0.histories.0')
    expect(index.get('history-work-1')).toBe('sections.2.data.items.0.histories.0.works.0')
    expect(index.get('history-skill-1')).toBe('sections.2.data.items.0.histories.0.skills.0')
    expect(index.get('project-work-1')).toBe('sections.3.data.items.0.works.0')
    expect(index.get('project-detail-1')).toBe('sections.3.data.items.0.works.0.details.0')
  })

  it('indexes sections and every remaining editable item type', () => {
    const index = buildEditorRegionIndex(createResumeFixture())

    expect(index.get('typescript')).toBe('skillCatalog.0')
    expect(index.get('section-information')).toBe('sections.0')
    expect(index.get('contact-email')).toBe('sections.0.data.contacts.0')
    expect(index.get('section-introduce')).toBe('sections.1')
    expect(index.get('paragraph-1')).toBe('sections.1.data.paragraphs.0')
    expect(index.get('service-summary-1')).toBe('sections.2.data.items.0.serviceSummary.0')
    expect(index.get('experience-summary-1')).toBe('sections.2.data.items.0.experienceSummary.0')
    expect(index.get('project-1')).toBe('sections.3.data.items.0')
    expect(index.get('education-1')).toBe('sections.4.data.items.0')
    expect(index.get('activity-1')).toBe('sections.5.data.items.0')
    expect(index.get('license-1')).toBe('sections.6.data.items.0')
    expect(index.get('unknown')).toBeUndefined()
  })

  it('rebuilds paths after section order changes without changing IDs', () => {
    const draft = createResumeFixture()
    draft.sections = [
      draft.sections[2],
      draft.sections[0],
      ...draft.sections.slice(3),
      draft.sections[1],
    ]

    const index = buildEditorRegionIndex(draft)

    expect(index.get('section-experience')).toBe('sections.0')
    expect(index.get('experience-1')).toBe('sections.0.data.items.0')
    expect(index.get('paragraph-1')).toBe('sections.6.data.paragraphs.0')
  })
})
