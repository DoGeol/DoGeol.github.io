import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FormProvider, useForm, useFormState, useWatch } from 'react-hook-form'
import { useMemo } from 'react'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { resumeDraftSchema } from '@/app/(pages)/resume/_model/resume-schema'
import { createResumeFixture } from '@/test/fixtures/resume'

import { usePreviewAssets } from './use-preview-assets'

class ImageMock {
  static instances: ImageMock[] = []
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src = ''

  constructor() {
    ImageMock.instances.push(this)
  }
}

const Harness = () => {
  const form = useForm<ResumeDraft>({ defaultValues: createResumeFixture() })
  const watchedDraft = useWatch({ control: form.control })
  const draft = useMemo(() => resumeDraftSchema.parse(watchedDraft), [watchedDraft])
  const { previewDraft, reapplyAssetErrors } = usePreviewAssets(form, draft)
  const { errors } = useFormState({ control: form.control })

  return (
    <FormProvider {...form}>
      <output aria-label="프리뷰 앞면 경로">
        {previewDraft?.assets.profileFront || 'fallback'}
      </output>
      <output aria-label="앞면 오류">{errors.assets?.profileFront?.type ?? 'none'}</output>
      <button
        type="button"
        onClick={() => form.setValue('assets.profileFront', '/profile/new.webp')}
      >
        새 경로
      </button>
      <button
        type="button"
        onClick={() =>
          form.setError('assets.profileFront', { type: 'server', message: '서버 오류' })
        }
      >
        서버 오류
      </button>
      <button type="button" onClick={() => reapplyAssetErrors()}>
        asset 오류 재적용
      </button>
    </FormProvider>
  )
}

describe('usePreviewAssets', () => {
  beforeEach(() => {
    ImageMock.instances = []
    vi.stubGlobal('Image', ImageMock)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('현재 URL 실패만 asset error와 fallback에 반영하고 이전 load race를 무시한다', async () => {
    render(<Harness />)
    const oldImage = ImageMock.instances.find((image) => image.src === '/profile/pdg-real.webp')
    if (oldImage?.onerror === null || oldImage?.onerror === undefined)
      throw new Error('old image 없음')
    const staleError = oldImage.onerror

    fireEvent.click(screen.getByRole('button', { name: '새 경로' }))
    await waitFor(() =>
      expect(ImageMock.instances.some((image) => image.src === '/profile/new.webp')).toBe(true),
    )
    staleError()
    expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('asset-pending')
    expect(screen.getByLabelText('프리뷰 앞면 경로')).toHaveTextContent('/profile/new.webp')

    const currentImage = ImageMock.instances.find((image) => image.src === '/profile/new.webp')
    currentImage?.onerror?.()
    await waitFor(() => expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('asset'))
    expect(screen.getByLabelText('프리뷰 앞면 경로')).toHaveTextContent('fallback')
  })

  it('성공은 asset error만 지우고 다른 type error는 보존한다', async () => {
    render(<Harness />)
    const initialImage = ImageMock.instances.find((image) => image.src === '/profile/pdg-real.webp')
    initialImage?.onerror?.()
    await waitFor(() => expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('asset'))
    initialImage?.onload?.()
    await waitFor(() => expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('none'))

    fireEvent.click(screen.getByRole('button', { name: '서버 오류' }))
    initialImage?.onload?.()
    expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('server')
  })

  it('이전 URL의 늦은 성공은 현재 asset 실패를 지우지 않는다', async () => {
    render(<Harness />)
    const oldImage = ImageMock.instances.find((image) => image.src === '/profile/pdg-real.webp')
    if (oldImage?.onload === null || oldImage?.onload === undefined)
      throw new Error('old image 없음')
    const staleSuccess = oldImage.onload

    fireEvent.click(screen.getByRole('button', { name: '새 경로' }))
    await waitFor(() =>
      expect(ImageMock.instances.some((image) => image.src === '/profile/new.webp')).toBe(true),
    )
    const currentImage = ImageMock.instances.find((image) => image.src === '/profile/new.webp')
    currentImage?.onerror?.()
    await waitFor(() => expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('asset'))

    staleSuccess()
    expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('asset')
    expect(screen.getByLabelText('프리뷰 앞면 경로')).toHaveTextContent('fallback')
  })

  it('URL 변경 즉시 이전 성공을 pending으로 무효화하고 현재 성공만 해제한다', async () => {
    render(<Harness />)
    const initialImage = ImageMock.instances.find((image) => image.src === '/profile/pdg-real.webp')
    initialImage?.onload?.()
    await waitFor(() => expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('none'))

    fireEvent.click(screen.getByRole('button', { name: '새 경로' }))

    await waitFor(() =>
      expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('asset-pending'),
    )
    fireEvent.click(screen.getByRole('button', { name: 'asset 오류 재적용' }))
    expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('asset-pending')

    const currentImage = ImageMock.instances.find((image) => image.src === '/profile/new.webp')
    currentImage?.onload?.()
    await waitFor(() => expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('none'))
  })

  it('pending 재적용과 성공 callback이 같은 field의 non-asset error를 보존한다', async () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: '새 경로' }))
    await waitFor(() =>
      expect(ImageMock.instances.some((image) => image.src === '/profile/new.webp')).toBe(true),
    )
    fireEvent.click(screen.getByRole('button', { name: '서버 오류' }))
    fireEvent.click(screen.getByRole('button', { name: 'asset 오류 재적용' }))
    expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('server')

    ImageMock.instances.find((image) => image.src === '/profile/new.webp')?.onload?.()
    expect(screen.getByLabelText('앞면 오류')).toHaveTextContent('server')
  })
})
