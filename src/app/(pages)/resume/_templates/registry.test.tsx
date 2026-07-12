import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { resumeSchema } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import { getResumeTemplate, ResumeDocument } from '@/app/(pages)/resume/_templates/registry'
import { createResumeFixture } from '@/test/fixtures/resume'

describe('resume template registry', () => {
  it('strict resume fixture를 classic template으로 렌더링한다', () => {
    const resume = resumeSchema.parse(createResumeFixture())

    render(<ResumeDocument resume={resume} />)

    expect(screen.getByText('Experience')).toBeVisible()
    expect(screen.getByText('프로젝트')).toBeVisible()
  })

  it('실제 host DOM root를 region renderer에 전달한다', () => {
    const resume = resumeSchema.parse(createResumeFixture())
    const regions: string[] = []
    const renderRegion: ResumeRegionRenderer = ({ id, children }) => {
      regions.push(id)
      expect(typeof children.type).toBe('string')
      return children
    }

    render(<ResumeDocument resume={resume} renderRegion={renderRegion} />)

    expect(regions).toEqual(
      expect.arrayContaining([
        'section-information',
        'contact-email',
        'paragraph-1',
        'section-experience',
        'experience-1',
        'service-summary-1',
        'history-1',
        'history-work-1',
        'history-skill-1',
        'project-1',
        'project-work-1',
        'project-detail-1',
        'education-1',
        'activity-1',
        'license-1',
      ]),
    )
  })

  it('알 수 없는 template을 거부한다', () => {
    expect(() => getResumeTemplate('unknown' as never)).toThrow(/template/i)
  })
})
