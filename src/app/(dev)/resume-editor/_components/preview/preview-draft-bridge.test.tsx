import { readFileSync } from 'node:fs'
import path from 'node:path'

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef, useEffect, type RefObject } from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { createResumeFixture } from '@/test/fixtures/resume'

import { PreviewDraftBridge, type PreviewDraftBridgeHandle } from './preview-draft-bridge'

type PreviewFrameProps = {
  draft: ResumeDraft | null
  selectedRegionId: string | null
  onSelectedRegionChange: (regionId: string) => void
}

const previewFrameRender = vi.hoisted(() => vi.fn())

vi.mock('./preview-frame', () => ({
  PreviewFrame: (props: PreviewFrameProps) => {
    previewFrameRender(props)
    return (
      <button type="button" onClick={() => props.onSelectedRegionChange('history-work-1')}>
        {props.draft?.metadata.title ?? '유효한 프리뷰 없음'}
      </button>
    )
  },
}))

class ImageMock {
  static instances: ImageMock[] = []
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src = ''

  constructor() {
    ImageMock.instances.push(this)
  }
}

let currentForm: UseFormReturn<ResumeDraft> | null = null

function BridgeHarness({
  initialResume,
  bridgeRef,
  onSelectedRegionChange,
}: {
  initialResume: ResumeDraft
  bridgeRef: RefObject<PreviewDraftBridgeHandle | null>
  onSelectedRegionChange: (regionId: string, fallbackSectionId: string | null) => void
}) {
  const form = useForm<ResumeDraft>({ defaultValues: initialResume })

  useEffect(() => {
    currentForm = form
  }, [form])

  return (
    <FormProvider {...form}>
      <PreviewDraftBridge
        ref={bridgeRef}
        form={form}
        selectedRegionId={null}
        onSelectedRegionChange={onSelectedRegionChange}
      />
    </FormProvider>
  )
}

const form = () => {
  if (currentForm === null) throw new Error('bridge harness가 렌더링되지 않았습니다')
  return currentForm
}

describe('PreviewDraftBridge', () => {
  beforeEach(() => {
    currentForm = null
    ImageMock.instances = []
    previewFrameRender.mockClear()
    vi.stubGlobal('Image', ImageMock)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('form 전체 watch와 schema 검증을 프리뷰 브리지 한 곳에 둔다', () => {
    const bridgeSource = readFileSync(
      path.join(
        process.cwd(),
        'src/app/(dev)/resume-editor/_components/preview/preview-draft-bridge.tsx',
      ),
      'utf8',
    )
    const frameSource = readFileSync(
      path.join(process.cwd(), 'src/app/(dev)/resume-editor/_components/preview/preview-frame.tsx'),
      'utf8',
    )

    expect(bridgeSource).toContain('useWatch')
    expect(bridgeSource).toContain('resumeDraftSchema.safeParse')
    expect(frameSource).not.toContain('resumeDraftSchema.safeParse')
    expect(frameSource).not.toContain('useDeferredValue')
  })

  it('전체 draft 변경을 schema-valid preview로 전달한다', async () => {
    render(
      <BridgeHarness
        initialResume={createResumeFixture()}
        bridgeRef={createRef<PreviewDraftBridgeHandle>()}
        onSelectedRegionChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button')).toHaveTextContent('Resume 테스트')
    act(() => form().setValue('metadata.title', '브리지에서 갱신'))

    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('브리지에서 갱신'))
    expect(previewFrameRender).toHaveBeenLastCalledWith(
      expect.objectContaining({
        draft: expect.objectContaining({
          metadata: expect.objectContaining({ title: '브리지에서 갱신' }),
        }),
      }),
    )

    act(() => form().setValue('assets.profileFront', 'invalid-path'))
    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('유효한 프리뷰 없음'))
    expect(previewFrameRender).toHaveBeenLastCalledWith(expect.objectContaining({ draft: null }))
  })

  it('프리뷰 nested region과 deferred draft의 fallback section을 함께 알린다', () => {
    const onSelectedRegionChange = vi.fn()
    render(
      <BridgeHarness
        initialResume={createResumeFixture()}
        bridgeRef={createRef<PreviewDraftBridgeHandle>()}
        onSelectedRegionChange={onSelectedRegionChange}
      />,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(onSelectedRegionChange).toHaveBeenCalledWith('history-work-1', 'section-experience')
  })

  it('검증된 asset의 export gate를 imperative handle로 노출한다', async () => {
    const bridgeRef = createRef<PreviewDraftBridgeHandle>()
    render(
      <BridgeHarness
        initialResume={createResumeFixture()}
        bridgeRef={bridgeRef}
        onSelectedRegionChange={vi.fn()}
      />,
    )

    act(() => ImageMock.instances.forEach((image) => image.onload?.()))
    await waitFor(() => expect(bridgeRef.current?.reapplyAssetErrors()).toBeNull())
  })
})
