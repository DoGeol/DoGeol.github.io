import { describe, expect, it } from 'vitest'
import type { Experience, IExperience } from './types'
import { calculateExperiencePeriod, calculateTotalExperience, getCompanyPeriodText } from './utils'

const createExperience = (companyName: string, period: [string, string]): Experience => ({
  logoName: companyName,
  companyName,
  employmentStatus: 'retire',
  historyList: [
    {
      department: '개발팀',
      role: '프론트엔드 개발자',
      period,
      workingList: [],
      skillNameList: [],
    },
  ],
})

describe('experience utils', () => {
  it('종료일이 있는 경력을 년과 개월로 표시한다', () => {
    const experience = createExperience('회사', ['2024-01-01', '2024-12-31'])

    expect(calculateExperiencePeriod(experience)).toBe('1년')
    expect(getCompanyPeriodText(experience)).toBe('2024.01 ~ 2024.12')
  })

  it('여러 회사의 경력 개월을 합산한다', () => {
    const experience: IExperience = {
      isShow: true,
      experienceList: [
        createExperience('첫 회사', ['2024-01-01', '2024-06-30']),
        createExperience('두 번째 회사', ['2024-07-01', '2024-12-31']),
      ],
    }

    expect(calculateTotalExperience(experience)).toBe('총 1년 0개월')
  })
})
