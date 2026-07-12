import { describe, expect, it } from 'vitest'

import { canonicalResumeData, getCanonicalResumeData } from './resume-data'

describe('canonical resume data', () => {
  it('기준 JSON의 섹션과 원본 데이터를 무손실로 제공한다', () => {
    expect(canonicalResumeData.sections.map(({ type }) => type)).toEqual([
      'information',
      'introduce',
      'experience',
      'projects',
      'education',
      'activity',
      'licenses',
    ])

    const information = canonicalResumeData.sections.find(
      (section) => section.type === 'information',
    )
    const experience = canonicalResumeData.sections.find((section) => section.type === 'experience')
    const projects = canonicalResumeData.sections.find((section) => section.type === 'projects')
    const education = canonicalResumeData.sections.find((section) => section.type === 'education')
    const activity = canonicalResumeData.sections.find((section) => section.type === 'activity')
    const licenses = canonicalResumeData.sections.find((section) => section.type === 'licenses')

    expect(information?.data.contacts).toHaveLength(2)
    expect(information?.data.contacts.map(({ label }) => label)).toEqual(['메일', '깃허브'])
    expect(experience?.data.items).toHaveLength(5)
    expect(experience?.data.items[0]?.companyName).toBe('라우드')
    expect(experience?.data.items.at(-1)?.companyName).toBe('하이브랩')
    expect(projects?.data.items).toHaveLength(9)
    expect(projects?.data.items[0]?.title).toBe(
      '디어마이홈 서비스 모노레포 전환 및 리뉴얼 프로젝트',
    )
    expect(projects?.data.items.at(-1)).toMatchObject({
      title: '기타 프로젝트',
      companyName: '',
      summary: '',
    })
    expect(education).toMatchObject({ visible: false })
    expect(education?.data.items).toHaveLength(1)
    expect(activity?.data.items).toHaveLength(1)
    expect(activity?.data.items[0]?.summary).toBe('')
    expect(licenses?.data.items).toHaveLength(2)
    expect(canonicalResumeData.skillCatalog).toHaveLength(57)
  })

  it('호출자마다 수정 가능한 새 복사본을 제공한다', () => {
    const first = getCanonicalResumeData()
    first.metadata.title = '변경'

    expect(getCanonicalResumeData().metadata.title).toBe('Resume 편도걸')
  })
})
