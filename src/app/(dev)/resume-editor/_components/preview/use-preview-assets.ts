'use client'

import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import type { FieldPath, UseFormReturn } from 'react-hook-form'

import { resumeDraftSchema, type ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import {
  collectPreviewAssets,
  type PreviewAsset,
  type ResumeAssetFieldPath,
} from '@/app/(dev)/resume-editor/_model/preview-assets'

type AssetValidationStatus = 'pending' | 'succeeded' | 'failed'

type AssetValidation = {
  url: string
  status: AssetValidationStatus
}

export interface PreviewAssetsState {
  previewDraft: ResumeDraft | null
  failedAssets: ReadonlyArray<{ fieldPath: ResumeAssetFieldPath; url: string }>
  reapplyAssetErrors: () => ResumeAssetFieldPath | null
}

const pendingMessage = '이미지 확인이 끝날 때까지 기다려 주세요'
const failedMessage = '이미지를 불러올 수 없습니다'

const isAssetError = (type: unknown) => type === 'asset' || type === 'asset-pending'

export function usePreviewAssets(
  form: UseFormReturn<ResumeDraft>,
  validationDraft: ResumeDraft | null,
  previewSource: ResumeDraft | null = validationDraft,
): PreviewAssetsState {
  const [validations, setValidations] = useState<
    ReadonlyMap<ResumeAssetFieldPath, AssetValidation>
  >(new Map())
  const validationGeneration = useRef(0)
  const collectedAssets = validationDraft === null ? [] : collectPreviewAssets(validationDraft)
  const assetSignature = JSON.stringify(collectedAssets)
  const assets = useMemo(() => JSON.parse(assetSignature) as PreviewAsset[], [assetSignature])
  const currentValidations = useMemo(
    () =>
      new Map(
        assets.map((asset) => {
          const existing = validations.get(asset.fieldPath)
          return [
            asset.fieldPath,
            existing?.url === asset.url
              ? existing
              : ({ url: asset.url, status: 'pending' } satisfies AssetValidation),
          ] as const
        }),
      ),
    [assets, validations],
  )
  const getCurrentValidation = useEffectEvent((fieldPath: ResumeAssetFieldPath) =>
    currentValidations.get(fieldPath),
  )

  useEffect(() => {
    const generation = ++validationGeneration.current
    const images: HTMLImageElement[] = []

    assets.forEach((asset) => {
      const validation = getCurrentValidation(asset.fieldPath)
      const path = asset.fieldPath as FieldPath<ResumeDraft>
      const currentError = form.getFieldState(path).error
      if (
        validation?.status === 'pending' &&
        (currentError === undefined || isAssetError(currentError.type))
      ) {
        form.setError(path, { type: 'asset-pending', message: pendingMessage })
      } else if (
        validation?.status === 'failed' &&
        (currentError === undefined || isAssetError(currentError.type))
      ) {
        form.setError(path, { type: 'asset', message: failedMessage })
      }
      if (validation?.status !== 'pending') return

      const image = new Image()
      image.onload = () => {
        if (validationGeneration.current !== generation) return
        const currentUrl = collectPreviewAssets(form.getValues()).find(
          ({ fieldPath }) => fieldPath === asset.fieldPath,
        )?.url
        if (currentUrl !== asset.url) return
        setValidations((current) => {
          const next = new Map(current)
          next.set(asset.fieldPath, { url: asset.url, status: 'succeeded' })
          return next
        })
        const error = form.getFieldState(path).error
        if (isAssetError(error?.type)) form.clearErrors(path)
      }
      image.onerror = () => {
        if (validationGeneration.current !== generation) return
        const currentUrl = collectPreviewAssets(form.getValues()).find(
          ({ fieldPath }) => fieldPath === asset.fieldPath,
        )?.url
        if (currentUrl !== asset.url) return
        setValidations((current) => {
          const next = new Map(current)
          next.set(asset.fieldPath, { url: asset.url, status: 'failed' })
          return next
        })
        const error = form.getFieldState(path).error
        if (error === undefined || isAssetError(error.type)) {
          form.setError(path, { type: 'asset', message: failedMessage })
        }
      }
      image.src = asset.url
      images.push(image)
    })

    return () => {
      if (validationGeneration.current === generation) validationGeneration.current += 1
      images.forEach((image) => {
        image.onload = null
        image.onerror = null
      })
    }
  }, [assets, form])

  const getCurrentBlockedAssets = useCallback(() => {
    const parsed = resumeDraftSchema.safeParse(form.getValues())
    if (!parsed.success) return []
    return collectPreviewAssets(parsed.data).flatMap((asset) => {
      const validation = validations.get(asset.fieldPath)
      if (validation?.url === asset.url && validation.status === 'succeeded') return []
      return [{ ...asset, status: validation?.url === asset.url ? validation.status : 'pending' }]
    })
  }, [form, validations])

  const reapplyAssetErrors = useCallback(() => {
    const blockedAssets = getCurrentBlockedAssets()
    blockedAssets.forEach((asset) => {
      const path = asset.fieldPath as FieldPath<ResumeDraft>
      const currentError = form.getFieldState(path).error
      if (currentError !== undefined && !isAssetError(currentError.type)) return
      form.setError(path, {
        type: asset.status === 'failed' ? 'asset' : 'asset-pending',
        message: asset.status === 'failed' ? failedMessage : pendingMessage,
      })
    })
    return blockedAssets[0]?.fieldPath ?? null
  }, [form, getCurrentBlockedAssets])

  const failedAssets = useMemo(
    () => assets.filter((asset) => currentValidations.get(asset.fieldPath)?.status === 'failed'),
    [assets, currentValidations],
  )
  const previewDraft = useMemo(
    () =>
      previewSource === null
        ? null
        : {
            ...previewSource,
            assets: {
              profileFront: failedAssets.some(
                ({ fieldPath, url }) =>
                  fieldPath === 'assets.profileFront' && url === previewSource.assets.profileFront,
              )
                ? ''
                : previewSource.assets.profileFront,
              profileBack: failedAssets.some(
                ({ fieldPath, url }) =>
                  fieldPath === 'assets.profileBack' && url === previewSource.assets.profileBack,
              )
                ? ''
                : previewSource.assets.profileBack,
            },
            sections: previewSource.sections.map((section, sectionIndex) => {
              if (section.type !== 'experience') return section
              return {
                ...section,
                data: {
                  ...section.data,
                  items: section.data.items.map((item, itemIndex) => {
                    const fieldPath =
                      `sections.${sectionIndex}.data.items.${itemIndex}.logoPath` as const
                    return failedAssets.some(
                      (asset) => asset.fieldPath === fieldPath && asset.url === item.logoPath,
                    )
                      ? { ...item, logoPath: '' }
                      : item
                  }),
                },
              }
            }),
          },
    [failedAssets, previewSource],
  )

  return { previewDraft, failedAssets, reapplyAssetErrors }
}
