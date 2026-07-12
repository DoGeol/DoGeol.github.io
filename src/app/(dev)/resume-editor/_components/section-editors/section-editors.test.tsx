import { zodResolver } from '@hookform/resolvers/zod'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { resumeSchema, type ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
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
  }: {
    selectedRegionId: string
    onSelectedRegionChange: (id: string) => void
  }) {
    const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(
      () => new Set(selectedRegionId.startsWith('section-') ? [selectedRegionId] : []),
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
    await user.click(screen.getByRole('button', { name: 'TypeScript 기술 삭제' }))
    expect(selectedReference.onSelectedRegionChange).toHaveBeenCalledWith('career-section-opaque')
  })

  it('unrelated selection은 catalog skill 삭제 후에도 유지한다', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { onSelectedRegionChange } = renderEditor('section-projects')

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
