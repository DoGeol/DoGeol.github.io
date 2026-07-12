import { readFileSync } from 'node:fs'
import path from 'node:path'

import { zodResolver } from '@hookform/resolvers/zod'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { resumeSchema, type ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { buildEditorRegionIndex } from '@/app/(dev)/resume-editor/_model/editor-region-index'
import { createResumeFixture } from '@/test/fixtures/resume'

import { NullableDateField } from '../fields/nullable-date-field'
import { RepeatableTextField } from '../fields/repeatable-text-field'
import { TextField } from '../fields/text-field'
import { DocumentSettingsEditor } from '../document-settings-editor'
import { SectionEditorList } from './section-editor-list'
import { isUntouchedDefaultItem } from './section-editor-helpers'
import { createDefaultItem } from '../../_model/default-items'

type HarnessProps = {
  children: React.ReactNode
  draft?: ResumeDraft
  onForm: (form: UseFormReturn<ResumeDraft>) => void
}

function Harness({ children, draft = createResumeFixture(), onForm }: HarnessProps) {
  const form = useForm<ResumeDraft>({
    defaultValues: draft,
    resolver: zodResolver(resumeSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    onForm(form)
  }, [form, onForm])

  return <FormProvider {...form}>{children}</FormProvider>
}

const renderField = (children: React.ReactNode, draft = createResumeFixture()) => {
  let form: UseFormReturn<ResumeDraft> | undefined
  render(
    <Harness
      draft={draft}
      onForm={(value) => {
        form = value
      }}
    >
      {children}
    </Harness>,
  )
  return () => {
    if (form === undefined) throw new Error('form이 준비되지 않았습니다')
    return form
  }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('section editor field primitives', () => {
  it('field error와 object array 경계를 path-local API로 구독한다', () => {
    const readSource = (relativePath: string) =>
      readFileSync(path.join(process.cwd(), relativePath), 'utf8')
    const fieldShell = readSource('src/app/(dev)/resume-editor/_components/fields/field-shell.tsx')
    const helpers = readSource(
      'src/app/(dev)/resume-editor/_components/section-editors/section-editor-helpers.tsx',
    )
    const repeatable = readSource(
      'src/app/(dev)/resume-editor/_components/fields/repeatable-text-field.tsx',
    )
    const skillReferences = readSource(
      'src/app/(dev)/resume-editor/_components/fields/skill-reference-field.tsx',
    )

    expect(fieldShell).toContain('useFormState')
    expect(fieldShell).toContain('exact: true')
    expect(helpers).not.toContain('name as FieldArrayPath')
    expect(repeatable).not.toContain('name as FieldArrayPath')
    expect(skillReferences).not.toContain('name as FieldArrayPath')
  })

  it('text와 textarea 변경을 RHF 값에 즉시 반영한다', async () => {
    const user = userEvent.setup()
    const getForm = renderField(
      <>
        <TextField name="metadata.title" label="문서 제목" />
        <TextField name="metadata.description" label="문서 설명" multiline />
      </>,
    )

    await user.clear(screen.getByRole('textbox', { name: '문서 제목' }))
    await user.type(screen.getByRole('textbox', { name: '문서 제목' }), '새 제목')
    await user.clear(screen.getByRole('textbox', { name: '문서 설명' }))
    await user.type(screen.getByRole('textbox', { name: '문서 설명' }), '새 설명')

    expect(getForm().getValues('metadata')).toMatchObject({
      title: '새 제목',
      description: '새 설명',
    })
  })

  it('repeatable text를 stable JSON ID와 함께 추가, 수정, 삭제한다', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const getForm = renderField(
      <RepeatableTextField
        name="sections.1.data.paragraphs"
        label="소개 문단"
        addLabel="문단 추가"
      />,
    )

    await user.click(screen.getByRole('button', { name: '문단 추가' }))
    const inputs = screen.getAllByRole('textbox', { name: '소개 문단' })
    await user.type(inputs[1]!, '추가 소개')
    const added = getForm().getValues('sections.1.data.paragraphs')[1]
    expect(added).toMatchObject({ text: '추가 소개' })
    expect(added?.id).toEqual(expect.any(String))

    await user.click(screen.getAllByRole('button', { name: '소개 문단 삭제' })[1]!)
    expect(getForm().getValues('sections.1.data.paragraphs')).toHaveLength(1)
  })

  it('repeatable text의 지역 값 변경으로 sortable label을 즉시 갱신한다', async () => {
    const user = userEvent.setup()
    renderField(
      <RepeatableTextField
        name="sections.1.data.paragraphs"
        label="소개 문단"
        addLabel="문단 추가"
      />,
    )

    const paragraph = screen.getByRole('textbox', { name: '소개 문단' })
    await user.clear(paragraph)
    await user.type(paragraph, '지역 구독 소개')

    expect(screen.getByRole('button', { name: '지역 구독 소개 순서 변경' })).toBeInTheDocument()
  })

  it('nullable 종료일을 null과 마지막 값 사이에서 전환한다', async () => {
    const user = userEvent.setup()
    const getForm = renderField(
      <NullableDateField
        name="sections.2.data.items.0.histories.0.endDate"
        label="종료일"
        inputType="date"
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: '현재 진행 중' }))
    expect(getForm().getValues('sections.2.data.items.0.histories.0.endDate')).toBeNull()
    await user.click(screen.getByRole('checkbox', { name: '현재 진행 중' }))
    expect(getForm().getValues('sections.2.data.items.0.histories.0.endDate')).toBe('2024-12-31')
  })

  it('잘못된 field를 inline error ID와 연결한다', async () => {
    const getForm = renderField(<TextField name="metadata.title" label="문서 제목" />)
    getForm().setValue('metadata.title', '')
    await getForm().trigger('metadata.title')

    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: '문서 제목' })).toHaveAttribute(
        'aria-invalid',
        'true',
      ),
    )
    const input = screen.getByRole('textbox', { name: '문서 제목' })
    expect(input).toHaveAttribute('aria-describedby', 'field-metadata-title-error')
    expect(document.getElementById('field-metadata-title-error')).toHaveTextContent(
      '문서 제목을 입력해 주세요',
    )
  })
})

