import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

export const createResumeFixture = (): ResumeDraft => ({
  schemaVersion: 1,
  templateId: 'classic',
  metadata: {
    title: 'Resume 테스트',
    socialTitle: '개발자 테스트 이력서',
    description: '테스트 이력서입니다.',
  },
  assets: {
    profileFront: '/profile/pdg-real.webp',
    profileBack: '/profile/pdg-profile.webp',
  },
  skillCatalog: [{ id: 'typescript', label: 'TypeScript', category: 'frontend' }],
  sections: [
    {
      id: 'section-information',
      type: 'information',
      visible: true,
      data: {
        headline: '안녕하세요.\n개발자 **테스트**입니다.',
        contacts: [
          {
            id: 'contact-email',
            type: 'email',
            label: '메일',
            value: 'test@example.com',
            target: '_self',
          },
        ],
      },
    },
    {
      id: 'section-introduce',
      type: 'introduce',
      visible: true,
      data: {
        paragraphs: [{ id: 'paragraph-1', text: '소개' }],
        updatedAt: '2026-07-12',
      },
    },
    {
      id: 'section-experience',
      type: 'experience',
      visible: true,
      data: {
        showTotalPeriod: true,
        items: [
          {
            id: 'experience-1',
            companyName: '회사',
            logoPath: '/company/logo/laud.webp',
            serviceSummary: [{ id: 'service-summary-1', text: '서비스' }],
            experienceSummary: [{ id: 'experience-summary-1', text: '경험' }],
            employmentStatus: 'retired',
            histories: [
              {
                id: 'history-1',
                department: '개발팀',
                role: '개발자',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                works: [{ id: 'history-work-1', text: '업무' }],
                skills: [{ id: 'history-skill-1', skillId: 'typescript' }],
              },
            ],
          },
        ],
      },
    },
    {
      id: 'section-projects',
      type: 'projects',
      visible: true,
      data: {
        items: [
          {
            id: 'project-1',
            title: '프로젝트',
            startMonth: '2024-01',
            endMonth: '2024-02',
            companyName: '회사',
            summary: '요약',
            works: [
              {
                id: 'project-work-1',
                title: '역할',
                details: [{ id: 'project-detail-1', text: '상세' }],
              },
            ],
          },
        ],
      },
    },
    {
      id: 'section-education',
      type: 'education',
      visible: true,
      data: {
        items: [
          {
            id: 'education-1',
            school: '학교',
            startMonth: '2018-01',
            endMonth: '2020-01',
            graduated: true,
            major: '전공',
            summary: '요약',
          },
        ],
      },
    },
    {
      id: 'section-activity',
      type: 'activity',
      visible: true,
      data: {
        items: [
          {
            id: 'activity-1',
            title: '활동',
            startMonth: '2020-01',
            endMonth: '2020-02',
            summary: '요약',
          },
        ],
      },
    },
    {
      id: 'section-licenses',
      type: 'licenses',
      visible: true,
      data: {
        items: [
          {
            id: 'license-1',
            title: '자격증',
            acquiredAt: '2020-06-26',
            issuer: '기관',
          },
        ],
      },
    },
  ],
})
