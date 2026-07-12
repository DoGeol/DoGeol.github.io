import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

type SectionOf<Type extends ResumeDraft['sections'][number]['type']> = Extract<
  ResumeDraft['sections'][number],
  { type: Type }
>

type Experience = SectionOf<'experience'>['data']['items'][number]
type History = Experience['histories'][number]
type Project = SectionOf<'projects'>['data']['items'][number]

type DefaultItemByType = {
  text: SectionOf<'introduce'>['data']['paragraphs'][number]
  contact: SectionOf<'information'>['data']['contacts'][number]
  'catalog-skill': ResumeDraft['skillCatalog'][number]
  experience: Experience
  history: History
  project: Project
  'project-work': Project['works'][number]
  education: SectionOf<'education'>['data']['items'][number]
  activity: SectionOf<'activity'>['data']['items'][number]
  license: SectionOf<'licenses'>['data']['items'][number]
}

type CreateId = () => string

const createUuid = () => crypto.randomUUID()

export function createDefaultItem<Type extends keyof DefaultItemByType>(
  type: Type,
  createId?: CreateId,
): DefaultItemByType[Type]
export function createDefaultItem(
  type: keyof DefaultItemByType,
  createId: CreateId = createUuid,
): DefaultItemByType[keyof DefaultItemByType] {
  const id = createId()

  switch (type) {
    case 'text':
      return { id, text: '' }
    case 'contact':
      return {
        id,
        type: 'email',
        label: '',
        value: '',
        target: '_self',
      }
    case 'catalog-skill':
      return { id, label: '', category: 'frontend' }
    case 'experience':
      return {
        id,
        companyName: '',
        logoPath: '',
        serviceSummary: [],
        experienceSummary: [],
        employmentStatus: 'employed',
        histories: [],
      }
    case 'history':
      return {
        id,
        department: '',
        role: '',
        startDate: '',
        endDate: null,
        works: [],
        skills: [],
      }
    case 'project':
      return {
        id,
        title: '',
        startMonth: '',
        endMonth: null,
        companyName: '',
        summary: '',
        works: [],
      }
    case 'project-work':
      return { id, title: '', details: [] }
    case 'education':
      return {
        id,
        school: '',
        startMonth: '',
        endMonth: null,
        graduated: false,
        major: '',
        summary: '',
      }
    case 'activity':
      return {
        id,
        title: '',
        startMonth: '',
        endMonth: null,
        summary: '',
      }
    case 'license':
      return { id, title: '', acquiredAt: '', issuer: '' }
  }
}

export const createSkillReference = (
  skillId: string,
  createId: CreateId = createUuid,
): History['skills'][number] => ({
  id: createId(),
  skillId,
})
