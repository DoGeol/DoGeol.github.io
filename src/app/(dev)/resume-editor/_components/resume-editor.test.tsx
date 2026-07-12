import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createResumeFixture } from '@/test/fixtures/resume'

import { RESUME_DRAFT_STORAGE_KEY, writeResumeDraft } from '../_model/draft-storage'
import { ResumeEditor } from './resume-editor'

const createUser = () =>
  userEvent.setup({
    advanceTimers: (milliseconds) => vi.advanceTimersByTime(milliseconds),
  })

const advance = async (milliseconds: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds)
  })
}

describe('ResumeEditor', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    vi.stubGlobal('jest', {
      advanceTimersByTime: (milliseconds: number) => vi.advanceTimersByTime(milliseconds),
    })
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    sessionStorage.clear()
  })

  it('starts from the canonical metadata and marks the client-only root', () => {
    render(<ResumeEditor initialResume={createResumeFixture()} />)

    expect(screen.getByRole('textbox', { name: '이력서 제목' })).toHaveValue('Resume 테스트')
    expect(screen.getByTestId('resume-editor-client-root')).toHaveAttribute(
      'data-resume-editor-client-marker',
      'resume-editor-client-only-marker',
    )
  })

  it('saves the current form draft only after the 300ms debounce', async () => {
    const user = createUser()
    render(<ResumeEditor initialResume={createResumeFixture()} />)
    const title = screen.getByRole('textbox', { name: '이력서 제목' })

    await user.clear(title)
    await user.type(title, '저장된 제목')
    await advance(299)

    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()

    await advance(1)

    const raw = sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw ?? '{}')).toMatchObject({
      schemaVersion: 1,
      savedAt: expect.any(String),
      draft: { metadata: { title: '저장된 제목' } },
    })
  })

  it('restores the same-tab draft on remount', async () => {
    const initialResume = createResumeFixture()
    const restored = createResumeFixture()
    restored.metadata.title = '복원된 제목'
    writeResumeDraft(sessionStorage, restored, new Date('2026-07-12T00:00:00.000Z'))

    const first = render(<ResumeEditor initialResume={initialResume} />)
    expect(screen.getByRole('textbox', { name: '이력서 제목' })).toHaveValue('복원된 제목')

    first.unmount()
    render(<ResumeEditor initialResume={initialResume} />)

    expect(screen.getByRole('textbox', { name: '이력서 제목' })).toHaveValue('복원된 제목')

    await advance(301)
    const raw = sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)
    expect(JSON.parse(raw ?? '{}')).toMatchObject({ draft: restored })
  })

  it.each([
    ['손상된 JSON', '{broken'],
    [
      '다른 version',
      JSON.stringify({
        schemaVersion: 2,
        savedAt: '2026-07-12T00:00:00.000Z',
        draft: createResumeFixture(),
      }),
    ],
  ])('%s 초안을 제거하고 canonical 값을 안내한다', async (_label, raw) => {
    sessionStorage.setItem(RESUME_DRAFT_STORAGE_KEY, raw)

    render(<ResumeEditor initialResume={createResumeFixture()} />)
    await advance(0)

    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()
    expect(screen.getByText('초안을 복구할 수 없어 원본을 불러왔습니다')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: '이력서 제목' })).toHaveValue('Resume 테스트')

    await advance(301)
    expect(screen.getByText('초안을 복구할 수 없어 원본을 불러왔습니다')).toBeInTheDocument()
  })

  it('keeps a reset canonical value unsaved until a subsequent edit', async () => {
    const user = createUser()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const initialResume = createResumeFixture()
    const restored = createResumeFixture()
    restored.metadata.title = '수정된 초안'
    writeResumeDraft(sessionStorage, restored)
    render(<ResumeEditor initialResume={initialResume} />)

    await user.click(screen.getByRole('button', { name: '초안 초기화' }))

    expect(window.confirm).toHaveBeenCalledOnce()
    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()
    expect(screen.getByRole('textbox', { name: '이력서 제목' })).toHaveValue('Resume 테스트')

    await advance(301)
    expect(sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()

    const title = screen.getByRole('textbox', { name: '이력서 제목' })
    await user.clear(title)
    await user.type(title, '초기화 후 수정')
    await advance(300)

    const raw = sessionStorage.getItem(RESUME_DRAFT_STORAGE_KEY)
    expect(JSON.parse(raw ?? '{}')).toMatchObject({
      draft: { metadata: { title: '초기화 후 수정' } },
    })
  })

  it('shows a summary and field error without downloading an invalid draft', async () => {
    const user = createUser()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    render(<ResumeEditor initialResume={createResumeFixture()} />)

    await user.clear(screen.getByRole('textbox', { name: '이력서 제목' }))
    await user.click(screen.getByRole('button', { name: 'JSON 내보내기' }))
    await advance(0)

    expect(screen.getByRole('heading', { name: '내보내기 오류' })).toBeInTheDocument()
    expect(screen.getByText('문서 제목을 입력해 주세요')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: '이력서 제목' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(screen.getByRole('textbox', { name: '이력서 제목' })).toHaveFocus()
    expect(click).not.toHaveBeenCalled()
  })

  it('supports roving keyboard focus and linked tab panels', async () => {
    const user = createUser()
    render(<ResumeEditor initialResume={createResumeFixture()} />)
    const editorTab = screen.getByRole('tab', { name: '편집' })
    const previewTab = screen.getByRole('tab', { name: '프리뷰' })

    expect(editorTab).toHaveAttribute('id', 'resume-editor-tab')
    expect(editorTab).toHaveAttribute('aria-controls', 'resume-editor-pane')
    expect(editorTab).toHaveAttribute('aria-selected', 'true')
    expect(editorTab).toHaveAttribute('tabindex', '0')
    expect(previewTab).toHaveAttribute('id', 'resume-preview-tab')
    expect(previewTab).toHaveAttribute('aria-controls', 'resume-preview-pane')
    expect(previewTab).toHaveAttribute('aria-selected', 'false')
    expect(previewTab).toHaveAttribute('tabindex', '-1')

    const editorPanel = screen.getByRole('tabpanel', { name: '편집' })
    const previewPanel = screen.getByRole('tabpanel', { name: '프리뷰' })
    expect(editorPanel).toHaveAttribute('id', 'resume-editor-pane')
    expect(editorPanel).toHaveAttribute('aria-labelledby', 'resume-editor-tab')
    expect(editorPanel).toHaveClass('block', 'md:block')
    expect(previewPanel).toHaveAttribute('id', 'resume-preview-pane')
    expect(previewPanel).toHaveAttribute('aria-labelledby', 'resume-preview-tab')
    expect(previewPanel).toHaveClass('hidden', 'md:block')

    editorTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(previewTab).toHaveFocus()
    expect(previewTab).toHaveAttribute('aria-selected', 'true')
    expect(previewTab).toHaveAttribute('tabindex', '0')
    expect(editorTab).toHaveAttribute('tabindex', '-1')
    expect(editorPanel).toHaveClass('hidden', 'md:block')
    expect(previewPanel).toHaveClass('block', 'md:block')

    await user.keyboard('{ArrowLeft}')
    expect(editorTab).toHaveFocus()
    await user.keyboard('{End}')
    expect(previewTab).toHaveFocus()
    await user.keyboard('{Home}')
    expect(editorTab).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(previewTab).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(editorTab).toHaveFocus()
  })

  it('binds dark theme surfaces and the primary blue export action', () => {
    render(<ResumeEditor initialResume={createResumeFixture()} />)

    expect(screen.getByTestId('resume-editor-client-root')).toHaveClass(
      'dark:bg-neutral-950',
      'dark:text-neutral-100',
    )
    expect(screen.getByRole('banner')).toHaveClass('dark:border-neutral-700', 'dark:bg-neutral-900')
    expect(screen.getByRole('button', { name: 'JSON 내보내기' })).toHaveClass(
      'bg-blue-600',
      'dark:bg-blue-500',
    )
    expect(screen.getByRole('textbox', { name: '이력서 제목' })).toHaveClass(
      'dark:border-neutral-600',
      'dark:bg-neutral-800',
      'dark:text-neutral-100',
    )
    expect(screen.getByRole('tabpanel', { name: '편집' })).toHaveClass('dark:bg-neutral-950')
    expect(screen.getByRole('tabpanel', { name: '프리뷰' })).toHaveClass(
      'dark:border-neutral-700',
      'dark:bg-neutral-900',
    )
  })

  it('downloads a valid form once as resume.json', async () => {
    const user = createUser()
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:resume')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const clickedAnchors: HTMLAnchorElement[] = []
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clickedAnchors.push(this)
    })
    render(<ResumeEditor initialResume={createResumeFixture()} />)

    await user.click(screen.getByRole('button', { name: 'JSON 내보내기' }))

    expect(click).toHaveBeenCalledOnce()
    expect(clickedAnchors[0]?.download).toBe('resume.json')
  })
})
