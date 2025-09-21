import { Experience, IExperience } from '@/app/(pages)/resume/_components/experience/types'
import dayjs from 'dayjs'

export const getEmploymentStatusText = (
  status: IExperience['experienceList'][0]['employmentStatus'],
) => {
  switch (status) {
    case 'employed':
      return '재직중'
    case 'retire':
      return '퇴사'
    case 'recommended_retire':
      return '퇴사 (권고사직)'
  }
}

export const calculateTotalExperience = (experience: IExperience) => {
  let totalMonths = 0
  experience.experienceList.forEach((exp) => {
    exp.historyList.forEach((history) => {
      const startDate = dayjs(history.period[0])
      const endDate = history.period[1] ? dayjs(history.period[1]) : dayjs()
      totalMonths += endDate.diff(startDate, 'month') + 1
    })
  })

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  return `총 ${years}년 ${months}개월`
}

export const calculateExperiencePeriod = (experience: Experience) => {
  let totalMonths = 0
  experience.historyList.forEach((history) => {
    const startDate = dayjs(history.period[0])
    const endDate = history.period[1] ? dayjs(history.period[1]) : dayjs()
    totalMonths += endDate.diff(startDate, 'month') + 1
  })

  if (totalMonths <= 0) return ''

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  const yearText = years > 0 ? `${years}년` : ''
  const monthText = months > 0 ? `${months}개월` : ''

  return `${[yearText, monthText].filter(Boolean).join(' ')}`
}

export const getCompanyPeriodText = (experience: Experience): string => {
  if (!experience.historyList || experience.historyList.length === 0) {
    return ''
  }

  const startDates = experience.historyList.map((h) => dayjs(h.period[0]))
  const earliestStartDate = startDates.reduce((earliest, current) =>
    current.isBefore(earliest) ? current : earliest,
  )

  const endDates = experience.historyList
    .map((h) => h.period[1])
    .filter((d): d is string => !!d)
    .map((d) => dayjs(d))

  const formatDate = (date: dayjs.Dayjs) => date.format('YYYY.MM')
  const startText = formatDate(earliestStartDate)

  if (experience.employmentStatus === 'employed') {
    return `${startText} ~`
  }

  if (endDates.length === 0) {
    return `${startText} ~`
  }

  const latestEndDate = endDates.reduce((latest, current) =>
    current.isAfter(latest) ? current : latest,
  )

  return `${startText} ~ ${formatDate(latestEndDate)}`
}
