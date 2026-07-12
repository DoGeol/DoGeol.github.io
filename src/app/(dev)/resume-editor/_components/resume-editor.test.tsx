import { readFileSync } from 'node:fs'
import path from 'node:path'

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

class ImageMock {
  static instances: ImageMock[] = []
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src = ''

  constructor() {
    ImageMock.instances.push(this)
  }
}

describe('ResumeEditor', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    vi.stubGlobal('jest', {
      advanceTimersByTime: (milliseconds: number) => vi.advanceTimersByTime(milliseconds),
    })
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) =>
      window.setTimeout(() => callback(performance.now()), 0),
    )
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => window.clearTimeout(id))
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    sessionStorage.clear()
  })

  it('부모에서 전체 draft를 watch하거나 반복 parse하지 않는다', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/app/(dev)/resume-editor/_components/resume-editor.tsx'),
      'utf8',
    )

    expect(source).not.toContain('useWatch')
    expect(source).not.toContain('resumeDraftSchema.safeParse')
  })

  it('starts from the canonical metadata and marks the client-only root', () => {
    render(<ResumeEditor initialResume={createResumeFixture()} />)

    expect(screen.getByRole('textbox', { name: '이력서 제목' })).toHaveValue('Resume 테스트')
    expect(screen.getByTestId('resume-editor-client-root')).toHaveAttribute(
      'data-resume-editor-client-marker',
      'resume-editor-client-only-marker',
    )
  })

  it('실제 viewport preview frame을 editor 선택 상태와 함께 렌더링한다', () => {
    render(<ResumeEditor initialResume={createResumeFixture()} />)

    expect(screen.getByTitle('실제 이력서 프리뷰')).toHaveAttribute('src', '/resume-preview')
    expect(screen.queryByText('프리뷰 준비 중')).not.toBeInTheDocument()
  })

  it('catalog card를 기본 DOM에서 제외하고 validation target일 때 자동 마운트한다', async () => {
    const user = createUser()
    const draft = createResumeFixture()
    draft.skillCatalog[0]!.label = ''
    render(<ResumeEditor initialResume={draft} />)

    expect(screen.queryByLabelText('기술 ID')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'JSON 내보내기' }))
    await advance(0)

    expect(screen.getByLabelText('기술 ID')).toBeVisible()
    expect(screen.getByRole('textbox', { name: '기술명' })).toHaveFocus()
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
    expect(editorPanel).toHaveClass('block', 'tablet:block')
    expect(previewPanel).toHaveAttribute('id', 'resume-preview-pane')
    expect(previewPanel).toHaveAttribute('aria-labelledby', 'resume-preview-tab')
    expect(previewPanel).toHaveClass('hidden', 'tablet:block')

    editorTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(previewTab).toHaveFocus()
    expect(previewTab).toHaveAttribute('aria-selected', 'true')
    expect(previewTab).toHaveAttribute('tabindex', '0')
    expect(editorTab).toHaveAttribute('tabindex', '-1')
    expect(editorPanel).toHaveClass('hidden', 'tablet:block')
    expect(previewPanel).toHaveClass('block', 'tablet:block')

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
      'border-slate-500',
      'dark:border-neutral-400',
      'dark:bg-neutral-800',
      'dark:text-neutral-100',
    )
    expect(screen.getByRole('combobox', { name: '템플릿' })).toHaveClass(
      'border-slate-500',
      'dark:border-neutral-400',
    )
    expect(screen.getByRole('tabpanel', { name: '편집' })).toHaveClass('dark:bg-neutral-950')
    expect(screen.getByRole('tabpanel', { name: '프리뷰' })).toHaveClass(
      'dark:border-neutral-400',
      'dark:bg-neutral-950',
    )
  })

  it('downloads a valid form once as resume.json', async () => {
    const user = createUser()
    ImageMock.instances = []
    vi.stubGlobal('Image', ImageMock)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:resume')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const clickedAnchors: HTMLAnchorElement[] = []
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clickedAnchors.push(this)
    })
    render(<ResumeEditor initialResume={createResumeFixture()} />)
    act(() => ImageMock.instances.forEach((image) => image.onload?.()))

    await user.click(screen.getByRole('button', { name: 'JSON 내보내기' }))

    expect(click).toHaveBeenCalledOnce()
    expect(clickedAnchors[0]?.download).toBe('resume.json')
  })

  it('현재 asset preload 실패는 resolver 이후에도 export를 막고 오류를 보존한다', async () => {
    const user = createUser()
    ImageMock.instances = []
    vi.stubGlobal('Image', ImageMock)
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    render(<ResumeEditor initialResume={createResumeFixture()} />)
    const failedImage = ImageMock.instances.find((image) => image.src === '/profile/pdg-real.webp')
    if (failedImage?.onerror === null || failedImage?.onerror === undefined) {
      throw new Error('profile preload가 시작되지 않았습니다')
    }

    act(() => failedImage.onerror?.())
    expect(screen.getByText('이미지를 불러올 수 없습니다')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'JSON 내보내기' }))
    await advance(40)

    expect(click).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: '내보내기 오류' })).toBeVisible()
    expect(screen.getByText('이미지를 불러올 수 없습니다')).toBeVisible()
    expect(screen.getByLabelText('앞면 프로필 이미지 경로')).toHaveFocus()
  })

  it('asset URL 수정 직후 callback 전 export를 막고 현재 성공 뒤에만 허용한다', async () => {
    const user = createUser()
    ImageMock.instances = []
    vi.stubGlobal('Image', ImageMock)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:resume')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    render(<ResumeEditor initialResume={createResumeFixture()} />)
    act(() => ImageMock.instances.forEach((image) => image.onload?.()))

    const assetInput = screen.getByLabelText('앞면 프로필 이미지 경로')
    await user.clear(assetInput)
    await user.type(assetInput, '/profile/new.webp')
    await user.click(screen.getByRole('button', { name: 'JSON 내보내기' }))
    await advance(0)

    expect(click).not.toHaveBeenCalled()
    expect(assetInput).toHaveAttribute('aria-invalid', 'true')
    const describedBy = assetInput.getAttribute('aria-describedby')
    expect(describedBy).not.toBeNull()
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      '이미지 확인이 끝날 때까지 기다려 주세요',
    )

    const currentImage = ImageMock.instances.find((image) => image.src === '/profile/new.webp')
    act(() => currentImage?.onload?.())
    expect(assetInput).toHaveAttribute('aria-invalid', 'false')
    act(() => ImageMock.instances.forEach((image) => image.onload?.()))
    await user.click(screen.getByRole('button', { name: 'JSON 내보내기' }))

    expect(click).toHaveBeenCalledOnce()
  })

  it('닫힌 section의 nested 오류로 이동하고 summary action으로 같은 탐색을 반복한다', async () => {
    const user = createUser()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    render(<ResumeEditor initialResume={createResumeFixture()} />)

    await user.click(screen.getByRole('button', { name: '경력' }))
    const companyName = screen.getAllByRole('textbox', { name: '회사명' })[0]!
    await user.clear(companyName)
    await user.click(screen.getByRole('button', { name: '경력' }))
    await user.click(screen.getByRole('tab', { name: '프리뷰' }))
    await user.click(screen.getByRole('button', { name: 'JSON 내보내기' }))
    await advance(40)

    expect(click).not.toHaveBeenCalled()
    expect(screen.getByRole('tab', { name: '편집' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: '경력' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('textbox', { name: '회사명' })[0]).toHaveFocus()

    const summaryAction = screen.getByRole('button', { name: '첫 번째 오류로 이동' })
    screen.getByRole('textbox', { name: '역할' }).focus()
    await user.click(summaryAction)
    await advance(40)
    expect(screen.getAllByRole('textbox', { name: '회사명' })[0]).toHaveFocus()
  })
})