describe('SectionEditorList', () => {
  function EditorUnderTest({
    selectedRegionId,
    onSelectedRegionChange,
    initiallyOpenSectionIds,
  }: {
    selectedRegionId: string
    onSelectedRegionChange: (id: string) => void
    initiallyOpenSectionIds?: string[]
  }) {
    const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(
      () =>
        new Set(
          initiallyOpenSectionIds ??
            (selectedRegionId.startsWith('section-') ? [selectedRegionId] : []),
        ),
    )
    return (
      <>
        <DocumentSettingsEditor
          selectedRegionId={selectedRegionId}
          onSelectedRegionChange={onSelectedRegionChange}
        />
        <SectionEditorList
          selectedRegionId={selectedRegionId}
          onSelectedRegionChange={onSelectedRegionChange}
          openSectionIds={openSectionIds}
          onOpenSectionIdsChange={setOpenSectionIds}
        />
      </>
    )
  }

  const renderEditor = (
    selectedRegionId = 'section-information',
    draft = createResumeFixture(),
    initiallyOpenSectionIds?: string[],
  ) => {
    let form: UseFormReturn<ResumeDraft> | undefined
    const onSelectedRegionChange = vi.fn()
    render(
      <Harness
        draft={draft}
        onForm={(value) => {
          form = value
        }}
      >
        <EditorUnderTest
          selectedRegionId={selectedRegionId}
          onSelectedRegionChange={onSelectedRegionChange}
          initiallyOpenSectionIds={initiallyOpenSectionIds}
        />
      </Harness>,
    )
    return {
      getDraft: () => {
        if (form === undefined) throw new Error('form이 준비되지 않았습니다')
        return form.getValues()
      },
      onSelectedRegionChange,
    }
  }

  const openSkillCatalog = async (user: ReturnType<typeof userEvent.setup>) => {
    const opener = screen.queryByRole('button', { name: /기술 목록 \d+개 열기/ })
    if (opener !== null) await user.click(opener)
  }

  const openFirstSkillPicker = async (user: ReturnType<typeof userEvent.setup>) => {
    const opener = screen.queryAllByRole('button', { name: '기술 선택기 열기' })[0]
    if (opener !== undefined) await user.click(opener)
  }

  it('일곱 section heading, 표시 switch, 독립 accordion을 제공한다', async () => {
    const user = userEvent.setup()
    renderEditor()

    for (const label of ['기본 정보', '소개', '경력', '프로젝트', '학력', '활동', '자격증']) {
      expect(screen.getByRole('heading', { name: label })).toBeInTheDocument()
      expect(screen.getByRole('switch', { name: `${label} 표시` })).toBeInTheDocument()
    }

    const experienceToggle = screen.getByRole('button', { name: '경력' })
    expect(experienceToggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(experienceToggle)
    expect(experienceToggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('opaque stable ID와 DOM-local accordion linkage ID를 분리한다', () => {
    const draft = createResumeFixture()
    const opaqueSectionId = 'career section:/opaque?x=1'
    draft.sections[2]!.id = opaqueSectionId
    renderEditor(opaqueSectionId, draft, [opaqueSectionId])

    const toggle = screen.getByRole('button', { name: '경력' })
    const controlledId = toggle.getAttribute('aria-controls')
    expect(controlledId).not.toBeNull()
    expect(controlledId).not.toContain(opaqueSectionId)
    expect(document.getElementById(controlledId!)).not.toBeNull()
    expect(document.querySelector('[data-editor-region-id]')).not.toBeNull()
    expect(
      Array.from(document.querySelectorAll<HTMLElement>('[data-editor-region-id]')).find(
        (element) => element.dataset.editorRegionId === opaqueSectionId,
      ),
    ).toHaveAttribute('data-editor-region-id', opaqueSectionId)
  })

  it('section 표시 변경과 회사 추가를 반영하고 새 회사명에 focus한다', async () => {
    const user = userEvent.setup()
    const { getDraft } = renderEditor('section-experience')

    await user.click(screen.getByRole('switch', { name: '경력 표시' }))
    expect(getDraft().sections[2]?.visible).toBe(false)

    await user.click(screen.getByRole('button', { name: '회사 추가' }))
    const experience = getDraft().sections[2]
    if (experience?.type !== 'experience') throw new Error('경력 section이 없습니다')
    expect(experience.data.items).toHaveLength(2)
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName('회사명'))
  })

  it('열린 section의 지역 값 변경으로 item label을 즉시 갱신한다', async () => {
    const user = userEvent.setup()
    renderEditor('section-experience')
    const companyName = screen.getByRole('textbox', { name: '회사명' })

    await user.clear(companyName)
    await user.type(companyName, '지역 구독 회사')

    expect(screen.getByRole('button', { name: '지역 구독 회사 회사 삭제' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '지역 구독 회사 순서 변경' })).toBeInTheDocument()
  })

  it('section을 keyboard로 이동해도 stable selection을 유지하고 최신 path를 계산한다', async () => {
    const user = userEvent.setup()
    const { getDraft, onSelectedRegionChange } = renderEditor('section-experience')
    await user.click(screen.getByRole('button', { name: '경력' }))
    onSelectedRegionChange.mockClear()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const handle = this.matches('[aria-roledescription="sortable"]')
        ? this
        : this.querySelector<HTMLElement>('[aria-roledescription="sortable"]')
      const handles = Array.from(
        document.querySelectorAll<HTMLElement>('[aria-roledescription="sortable"]'),
      )
      return new DOMRect(0, Math.max(handles.indexOf(handle!), 0) * 50, 100, 40)
    })
    const handle = screen.getByRole('button', { name: '경력 순서 변경' })
    handle.focus()

    await user.keyboard('[Space]')
    await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'))
    await user.keyboard('[ArrowUp][ArrowDown]')
    await user.keyboard('[Space]')

    expect(getDraft().sections.map(({ type }) => type)).toEqual([
      'information',
      'experience',
      'introduce',
      'projects',
      'education',
      'activity',
      'licenses',
    ])
    expect(onSelectedRegionChange).not.toHaveBeenCalled()
    expect(buildEditorRegionIndex(getDraft()).get('section-experience')).toBe('sections.1')
  })

  it('모든 object field array를 부모별 독립 container에서 keyboard로 이동한다', async () => {
    const draft = createResumeFixture()
    draft.skillCatalog.push({ id: 'react', label: 'React', category: 'frontend' })
    const information = draft.sections[0]
    const introduce = draft.sections[1]
    const experience = draft.sections[2]
    const projects = draft.sections[3]
    const education = draft.sections[4]
    const activity = draft.sections[5]
    const licenses = draft.sections[6]
    if (
      information?.type !== 'information' ||
      introduce?.type !== 'introduce' ||
      experience?.type !== 'experience' ||
      projects?.type !== 'projects' ||
      education?.type !== 'education' ||
      activity?.type !== 'activity' ||
      licenses?.type !== 'licenses'
    )
      throw new Error('fixture section 구성이 올바르지 않습니다')

    information.data.contacts.push({
      id: 'contact-github',
      type: 'github',
      label: 'GitHub',
      value: 'test',
      target: '_blank',
    })
    introduce.data.paragraphs[0]!.text = '소개 문단 하나'
    introduce.data.paragraphs.push({ id: 'paragraph-2', text: '두번째 소개' })
    const company = experience.data.items[0]!
    company.serviceSummary.push({ id: 'service-summary-2', text: '서비스 둘' })
    company.experienceSummary.push({ id: 'experience-summary-2', text: '경험 둘' })
    const history = company.histories[0]!
    history.works.push({ id: 'history-work-2', text: '업무 둘' })
    history.skills.push({ id: 'history-skill-2', skillId: 'react' })
    company.histories.push({
      ...structuredClone(history),
      id: 'history-2',
      department: '플랫폼팀',
      works: [{ id: 'history-2-work-1', text: '플랫폼 업무' }],
      skills: [{ id: 'history-2-skill-1', skillId: 'react' }],
    })
    experience.data.items.push({
      ...structuredClone(company),
      id: 'experience-2',
      companyName: '회사 둘',
      serviceSummary: [{ id: 'experience-2-service-1', text: '두번째 서비스' }],
      experienceSummary: [{ id: 'experience-2-summary-1', text: '두번째 경험' }],
      histories: [],
    })
    const project = projects.data.items[0]!
    project.title = '프로젝트 하나'
    const projectWork = project.works[0]!
    projectWork.details.push({ id: 'project-detail-2', text: '상세 둘' })
    project.works.push({
      id: 'project-work-2',
      title: '역할 둘',
      details: [{ id: 'project-work-2-detail-1', text: '역할 둘 상세' }],
    })
    projects.data.items.push({
      ...structuredClone(project),
      id: 'project-2',
      title: '프로젝트 둘',
      works: [],
    })
    education.data.items.push({
      ...structuredClone(education.data.items[0]!),
      id: 'education-2',
      school: '학교 둘',
    })
    activity.data.items.push({
      ...structuredClone(activity.data.items[0]!),
      id: 'activity-2',
      title: '활동 둘',
    })
    activity.data.items[0]!.title = '활동 하나'
    licenses.data.items.push({
      ...structuredClone(licenses.data.items[0]!),
      id: 'license-2',
      title: '자격증 둘',
    })
    licenses.data.items[0]!.title = '자격증 하나'

    const { getDraft } = renderEditor(
      'section-information',
      draft,
      draft.sections.map(({ id }) => id),
    )
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const ownHandle = this.matches('[aria-roledescription="sortable"]')
        ? this
        : this.querySelector<HTMLElement>('[aria-roledescription="sortable"]')
      const handles = Array.from(
        document.querySelectorAll<HTMLElement>('[aria-roledescription="sortable"]'),
      )
      return new DOMRect(0, Math.max(handles.indexOf(ownHandle!), 0) * 50, 100, 40)
    })
    const get = () => getDraft()
    const getSection = <Type extends ResumeDraft['sections'][number]['type']>(type: Type) => {
      const section = get().sections.find((candidate) => candidate.type === type)
      if (section === undefined) throw new Error(`${type} section이 없습니다`)
      return section as Extract<ResumeDraft['sections'][number], { type: Type }>
    }
    const getCompany = () => {
      const company = getSection('experience').data.items.find(({ id }) => id === 'experience-1')
      if (company === undefined) throw new Error('experience-1 회사가 없습니다')
      return company
    }
    const getHistory = () => {
      const history = getCompany().histories.find(({ id }) => id === 'history-1')
      if (history === undefined) throw new Error('history-1 경력이 없습니다')
      return history
    }
    const getProject = () => {
      const project = getSection('projects').data.items.find(({ id }) => id === 'project-1')
      if (project === undefined) throw new Error('project-1 프로젝트가 없습니다')
      return project
    }
    const getProjectWork = () => {
      const work = getProject().works.find(({ id }) => id === 'project-work-1')
      if (work === undefined) throw new Error('project-work-1 업무가 없습니다')
      return work
    }
    const snapshot = () => ({
      skillCatalog: get().skillCatalog.map(({ id }) => id),
      contacts: getSection('information').data.contacts.map(({ id }) => id),
      paragraphs: getSection('introduce').data.paragraphs.map(({ id }) => id),
      serviceSummary: getCompany().serviceSummary.map(({ id }) => id),
      experienceSummary: getCompany().experienceSummary.map(({ id }) => id),
      historyWorks: getHistory().works.map(({ id }) => id),
      historySkills: getHistory().skills.map(({ id }) => id),
      histories: getCompany().histories.map(({ id }) => id),
      companies: getSection('experience').data.items.map(({ id }) => id),
      projectDetails: getProjectWork().details.map(({ id }) => id),
      projectWorks: getProject().works.map(({ id }) => id),
      projects: getSection('projects').data.items.map(({ id }) => id),
      education: getSection('education').data.items.map(({ id }) => id),
      activity: getSection('activity').data.items.map(({ id }) => id),
      licenses: getSection('licenses').data.items.map(({ id }) => id),
    })
    type SnapshotKey = keyof ReturnType<typeof snapshot>
    const moves: Array<{ key: SnapshotKey; name: string }> = [
      { key: 'skillCatalog', name: 'TypeScript 기술 순서 변경' },
      {
        key: 'contacts',
        name: '메일 순서 변경',
      },
      {
        key: 'paragraphs',
        name: '소개 문단 하나 순서 변경',
      },
      {
        key: 'serviceSummary',
        name: '서비스 순서 변경',
      },
      {
        key: 'experienceSummary',
        name: '경험 순서 변경',
      },
      {
        key: 'historyWorks',
        name: '업무 순서 변경',
      },
      {
        key: 'historySkills',
        name: 'TypeScript 사용 기술 순서 변경',
      },
      {
        key: 'histories',
        name: '개발팀 순서 변경',
      },
      {
        key: 'companies',
        name: '회사 순서 변경',
      },
      {
        key: 'projectDetails',
        name: '상세 순서 변경',
      },
      {
        key: 'projectWorks',
        name: '역할 순서 변경',
      },
      {
        key: 'projects',
        name: '프로젝트 하나 순서 변경',
      },
      { key: 'education', name: '학교 순서 변경' },
      {
        key: 'activity',
        name: '활동 하나 순서 변경',
      },
      {
        key: 'licenses',
        name: '자격증 하나 순서 변경',
      },
    ]
    const user = userEvent.setup()
    await openSkillCatalog(user)
    for (const move of moves) {
      const before = snapshot()
      expect(before[move.key]).toHaveLength(2)
      const handle = screen.getByRole('button', { name: move.name })
      handle.focus()
      await user.keyboard('[Space][ArrowDown][Space]')
      const after = snapshot()
      expect(after[move.key]).toEqual([before[move.key][1], before[move.key][0]])
      for (const key of Object.keys(before) as SnapshotKey[]) {
        if (key !== move.key) expect(after[key]).toEqual(before[key])
      }
    }
  })

  it('각 object array의 추가가 대응 배열만 변경한다', async () => {
    const user = userEvent.setup()
    const { getDraft } = renderEditor('section-information')
    const before = structuredClone(getDraft())

    await user.click(screen.getByRole('button', { name: '연락처 추가' }))
    const information = getDraft().sections[0]
    if (information?.type !== 'information') throw new Error('기본 정보 section이 없습니다')
    expect(information.data.contacts).toHaveLength(2)
    expect(getDraft().sections.slice(1)).toEqual(before.sections.slice(1))
    await user.click(screen.getByRole('button', { name: '연락처 삭제' }))
    expect(information.data.contacts).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: '소개' }))
    await user.click(screen.getByRole('button', { name: '문단 추가' }))
    const introduce = getDraft().sections[1]
    if (introduce?.type !== 'introduce') throw new Error('소개 section이 없습니다')
    expect(introduce.data.paragraphs).toHaveLength(2)
  })

  it('기술, 회사 상세, 프로젝트 업무, 학력, 활동, 자격증 배열을 각각 추가하고 빈 항목은 즉시 삭제한다', async () => {
    const user = userEvent.setup()
    const { getDraft } = renderEditor('section-experience')

    await openSkillCatalog(user)
    await user.click(screen.getByRole('button', { name: '기술 추가' }))
    expect(getDraft().skillCatalog).toHaveLength(2)
    expect(getDraft().skillCatalog[1]?.id).toEqual(expect.any(String))
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const skillDeleteButtons = screen.getAllByRole('button', { name: /기술 삭제/ })
    await user.click(skillDeleteButtons[skillDeleteButtons.length - 1]!)
    expect(getDraft().skillCatalog).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: '경력 상세 추가' }))
    let experience = getDraft().sections[2]
    if (experience?.type !== 'experience') throw new Error('경력 section이 없습니다')
    expect(experience.data.items[0]?.histories).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: '경력 상세 삭제' }))
    experience = getDraft().sections[2]
    if (experience?.type !== 'experience') throw new Error('경력 section이 없습니다')
    expect(experience.data.items[0]?.histories).toHaveLength(1)

    await openFirstSkillPicker(user)
    const selectedSkill = screen.getByRole('checkbox', { name: /TypeScript선택 1/ })
    await user.click(selectedSkill)
    expect(experience.data.items[0]?.histories[0]?.skills).toHaveLength(0)
    await user.click(screen.getByRole('checkbox', { name: 'TypeScript' }))
    experience = getDraft().sections[2]
    if (experience?.type !== 'experience') throw new Error('경력 section이 없습니다')
    expect(experience.data.items[0]?.histories[0]?.skills).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: '프로젝트' }))
    await user.click(screen.getByRole('button', { name: '프로젝트 추가' }))
    let projects = getDraft().sections[3]
    if (projects?.type !== 'projects') throw new Error('프로젝트 section이 없습니다')
    expect(projects.data.items).toHaveLength(2)
    const projectDeleteButtons = screen.getAllByRole('button', { name: '프로젝트 삭제' })
    await user.click(projectDeleteButtons[projectDeleteButtons.length - 1]!)
    await user.click(screen.getByRole('button', { name: '프로젝트 업무 추가' }))
    projects = getDraft().sections[3]
    if (projects?.type !== 'projects') throw new Error('프로젝트 section이 없습니다')
    expect(projects.data.items[0]?.works).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: '프로젝트 업무 삭제' }))

    for (const [sectionLabel, addLabel, deleteLabel, index, type] of [
      ['학력', '학력 추가', '학력 삭제', 4, 'education'],
      ['활동', '활동 추가', '활동 삭제', 5, 'activity'],
      ['자격증', '자격증 추가', '자격증 삭제', 6, 'licenses'],
    ] as const) {
      await user.click(screen.getByRole('button', { name: sectionLabel }))
      await user.click(screen.getByRole('button', { name: addLabel }))
      const section = getDraft().sections[index]
      if (section?.type !== type) throw new Error(`${sectionLabel} section이 없습니다`)
      expect(section.data.items).toHaveLength(2)
      const deleteButtons = screen.getAllByRole('button', { name: deleteLabel })
      await user.click(deleteButtons[deleteButtons.length - 1]!)
      const after = getDraft().sections[index]
      if (after?.type !== type) throw new Error(`${sectionLabel} section이 없습니다`)
      expect(after.data.items).toHaveLength(1)
    }
  })

  it('참조 중인 기술 삭제 취소는 유지하고 확인은 catalog와 참조를 함께 제거한다', async () => {
    const user = userEvent.setup()
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    const { getDraft } = renderEditor('typescript')
    const button = screen.getByRole('button', { name: 'TypeScript 기술 삭제' })

    await user.click(button)
    expect(getDraft().skillCatalog).toHaveLength(1)
    expect(confirm).toHaveBeenLastCalledWith(expect.stringContaining('1개'))

    await user.click(button)
    expect(getDraft().skillCatalog).toHaveLength(0)
    const experience = getDraft().sections[2]
    expect(
      experience?.type === 'experience' && experience.data.items[0]?.histories[0]?.skills,
    ).toEqual([])
  })

  it('내용 있는 항목 삭제는 확인하고 선택을 부모 section으로 이동한다', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    const { getDraft, onSelectedRegionChange } = renderEditor('experience-1')
    const button = await screen.findByRole('button', { name: '회사 회사 삭제' })

    await user.click(button)
    const before = getDraft().sections[2]
    if (before?.type !== 'experience') throw new Error('경력 section이 없습니다')
    expect(before.data.items).toHaveLength(1)
    await user.click(button)
    const after = getDraft().sections[2]
    if (after?.type !== 'experience') throw new Error('경력 section이 없습니다')
    expect(after.data.items).toHaveLength(0)
    expect(onSelectedRegionChange).toHaveBeenCalledWith('section-experience')
  })

  it('nested selection의 부모 section을 열고 region으로 이동해 첫 field를 focus한다', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    renderEditor('history-1')

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled())
    expect(document.activeElement).toHaveAccessibleName('부서명')
    expect(screen.getByRole('button', { name: '경력' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('nested region의 첫 field가 아닌 입력을 수정해도 focus를 빼앗지 않는다', async () => {
    const user = userEvent.setup()
    renderEditor('history-1')
    const role = await screen.findByRole('textbox', { name: '역할' })
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName('부서명'))

    await user.click(role)
    await user.type(role, ' 수정')
    await new Promise((resolve) => window.setTimeout(resolve, 50))

    expect(role).toHaveFocus()
  })

  it('늦은 RAF의 stale selection과 accordion 변경이 사용자 focus를 빼앗지 않는다', async () => {
    let nextFrameId = 0
    const frames = new Map<number, FrameRequestCallback>()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      const id = ++nextFrameId
      frames.set(id, callback)
      return id
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      frames.delete(id)
    })
    const runFrame = (id: number) => {
      const callback = frames.get(id)
      frames.delete(id)
      if (callback !== undefined) act(() => callback(0))
    }

    function StatefulSelection() {
      const [selectedRegionId, setSelectedRegionId] = useState('history-1')
      const [openSectionIds, setOpenSectionIds] = useState(
        () => new Set(['section-experience', 'section-projects']),
      )
      return (
        <>
          <button type="button" onClick={() => setSelectedRegionId('project-work-1')}>
            프로젝트 업무 선택
          </button>
          <SectionEditorList
            selectedRegionId={selectedRegionId}
            onSelectedRegionChange={setSelectedRegionId}
            openSectionIds={openSectionIds}
            onOpenSectionIdsChange={setOpenSectionIds}
          />
        </>
      )
    }

    render(
      <Harness onForm={() => undefined}>
        <StatefulSelection />
      </Harness>,
    )
    const staleOuterFrame = Math.min(...frames.keys())
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: '프로젝트 업무 선택' }))

    const currentOuterFrame = Math.max(...frames.keys())
    runFrame(currentOuterFrame)
    runFrame(Math.max(...frames.keys()))
    expect(screen.getByRole('textbox', { name: '프로젝트 역할' })).toHaveFocus()
    runFrame(staleOuterFrame)
    if (frames.size > 0) runFrame(Math.max(...frames.keys()))
    expect(screen.getByRole('textbox', { name: '프로젝트 역할' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: '학력' }))
    const role = screen.getByRole('textbox', { name: '프로젝트 역할' })
    role.focus()
    for (const id of [...frames.keys()]) runFrame(id)
    for (const id of [...frames.keys()]) runFrame(id)
    expect(role).toHaveFocus()
  })

  it('unmount에서 예약한 region focus RAF를 취소한다', () => {
    let nextFrameId = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => ++nextFrameId)
    const cancelAnimationFrame = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => undefined)

    const view = renderEditor('history-1', createResumeFixture(), ['section-experience'])
    cleanup()

    expect(cancelAnimationFrame).toHaveBeenCalled()
    expect(view.onSelectedRegionChange).not.toHaveBeenCalled()
  })

  it.each([
    ['history-1', 'button', '개발팀 삭제'],
    ['project-work-1', 'button', '역할 삭제'],
    ['paragraph-1', 'button', '소개 문단 삭제'],
    ['history-skill-1', 'checkbox', /TypeScript선택 1/],
  ] as const)(
    '선택된 nested item %s 삭제 후 부모 section으로 selection을 이동한다',
    async (selectedRegionId, role, accessibleName) => {
      const user = userEvent.setup()
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      const { onSelectedRegionChange } = renderEditor(selectedRegionId)
      if (role === 'checkbox') await openFirstSkillPicker(user)
      const control = await screen.findByRole(role, { name: accessibleName })

      await user.click(control)

      expect(onSelectedRegionChange).toHaveBeenCalledWith(
        selectedRegionId === 'paragraph-1'
          ? 'section-introduce'
          : selectedRegionId === 'project-work-1'
            ? 'section-projects'
            : 'section-experience',
      )
    },
  )

  it('arbitrary section ID를 그대로 selection fallback에 사용한다', async () => {
    const user = userEvent.setup()
    const draft = createResumeFixture()
    draft.sections[2]!.id = 'career-section-opaque'
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { onSelectedRegionChange } = renderEditor('experience-1', draft)

    await user.click(await screen.findByRole('button', { name: '회사 회사 삭제' }))

    expect(onSelectedRegionChange).toHaveBeenCalledWith('career-section-opaque')
  })

  it.each([
    ['history-1', '회사 회사 삭제', 'section-experience'],
    ['project-work-1', '프로젝트 삭제', 'section-projects'],
  ] as const)(
    '선택된 descendant %s의 ancestor 삭제 후 실제 section ID로 이동한다',
    async (selectedRegionId, deleteName, expectedSectionId) => {
      const user = userEvent.setup()
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      const { onSelectedRegionChange } = renderEditor(selectedRegionId)

      await user.click(await screen.findByRole('button', { name: deleteName }))

      expect(onSelectedRegionChange).toHaveBeenCalledWith(expectedSectionId)
    },
  )

  it('선택된 catalog skill 삭제 후 첫 실제 section region으로 이동한다', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { onSelectedRegionChange } = renderEditor('typescript')

    await user.click(screen.getByRole('button', { name: 'TypeScript 기술 삭제' }))

    expect(onSelectedRegionChange).toHaveBeenCalledWith('section-information')
    expect(document.querySelector('[data-editor-region-id="section-information"]')).not.toBeNull()
  })

  it('catalog skill 삭제로 선택된 reference도 사라지면 소유한 실제 경력 section으로 이동한다', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { onSelectedRegionChange } = renderEditor('history-skill-1')

    await openSkillCatalog(user)
    await user.click(screen.getByRole('button', { name: 'TypeScript 기술 삭제' }))

    expect(onSelectedRegionChange).toHaveBeenCalledWith('section-experience')
  })

  it('stable item ID가 document-settings여도 region selector와 nested focus가 유일하다', async () => {
    const draft = createResumeFixture()
    const experience = draft.sections[2]
    if (experience?.type !== 'experience') throw new Error('경력 section이 없습니다')
    experience.data.items[0]!.histories[0]!.id = 'document-settings'

    renderEditor('document-settings', draft)

    await waitFor(() => expect(document.activeElement).toHaveAccessibleName('부서명'))
    expect(document.querySelectorAll('[data-editor-region-id="document-settings"]')).toHaveLength(1)
  })

  it('catalog skill과 reference 삭제 fallback은 실제 arbitrary section ID를 사용한다', async () => {
    const user = userEvent.setup()
    const draft = createResumeFixture()
    draft.sections[0]!.id = 'first-section-opaque'
    draft.sections[2]!.id = 'career-section-opaque'
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const selectedSkill = renderEditor('typescript', draft)

    await user.click(screen.getByRole('button', { name: 'TypeScript 기술 삭제' }))

    expect(selectedSkill.onSelectedRegionChange).toHaveBeenCalledWith('first-section-opaque')

    cleanup()
    const referenceDraft = createResumeFixture()
    referenceDraft.sections[2]!.id = 'career-section-opaque'
    const selectedReference = renderEditor('history-skill-1', referenceDraft)
    await openSkillCatalog(user)
    await user.click(screen.getByRole('button', { name: 'TypeScript 기술 삭제' }))
    expect(selectedReference.onSelectedRegionChange).toHaveBeenCalledWith('career-section-opaque')
  })

  it('unrelated selection은 catalog skill 삭제 후에도 유지한다', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { onSelectedRegionChange } = renderEditor('section-projects')

    await openSkillCatalog(user)
    await user.click(screen.getByRole('button', { name: 'TypeScript 기술 삭제' }))

    expect(onSelectedRegionChange).not.toHaveBeenCalled()
  })

  it('factory default만 비어 있다고 판정하고 default field 변경은 content로 판정한다', () => {
    const contact = createDefaultItem('contact', () => 'contact-new')
    const skill = createDefaultItem('catalog-skill', () => 'skill-new')
    const experience = createDefaultItem('experience', () => 'experience-new')
    const history = createDefaultItem('history', () => 'history-new')
    const project = createDefaultItem('project', () => 'project-new')
    const education = createDefaultItem('education', () => 'education-new')

    expect(isUntouchedDefaultItem(contact)).toBe(true)
    expect(isUntouchedDefaultItem({ ...contact, target: '_blank' })).toBe(false)
    expect(isUntouchedDefaultItem({ ...skill, category: 'backend' })).toBe(false)
    expect(isUntouchedDefaultItem({ ...experience, employmentStatus: 'retired' })).toBe(false)
    expect(isUntouchedDefaultItem({ ...history, endDate: '2026-07-12' })).toBe(false)
    expect(isUntouchedDefaultItem({ ...project, endMonth: '2026-07' })).toBe(false)
    expect(isUntouchedDefaultItem({ ...education, graduated: true })).toBe(false)
  })

  it('default field만 수정한 새 연락처 삭제 취소 시 데이터를 보존한다', async () => {
    const user = userEvent.setup()
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { getDraft } = renderEditor('section-information')
    await user.click(screen.getByRole('button', { name: '연락처 추가' }))
    const targets = screen.getAllByRole('combobox', { name: '링크 열기' })
    await user.selectOptions(targets[targets.length - 1]!, '_blank')

    await user.click(screen.getByRole('button', { name: '연락처 삭제' }))

    expect(confirm).toHaveBeenCalledOnce()
    const section = getDraft().sections[0]
    if (section?.type !== 'information') throw new Error('기본 정보 section이 없습니다')
    expect(section.data.contacts).toHaveLength(2)
    expect(section.data.contacts[1]?.target).toBe('_blank')
  })

  it('수정하지 않은 factory default 연락처는 confirm 없이 즉시 삭제한다', async () => {
    const user = userEvent.setup()
    const confirm = vi.spyOn(window, 'confirm')
    const { getDraft } = renderEditor('section-information')
    await user.click(screen.getByRole('button', { name: '연락처 추가' }))

    await user.click(screen.getByRole('button', { name: '연락처 삭제' }))

    expect(confirm).not.toHaveBeenCalled()
    const section = getDraft().sections[0]
    if (section?.type !== 'information') throw new Error('기본 정보 section이 없습니다')
    expect(section.data.contacts).toHaveLength(1)
  })
})
