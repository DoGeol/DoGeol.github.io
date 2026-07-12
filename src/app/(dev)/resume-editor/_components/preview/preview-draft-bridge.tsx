'use client'

import { forwardRef, useCallback, useDeferredValue, useImperativeHandle, useMemo } from 'react'
import { useWatch, type FieldPath, type UseFormReturn } from 'react-hook-form'

import { resumeDraftSchema, type ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { buildPreviewRegionParents } from '@/app/(dev)/resume-editor/_model/editor-region-index'

import { PreviewFrame } from './preview-frame'
import { usePreviewAssets } from './use-preview-assets'

export interface PreviewDraftBridgeHandle {
  reapplyAssetErrors: () => FieldPath<ResumeDraft> | null
}

type PreviewDraftBridgeProps = {
  form: UseFormReturn<ResumeDraft>
  selectedRegionId: string | null
  onSelectedRegionChange: (regionId: string, fallbackSectionId: string | null) => void
}

export const PreviewDraftBridge = forwardRef<PreviewDraftBridgeHandle, PreviewDraftBridgeProps>(
  function PreviewDraftBridge({ form, selectedRegionId, onSelectedRegionChange }, forwardedRef) {
    const watchedDraft = useWatch({ control: form.control })
    const deferredWatchedDraft = useDeferredValue(watchedDraft)
    const currentDraftResult = useMemo(
      () => resumeDraftSchema.safeParse(watchedDraft),
      [watchedDraft],
    )
    const deferredDraftResult = useMemo(
      () => resumeDraftSchema.safeParse(deferredWatchedDraft),
      [deferredWatchedDraft],
    )
    const currentDraft = currentDraftResult.success ? currentDraftResult.data : null
    const deferredDraft = deferredDraftResult.success ? deferredDraftResult.data : null
    const { previewDraft, reapplyAssetErrors } = usePreviewAssets(form, currentDraft, deferredDraft)
    const previewRegionParents = useMemo(
      () =>
        deferredDraft === null
          ? new Map<string, string>()
          : buildPreviewRegionParents(deferredDraft),
      [deferredDraft],
    )

    useImperativeHandle(
      forwardedRef,
      () => ({
        reapplyAssetErrors,
      }),
      [reapplyAssetErrors],
    )

    const selectPreviewRegion = useCallback(
      (regionId: string) => {
        onSelectedRegionChange(regionId, previewRegionParents.get(regionId) ?? null)
      },
      [onSelectedRegionChange, previewRegionParents],
    )

    return (
      <PreviewFrame
        draft={previewDraft}
        selectedRegionId={selectedRegionId}
        onSelectedRegionChange={selectPreviewRegion}
      />
    )
  },
)
