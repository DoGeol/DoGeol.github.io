import { z } from 'zod'

const idSchema = z.string().trim().min(1)
const text = (strict: boolean, label: string) =>
  strict ? z.string().trim().min(1, `${label}을 입력해 주세요`) : z.string()
const optionalText = z.string()
const date = (strict: boolean) => (strict ? z.iso.date() : z.union([z.literal(''), z.iso.date()]))
const month = (strict: boolean) =>
  strict
    ? z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    : z.string().regex(/^(|\d{4}-(0[1-9]|1[0-2]))$/)
const assetPath = (strict: boolean) =>
  strict
    ? z
        .string()
        .trim()
        .regex(/^\/(?!\/)(?!.*\.\.).+/)
    : z.union([
        z.literal(''),
        z
          .string()
          .trim()
          .regex(/^\/(?!\/)(?!.*\.\.).+/),
      ])

const templateSchema = z.enum(['classic'])
const sectionTypes = [
  'information',
  'introduce',
  'experience',
  'projects',
  'education',
  'activity',
  'licenses',
] as const
const skillCategorySchema = z.enum([
  'frontend',
  'app',
  'backend',
  'devops',
  'analysis',
  'collaboration',
  'etc',
])
const contactTypeSchema = z.enum(['email', 'tel', 'site', 'github'])
const contactTargetSchema = z.enum(['_self', '_blank'])
const employmentStatusSchema = z.enum(['retired', 'employed', 'recommended-retired'])

