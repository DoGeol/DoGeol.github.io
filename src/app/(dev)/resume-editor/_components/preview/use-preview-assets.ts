'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FieldPath, UseFormReturn } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import {
  collectPreviewAssets,
  type ResumeAssetFieldPath,
} from '@/app/(dev)/resume-editor/_model/preview-assets'

type FailedAssets = Partial<Record<ResumeAssetFieldPath, string>>

export interface PreviewAssetsState {
  previewDraft: ResumeDraft | null
  failedAssets: ReadonlyArray<{ fieldPath: ResumeAssetFieldPath; url: string }>
  reapplyAssetErrors: () => ResumeAssetFieldPath | null
}

const getCurrentAssetUrl = (draft: ResumeDraft, fieldPath: ResumeAssetFieldPath) =>
  collectPreviewAssets(draft).find((asset) => asset.fieldPath === fieldPath)?.url

export function usePreviewAssets(
  form: UseFormReturn<ResumeDraft>,
  draft: ResumeDraft | null,
): PreviewAssetsState {
  const [failedAssets, setFailedAssets] = useState<FailedAssets>({})
  const validationGeneration = useRef(0)
  const assets = useMemo(() => (draft === null ? [] : collectPreviewAssets(draft)), [draft])

  useEffect(() => {
    const generation = ++validationGeneration.current
    const images = assets.map((asset) => {
      const image = new Image()
      image.onload = () => {
        if (validationGeneration.current !== generation) return
        if (getCurrentAssetUrl(form.getValues(), asset.fieldPath) !== asset.url) return
        const path = asset.fieldPath as FieldPath<ResumeDraft>
        if (form.getFieldState(path).error?.type === 'asset') form.clearErrors(path)
        setFailedAssets((current) => {
          if (current[asset.fieldPath] !== asset.url) return current
          const next = { ...current }
          delete next[asset.fieldPath]
          return next
        })
      }
      image.onerror = () => {
        if (validationGeneration.current !== generation) return
        if (getCurrentAssetUrl(form.getValues(), asset.fieldPath) !== asset.url) return
        form.setError(asset.fieldPath as FieldPath<ResumeDraft>, {
          type: 'asset',
          message: '이미지를 불러올 수 없습니다',
        })
        setFailedAssets((current) => ({ ...current, [asset.fieldPath]: asset.url }))
      }
      image.src = asset.url
      return image
    })

    return () => {
      if (validationGeneration.current === generation) validationGeneration.current += 1
      images.forEach((image) => {
        image.onload = null
        image.onerror = null
      })
    }
  }, [assets, form])

  const currentFailures = useMemo(
    () => assets.filter((asset) => failedAssets[asset.fieldPath] === asset.url),
    [assets, failedAssets],
  )
  const reapplyAssetErrors = useCallback(() => {
    currentFailures.forEach((asset) => {
      form.setError(asset.fieldPath as FieldPath<ResumeDraft>, {
        type: 'asset',
        message: '이미지를 불러올 수 없습니다',
      })
    })
    return currentFailures[0]?.fieldPath ?? null
  }, [currentFailures, form])
  const previewDraft = useMemo(
    () =>
      draft === null
        ? null
        : {
            ...draft,
            assets: {
              profileFront:
                failedAssets['assets.profileFront'] === draft.assets.profileFront
                  ? ''
                  : draft.assets.profileFront,
              profileBack:
                failedAssets['assets.profileBack'] === draft.assets.profileBack
                  ? ''
                  : draft.assets.profileBack,
            },
            sections: draft.sections.map((section, sectionIndex) => {
              if (section.type !== 'experience') return section
              return {
                ...section,
                data: {
                  ...section.data,
                  items: section.data.items.map((item, itemIndex) => {
                    const fieldPath =
                      `sections.${sectionIndex}.data.items.${itemIndex}.logoPath` as const
                    return failedAssets[fieldPath] === item.logoPath
                      ? { ...item, logoPath: '' }
                      : item
                  }),
                },
              }
            }),
          },
    [draft, failedAssets],
  )

  return { previewDraft, failedAssets: currentFailures, reapplyAssetErrors }
}
