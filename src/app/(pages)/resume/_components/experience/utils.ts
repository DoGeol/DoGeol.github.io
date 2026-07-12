import dayjs from 'dayjs'

import type { ExperienceSection } from '@/app/(pages)/resume/_model/resume-schema'

export type ExperienceItem = ExperienceSection['data']['items'][number]

export const getEmploymentStatusText = (status: ExperienceItem['employmentStatus']) => {
  switch (status) {
    case 'employed':
      return '재직중'
    case 'retired':
      return '퇴사'
    case 'recommended-retired':
      return '*경영악화로 인한 권고사직 퇴사'
  }
}

export const calculateTotalExperience = (section: ExperienceSection) => {
  let totalMonths = 0
  section.data.items.forEach((experience) => {
    experience.histories.forEach((history) => {
      const startDate = dayjs(history.startDate)
      const endDate = history.endDate ? dayjs(history.endDate) : dayjs()
      totalMonths += endDate.diff(startDate, 'month') + 1
    })
  })

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  return `총 ${years}년 ${months}개월`
}

export const calculateExperiencePeriod = (experience: ExperienceItem) => {
  let totalMonths = 0
  experience.histories.forEach((history) => {
    const startDate = dayjs(history.startDate)
    const endDate = history.endDate ? dayjs(history.endDate) : dayjs()
    totalMonths += endDate.diff(startDate, 'month') + 1
  })

  if (totalMonths <= 0) return ''

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const yearText = years > 0 ? `${years}년` : ''
  const monthText = months > 0 ? `${months}개월` : ''
  return [yearText, monthText].filter(Boolean).join(' ')
}

export const getCompanyPeriodText = (experience: ExperienceItem): string => {
  if (experience.histories.length === 0) return ''

  const startDates = experience.histories.map(({ startDate }) => dayjs(startDate))
  const earliestStartDate = startDates.reduce((earliest, current) =>
    current.isBefore(earliest) ? current : earliest,
  )
  const endDates = experience.histories
    .map(({ endDate }) => endDate)
    .filter((date): date is string => Boolean(date))
    .map((date) => dayjs(date))
  const startText = earliestStartDate.format('YYYY.MM')

  if (experience.employmentStatus === 'employed' || endDates.length === 0) {
    return `${startText} ~`
  }

  const latestEndDate = endDates.reduce((latest, current) =>
    current.isAfter(latest) ? current : latest,
  )
  return `${startText} ~ ${latestEndDate.format('YYYY.MM')}`
}