const contactValueSchemas = {
  email: z.email(),
  tel: z.string().regex(/^[+0-9][0-9 -]+$/),
  site: z.url().refine((value) => /^https?:\/\//i.test(value)),
  github: z.url().refine((value) => /^https?:\/\//i.test(value)),
} as const

const createContactSchema = (strict: boolean) =>
  z
    .object({
      id: idSchema,
      type: contactTypeSchema,
      label: text(strict, '연락처 라벨'),
      value: text(strict, '연락처'),
      target: contactTargetSchema,
    })
    .strict()
    .superRefine((contact, context) => {
      if (!strict && contact.value === '') return

      if (!contactValueSchemas[contact.type].safeParse(contact.value).success) {
        context.addIssue({
          code: 'custom',
          message: `유효한 ${contact.type} 연락처를 입력해 주세요`,
          path: ['value'],
        })
      }
    })

const createTextItemSchema = (strict: boolean, label: string) =>
  z
    .object({
      id: idSchema,
      text: text(strict, label),
    })
    .strict()

const createSkillReferenceSchema = (strict: boolean) =>
  z
    .object({
      id: idSchema,
      skillId: text(strict, '기술'),
    })
    .strict()

const createResumeSchema = ({ strict }: { strict: boolean }) => {
  const contactSchema = createContactSchema(strict)
  const paragraphSchema = createTextItemSchema(strict, '소개 문단')
  const summarySchema = createTextItemSchema(strict, '요약')
  const workDetailSchema = createTextItemSchema(strict, '업무 내용')
  const skillReferenceSchema = createSkillReferenceSchema(strict)

  const informationSectionSchema = z
    .object({
      id: idSchema,
      type: z.literal('information'),
      visible: z.boolean(),
      data: z
        .object({
          headline: text(strict, '헤드라인'),
          contacts: z.array(contactSchema),
        })
        .strict(),
    })
    .strict()

  const introduceSectionSchema = z
    .object({
      id: idSchema,
      type: z.literal('introduce'),
      visible: z.boolean(),
      data: z
        .object({
          paragraphs: z.array(paragraphSchema),
          updatedAt: date(strict),
        })
        .strict(),
    })
    .strict()

  const experienceSectionSchema = z
    .object({
      id: idSchema,
      type: z.literal('experience'),
      visible: z.boolean(),
      data: z
        .object({
          showTotalPeriod: z.boolean(),
          items: z.array(
            z
              .object({
                id: idSchema,
                companyName: text(strict, '회사명'),
                logoPath: assetPath(strict),
                serviceSummary: z.array(summarySchema),
                experienceSummary: z.array(summarySchema),
                employmentStatus: employmentStatusSchema,
                histories: z.array(
                  z
                    .object({
                      id: idSchema,
                      department: text(strict, '부서명'),
                      role: text(strict, '역할'),
                      startDate: date(strict),
                      endDate: z.union([date(strict), z.null()]),
                      works: z.array(workDetailSchema),
                      skills: z.array(skillReferenceSchema),
                    })
                    .strict(),
                ),
              })
              .strict(),
          ),
        })
        .strict(),
    })
    .strict()

  const projectsSectionSchema = z
    .object({
      id: idSchema,
      type: z.literal('projects'),
      visible: z.boolean(),
      data: z
        .object({
          items: z.array(
            z
              .object({
                id: idSchema,
                title: text(strict, '프로젝트명'),
                startMonth: month(strict),
                endMonth: z.union([month(strict), z.null()]),
                companyName: optionalText,
                summary: optionalText,
                works: z.array(
                  z
                    .object({
                      id: idSchema,
                      title: text(strict, '프로젝트 역할'),
                      details: z.array(workDetailSchema),
                    })
                    .strict(),
                ),
              })
              .strict(),
          ),
        })
        .strict(),
    })
    .strict()

  const educationSectionSchema = z
    .object({
      id: idSchema,
      type: z.literal('education'),
      visible: z.boolean(),
      data: z
        .object({
          items: z.array(
            z
              .object({
                id: idSchema,
                school: text(strict, '학교명'),
                startMonth: month(strict),
                endMonth: z.union([month(strict), z.null()]),
                graduated: z.boolean(),
                major: text(strict, '전공'),
                summary: text(strict, '학력 요약'),
              })
              .strict(),
          ),
        })
        .strict(),
    })
    .strict()

  const activitySectionSchema = z
    .object({
      id: idSchema,
      type: z.literal('activity'),
      visible: z.boolean(),
      data: z
        .object({
          items: z.array(
            z
              .object({
                id: idSchema,
                title: text(strict, '활동명'),
                startMonth: month(strict),
                endMonth: z.union([month(strict), z.null()]),
                summary: optionalText,
              })
              .strict(),
          ),
        })
        .strict(),
    })
    .strict()

  const licensesSectionSchema = z
    .object({
      id: idSchema,
      type: z.literal('licenses'),
      visible: z.boolean(),
      data: z
        .object({
          items: z.array(
            z
              .object({
                id: idSchema,
                title: text(strict, '자격증명'),
                acquiredAt: date(strict),
                issuer: text(strict, '발급 기관'),
              })
              .strict(),
          ),
        })
        .strict(),
    })
    .strict()

  const sectionSchema = z.discriminatedUnion('type', [
    informationSectionSchema,
    introduceSectionSchema,
    experienceSectionSchema,
    projectsSectionSchema,
    educationSectionSchema,
    activitySectionSchema,
    licensesSectionSchema,
  ])

  return z
    .object({
      schemaVersion: z.literal(1),
      templateId: templateSchema,
      metadata: z
        .object({
          title: text(strict, '문서 제목'),
          socialTitle: text(strict, '소셜 제목'),
          description: text(strict, '설명'),
        })
        .strict(),
      assets: z
        .object({
          profileFront: assetPath(strict),
          profileBack: assetPath(strict),
        })
        .strict(),
      skillCatalog: z.array(
        z
          .object({
            id: idSchema,
            label: text(strict, '기술명'),
            category: skillCategorySchema,
          })
          .strict(),
      ),
      sections: z.array(sectionSchema),
    })
    .strict()
    .superRefine((resume, context) => {
      for (const sectionType of sectionTypes) {
        const matchingIndices = resume.sections.flatMap((section, index) =>
          section.type === sectionType ? [index] : [],
        )

        if (matchingIndices.length === 0) {
          context.addIssue({
            code: 'custom',
            message: `section type ${sectionType} 누락`,
            path: ['sections'],
          })
        }

        for (const duplicateIndex of matchingIndices.slice(1)) {
          context.addIssue({
            code: 'custom',
            message: `section type ${sectionType} 중복`,
            path: ['sections', duplicateIndex, 'type'],
          })
        }
      }

      const idPaths = new Map<string, (string | number)[]>()
      const addId = (id: string, path: (string | number)[]) => {
        const firstPath = idPaths.get(id)
        if (firstPath) {
          context.addIssue({
            code: 'custom',
            message: `ID ${id} 중복 (${firstPath.join('.')})`,
            path,
          })
          return
        }

        idPaths.set(id, path)
      }

      resume.skillCatalog.forEach((skill, skillIndex) => {
        addId(skill.id, ['skillCatalog', skillIndex, 'id'])
      })

      const catalogIds = new Set(resume.skillCatalog.map((skill) => skill.id))

      resume.sections.forEach((section, sectionIndex) => {
        const sectionPath = ['sections', sectionIndex] as const
        addId(section.id, [...sectionPath, 'id'])

        switch (section.type) {
          case 'information':
            section.data.contacts.forEach((contact, contactIndex) => {
              addId(contact.id, [...sectionPath, 'data', 'contacts', contactIndex, 'id'])
            })
            break

          case 'introduce':
            section.data.paragraphs.forEach((paragraph, paragraphIndex) => {
              addId(paragraph.id, [...sectionPath, 'data', 'paragraphs', paragraphIndex, 'id'])
            })
            break

          case 'experience':
            section.data.items.forEach((experience, experienceIndex) => {
              const experiencePath = [...sectionPath, 'data', 'items', experienceIndex]
              addId(experience.id, [...experiencePath, 'id'])
              experience.serviceSummary.forEach((summary, summaryIndex) => {
                addId(summary.id, [...experiencePath, 'serviceSummary', summaryIndex, 'id'])
              })
              experience.experienceSummary.forEach((summary, summaryIndex) => {
                addId(summary.id, [...experiencePath, 'experienceSummary', summaryIndex, 'id'])
              })
              experience.histories.forEach((history, historyIndex) => {
                const historyPath = [...experiencePath, 'histories', historyIndex]
                addId(history.id, [...historyPath, 'id'])

                if (strict && history.endDate !== null && history.startDate > history.endDate) {
                  context.addIssue({
                    code: 'custom',
                    message: '종료일은 시작일보다 빠를 수 없습니다',
                    path: [...historyPath, 'endDate'],
                  })
                }

                history.works.forEach((work, workIndex) => {
                  addId(work.id, [...historyPath, 'works', workIndex, 'id'])
                })
                history.skills.forEach((skill, skillIndex) => {
                  const skillPath = [...historyPath, 'skills', skillIndex]
                  addId(skill.id, [...skillPath, 'id'])
                  if (strict && !catalogIds.has(skill.skillId)) {
                    context.addIssue({
                      code: 'custom',
                      message: '등록되지 않은 기술입니다',
                      path: [...skillPath, 'skillId'],
                    })
                  }
                })
              })
            })
            break

          case 'projects':
            section.data.items.forEach((project, projectIndex) => {
              const projectPath = [...sectionPath, 'data', 'items', projectIndex]
              addId(project.id, [...projectPath, 'id'])
              if (strict && project.endMonth !== null && project.startMonth > project.endMonth) {
                context.addIssue({
                  code: 'custom',
                  message: '종료월은 시작월보다 빠를 수 없습니다',
                  path: [...projectPath, 'endMonth'],
                })
              }
              project.works.forEach((work, workIndex) => {
                const workPath = [...projectPath, 'works', workIndex]
                addId(work.id, [...workPath, 'id'])
                work.details.forEach((detail, detailIndex) => {
                  addId(detail.id, [...workPath, 'details', detailIndex, 'id'])
                })
              })
            })
            break

          case 'education':
            section.data.items.forEach((education, educationIndex) => {
              const educationPath = [...sectionPath, 'data', 'items', educationIndex]
              addId(education.id, [...educationPath, 'id'])
              if (
                strict &&
                education.endMonth !== null &&
                education.startMonth > education.endMonth
              ) {
                context.addIssue({
                  code: 'custom',
                  message: '종료월은 시작월보다 빠를 수 없습니다',
                  path: [...educationPath, 'endMonth'],
                })
              }
            })
            break

          case 'activity':
            section.data.items.forEach((activity, activityIndex) => {
              const activityPath = [...sectionPath, 'data', 'items', activityIndex]
              addId(activity.id, [...activityPath, 'id'])
              if (strict && activity.endMonth !== null && activity.startMonth > activity.endMonth) {
                context.addIssue({
                  code: 'custom',
                  message: '종료월은 시작월보다 빠를 수 없습니다',
                  path: [...activityPath, 'endMonth'],
                })
              }
            })
            break

          case 'licenses':
            section.data.items.forEach((license, licenseIndex) => {
              addId(license.id, [...sectionPath, 'data', 'items', licenseIndex, 'id'])
            })
            break
        }
      })
    })
}

export const resumeDraftSchema = createResumeSchema({ strict: false })
export const resumeSchema = createResumeSchema({ strict: true })
export type ResumeDraft = z.infer<typeof resumeDraftSchema>
export type ResumeData = z.infer<typeof resumeSchema>
export type ResumeSection = ResumeData['sections'][number]
export type ResumeSectionType = ResumeSection['type']
export type ResumeTemplateId = ResumeData['templateId']
export type SkillDefinition = ResumeData['skillCatalog'][number]
export type SkillCategory = SkillDefinition['category']
export type InformationSection = Extract<ResumeSection, { type: 'information' }>
export type IntroduceSection = Extract<ResumeSection, { type: 'introduce' }>
export type ExperienceSection = Extract<ResumeSection, { type: 'experience' }>
export type ProjectsSection = Extract<ResumeSection, { type: 'projects' }>
export type EducationSection = Extract<ResumeSection, { type: 'education' }>
export type ActivitySection = Extract<ResumeSection, { type: 'activity' }>
export type LicensesSection = Extract<ResumeSection, { type: 'licenses' }>
export type ResumeTextItem = IntroduceSection['data']['paragraphs'][number]
export type ResumeSkillReference =
  ExperienceSection['data']['items'][number]['histories'][number]['skills'][number]
