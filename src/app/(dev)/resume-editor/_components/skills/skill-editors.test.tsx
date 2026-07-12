import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, type ReactNode } from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { SkillReferenceField } from '@/app/(dev)/resume-editor/_components/fields/skill-reference-field'
import { createResumeFixture } from '@/test/fixtures/resume'

import { SkillCatalogEditor } from './skill-catalog-editor'

function Harness({
  draft,
  onForm = () => undefined,
  children,
}: {
  draft: ResumeDraft
  onForm?: (form: UseFormReturn<ResumeDraft>) => void
  children: ReactNode
}) {
  const form = useForm<ResumeDraft>({ defaultValues: draft })

  useEffect(() => {
    onForm(form)
  }, [form, onForm])

  return <FormProvider {...form}>{children}</FormProvider>
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('SkillCatalogEditor', () => {
  it('57개 catalog card를 기본 DOM에서 제외하고 열 때만 마운트한다', async () => {
    const user = userEvent.setup()
    const draft = createResumeFixture()
    draft.skillCatalog = Array.from({ length: 57 }, (_, index) => ({
      id: `skill-${index}`,
      label: `기술 ${index}`,
      category: index % 2 === 0 ? ('frontend' as const) : ('backend' as const),
    }))

    render(
      <Harness draft={draft}>
        <SkillCatalogEditor
          selectedRegionId="section-information"
          onSelectedRegionChange={vi.fn()}
        />
      </Harness>,
    )

    expect(screen.queryByLabelText('기술 ID')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '기술 목록 57개 열기' }))
    expect(screen.getAllByLabelText('기술 ID')).toHaveLength(57)
  })

  it('선택된 catalog validation region은 닫힌 상태에서도 자동 마운트한다', () => {
    const draft = createResumeFixture()
    draft.skillCatalog.push({ id: 'react', label: 'React', category: 'frontend' })

    render(
      <Harness draft={draft}>
        <SkillCatalogEditor selectedRegionId="react" onSelectedRegionChange={vi.fn()} />
      </Harness>,
    )

    expect(screen.getAllByLabelText('기술 ID')).toHaveLength(2)
  })
})

describe('SkillReferenceField lazy picker', () => {
  it('선택 행은 유지하고 닫힌 picker의 catalog choice는 마운트하지 않는다', async () => {
    const user = userEvent.setup()
    const draft = createResumeFixture()
    draft.skillCatalog.push(
      { id: 'react', label: 'React', category: 'frontend' },
      { id: 'node', label: 'Node.js', category: 'backend' },
    )
    let form: UseFormReturn<ResumeDraft> | undefined
    const getForm = () => {
      if (form === undefined) throw new Error('form이 준비되지 않았습니다')
      return form
    }

    render(
      <Harness
        draft={draft}
        onForm={(value) => {
          form = value
        }}
      >
        <SkillReferenceField name="sections.2.data.items.0.histories.0.skills" />
      </Harness>,
    )

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '기술 선택기 열기' }))
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)

    await user.type(screen.getByRole('searchbox', { name: '기술 검색' }), 'react')
    await user.selectOptions(screen.getByRole('combobox', { name: '기술 분류 필터' }), 'frontend')

    expect(screen.getByRole('checkbox', { name: 'React' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: /TypeScript/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Node.js' })).not.toBeInTheDocument()
    expect(getForm().getValues('sections.2.data.items.0.histories.0.skills')).toEqual([
      { id: 'history-skill-1', skillId: 'typescript' },
    ])

    await user.click(screen.getByRole('checkbox', { name: 'React' }))
    expect(getForm().getValues('sections.2.data.items.0.histories.0.skills')).toEqual([
      { id: 'history-skill-1', skillId: 'typescript' },
      expect.objectContaining({ skillId: 'react' }),
    ])
  })
})
