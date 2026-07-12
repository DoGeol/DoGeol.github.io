import { describe, expect, it } from 'vitest'

import type { ExperienceSection } from '@/app/(pages)/resume/_model/resume-schema'

import {
  calculateExperiencePeriod,
  calculateTotalExperience,
  getCompanyPeriodText,
} from '@/app/(pages)/resume/_components/experience/utils'

type ExperienceItem = ExperienceSection['data']['items'][number]

const createExperience = (
  companyName: string,
  startDate: string,
  endDate: string,
): ExperienceItem => ({
  id: companyName,
  companyName,
  logoPath: '/company/logo/laud.webp',
  serviceSummary: [],
  experienceSummary: [],
  employmentStatus: 'retired',
  histories: [
    {
      id: `${companyName}-history`,
      department: '개발팀',
      role: '프론트엔드 개발자',
      startDate,
      endDate,
      works: [],
      skills: [],
    },
  ],
})

const createSection = (items: ExperienceItem[]): ExperienceSection => ({
  id: 'section-experience',
  type: 'experience',
  visible: true,
  data: { showTotalPeriod: true, items },
})

describe('experience utils', () => {
  it('종료일이 있는 경력을 년과 개월로 표시한다', () => {
    const experience = createExperience('회사', '2024-01-01', '2024-12-31')
    expect(calculateExperiencePeriod(experience)).toBe('1년')
    expect(getCompanyPeriodText(experience)).toBe('2024.01 ~ 2024.12')
  })

  it('여러 회사의 경력 개월을 합산한다', () => {
    const section = createSection([
      createExperience('첫 회사', '2024-01-01', '2024-06-30'),
      createExperience('두 번째 회사', '2024-07-01', '2024-12-31'),
    ])
    expect(calculateTotalExperience(section)).toBe('총 1년 0개월')
  })
})
