import { readFileSync } from 'node:fs'
import path from 'node:path'

import { act, cleanup, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useForm, type UseFormReturn } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { createResumeFixture } from '@/test/fixtures/resume'

import { RESUME_DRAFT_STORAGE_KEY, writeResumeDraft } from './draft-storage'
import { useResumeDraftSession, type ResumeDraftSession } from './use-resume-draft-session'

type HarnessState = {
  form: UseFormReturn<ResumeDraft>
  session: ResumeDraftSession
}

let harnessState: HarnessState | null = null

function SessionHarness({ initialResume }: { initialResume: ResumeDraft }) {
  const form = useForm<ResumeDraft>({ defaultValues: initialResume })
  const session = useResumeDraftSession(form, initialResume)

  useEffect(() => {
    harnessState = { form, session }
  }, [form, session])

  return (
    <>
      <output data-testid="saved-at">{session.savedAt ?? ''}</output>
      <output data-testid="notice">{session.notice ?? ''}</output>
    </>
  )
}

const current = () => {
  if (harnessState === null) throw new Error('session harness가 렌더링되지 않았습니다')
  return harnessState
}

const flushHydration = async () => {
  await act(async () => {
    await Promise.resolve()
  })
}

const advance = async (milliseconds: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds)
  })
}

describe('useResumeDraftSession', () => {
  beforeEach(() => {
    harnessState = null
    sessionStorage.clear()
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
    sessionStorage.clear()
  })

  it('render 구독 없이 RHF subscription으로 draft를 관찰한다', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/app/(dev)/resume-editor/_model/use-resume-draft-session.ts'),
      'utf8',
    )

    expect(source).toContain('form.subscribe')
    expect(source).not.toContain('useWatch')
  })

  it('같은 탭의 유효한 초안과 저장 시각을 복원한다', async () => {
    const restored = createResumeFixture()
    restored.metadata.title = '복원된 제목'
    writeResumeDraft(sessionStorage, restored, new Date('2026-07-12T00:00:00.000Z'))

    render(<SessionHarness initialResume={createResumeFixture()} />)
    await flushHydration()

    expect(current().form.getValues('metadata.title')).toBe('복원된 제목')
    expect(screen.getByTestId('saved-at')).toHaveTextContent('2026-07-12T00:00:00.000Z')
  })

  it('손상된 초안을 제거하고 복구 실패를 알린다', async () => {
    sessionStorage.setItem(RESUME_DRAFT_STORAGE_KEY, '{broken')

    render(<SessionHarness initialResume={createResumeFixture()} />)
    await flushHydration()

    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()
    expect(screen.getByTestId('notice')).toHaveTextContent(
      '초안을 복구할 수 없어 원본을 불러왔습니다',
    )
  })

  it('유효한 변경을 300ms 뒤에만 저장한다', async () => {
    render(<SessionHarness initialResume={createResumeFixture()} />)
    await flushHydration()

    act(() => current().form.setValue('metadata.title', '저장된 제목'))
    await advance(299)
    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()

    await advance(1)
    expect(JSON.parse(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY) ?? '{}')).toMatchObject({
      draft: { metadata: { title: '저장된 제목' } },
    })
  })

  it('초기 canonical draft도 hydration 300ms 뒤 저장 상태로 표시한다', async () => {
    render(<SessionHarness initialResume={createResumeFixture()} />)
    await flushHydration()

    await advance(299)
    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()

    await advance(1)
    expect(JSON.parse(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY) ?? '{}')).toMatchObject({
      draft: { metadata: { title: 'Resume 테스트' } },
    })
    expect(screen.getByTestId('saved-at')).not.toBeEmptyDOMElement()
  })

  it('invalid transient가 생기면 이전 저장 예약을 취소한다', async () => {
    render(<SessionHarness initialResume={createResumeFixture()} />)
    await flushHydration()

    act(() => current().form.setValue('metadata.title', '아직 저장하지 않을 제목'))
    await advance(200)
    act(() => current().form.setValue('assets.profileFront', 'invalid-path'))
    await advance(200)

    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()

    act(() => current().form.setValue('assets.profileFront', '/profile/valid.webp'))
    await advance(300)
    expect(JSON.parse(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY) ?? '{}')).toMatchObject({
      draft: {
        metadata: { title: '아직 저장하지 않을 제목' },
        assets: { profileFront: '/profile/valid.webp' },
      },
    })
  })

  it('초기화 값은 저장하지 않고 다음 수정부터 다시 저장한다', async () => {
    const initialResume = createResumeFixture()
    const restored = createResumeFixture()
    restored.metadata.title = '수정된 초안'
    writeResumeDraft(sessionStorage, restored)
    render(<SessionHarness initialResume={initialResume} />)
    await flushHydration()

    act(() => current().session.resetDraft())

    expect(current().form.getValues('metadata.title')).toBe('Resume 테스트')
    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()
    expect(screen.getByTestId('notice')).toHaveTextContent('원본 이력서로 초기화했습니다')
    await advance(300)
    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()

    act(() => current().form.setValue('metadata.title', '초기화 후 수정'))
    await advance(300)
    expect(JSON.parse(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY) ?? '{}')).toMatchObject({
      draft: { metadata: { title: '초기화 후 수정' } },
    })
  })
})
