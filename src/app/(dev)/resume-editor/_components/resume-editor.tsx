'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm, useWatch, type FieldErrors, type FieldPath } from 'react-hook-form'

import {
  resumeDraftSchema,
  resumeSchema,
  type ResumeDraft,
} from '@/app/(pages)/resume/_model/resume-schema'

import {
  clearResumeDraft,
  readResumeDraft,
  writeResumeDraft,
} from '@/app/(dev)/resume-editor/_model/draft-storage'
import {
  downloadResumeJson,
  serializeResumeForExport,
} from '@/app/(dev)/resume-editor/_model/export-resume'
import { DocumentSettingsEditor } from '@/app/(dev)/resume-editor/_components/document-settings-editor'
import { EditorTabs, type EditorPane } from '@/app/(dev)/resume-editor/_components/editor-tabs'
import { EditorToolbar } from '@/app/(dev)/resume-editor/_components/editor-toolbar'
import { ErrorSummary } from '@/app/(dev)/resume-editor/_components/error-summary'
import { PreviewFrame } from '@/app/(dev)/resume-editor/_components/preview/preview-frame'
import { usePreviewAssets } from '@/app/(dev)/resume-editor/_components/preview/use-preview-assets'
import { SectionEditorList } from '@/app/(dev)/resume-editor/_components/section-editors/section-editor-list'
import { buildEditorRegionIndex } from '@/app/(dev)/resume-editor/_model/editor-region-index'

const SAVE_DEBOUNCE_MS = 300

const findFirstErrorPath = (
  errors: FieldErrors<ResumeDraft>,
  prefix = '',
): FieldPath<ResumeDraft> | null => {
  for (const [key, value] of Object.entries(errors)) {
    if (value === undefined) continue
    const path = prefix === '' ? key : `${prefix}.${key}`
    if ('message' in value && value.message !== undefined) {
      return path as FieldPath<ResumeDraft>
    }
    const nested = findFirstErrorPath(value as FieldErrors<ResumeDraft>, path)
    if (nested !== null) return nested
  }
  return null
}

type ResumeEditorProps = {
  initialResume: ResumeDraft
}

export function ResumeEditor({ initialResume }: ResumeEditorProps) {
  const form = useForm<ResumeDraft>({
    defaultValues: initialResume,
    resolver: zodResolver(resumeSchema),
    mode: 'onBlur',
  })
  const watchedDraft = useWatch({ control: form.control })
  const deferredWatchedDraft = useDeferredValue(watchedDraft)
  const deferredDraftResult = useMemo(
    () => resumeDraftSchema.safeParse(deferredWatchedDraft),
    [deferredWatchedDraft],
  )
  const deferredDraft = deferredDraftResult.success ? deferredDraftResult.data : null
  const { previewDraft, reapplyAssetErrors } = usePreviewAssets(form, deferredDraft)
  const [hydrated, setHydrated] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [activePane, setActivePane] = useState<EditorPane>('editor')
  const [showErrorSummary, setShowErrorSummary] = useState(false)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    initialResume.sections[0]?.id ?? null,
  )
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(
    () => new Set(initialResume.sections[0] === undefined ? [] : [initialResume.sections[0].id]),
  )
  const autosaveBaselineRef = useRef<ResumeDraft | null>(null)
  const previewRegionParentsRef = useRef(new Map<string, string>())

  useEffect(() => {
    if (deferredDraft === null) return
    const index = buildEditorRegionIndex(deferredDraft)
    deferredDraft.sections.forEach((section, sectionIndex) => {
      const prefix = `sections.${sectionIndex}`
      index.forEach((path, regionId) => {
        if (path === prefix || path.startsWith(`${prefix}.`)) {
          previewRegionParentsRef.current.set(regionId, section.id)
        }
      })
    })
  }, [deferredDraft])

  const selectPreviewRegion = useCallback(
    (regionId: string) => {
      setActivePane('editor')
      const currentDraft = form.getValues()
      if (buildEditorRegionIndex(currentDraft).has(regionId)) {
        setSelectedRegionId(regionId)
        return
      }
      const parentSectionId = previewRegionParentsRef.current.get(regionId)
      if (
        parentSectionId !== undefined &&
        currentDraft.sections.some((section) => section.id === parentSectionId)
      ) {
        setSelectedRegionId(parentSectionId)
      }
    },
    [form],
  )

  useEffect(() => {
    const result = readResumeDraft(sessionStorage)
    if (result.status === 'restored') {
      form.reset(result.draft)
    }

    let active = true
    queueMicrotask(() => {
      if (!active) return
      if (result.status === 'restored') setSavedAt(result.savedAt)
      if (result.status === 'discarded') {
        setNotice('초안을 복구할 수 없어 원본을 불러왔습니다')
      }
      setHydrated(true)
    })

    return () => {
      active = false
    }
  }, [form])

  useEffect(() => {
    if (!hydrated) return
    if (
      autosaveBaselineRef.current !== null &&
      JSON.stringify(watchedDraft) === JSON.stringify(autosaveBaselineRef.current)
    ) {
      return
    }
    autosaveBaselineRef.current = null

    const timeout = window.setTimeout(() => {
      const nextSavedAt = writeResumeDraft(sessionStorage, watchedDraft)
      setSavedAt(nextSavedAt)
    }, SAVE_DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [hydrated, watchedDraft])

  const resetDraft = () => {
    if (!window.confirm('저장된 초안을 지우고 원본으로 되돌릴까요?')) return
    clearResumeDraft(sessionStorage)
    const canonicalDraft = structuredClone(initialResume)
    autosaveBaselineRef.current = canonicalDraft
    form.reset(canonicalDraft)
    setSavedAt(null)
    setNotice('원본 이력서로 초기화했습니다')
    setShowErrorSummary(false)
  }

  const submitValidDraft = (draft: ResumeDraft) => {
    const firstAssetError = reapplyAssetErrors()
    if (firstAssetError !== null) {
      setShowErrorSummary(true)
      form.setFocus(firstAssetError)
      return
    }
    const result = serializeResumeForExport(draft)
    if (!result.success) {
      setShowErrorSummary(true)
      return
    }

    setShowErrorSummary(false)
    downloadResumeJson(result.json, document)
  }

  const submitInvalidDraft = (errors: FieldErrors<ResumeDraft>) => {
    setShowErrorSummary(true)
    const firstAssetError = reapplyAssetErrors()
    const firstErrorPath = findFirstErrorPath(errors)
    if (firstErrorPath !== null) form.setFocus(firstErrorPath)
    else if (firstAssetError !== null) form.setFocus(firstAssetError)
  }

  return (
    <main
      data-testid="resume-editor-client-root"
      data-resume-editor-client-marker="resume-editor-client-only-marker"
      className="min-h-screen bg-slate-100 text-slate-950 dark:bg-neutral-950 dark:text-neutral-100"
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(submitValidDraft, submitInvalidDraft)} noValidate>
          <EditorToolbar notice={notice} savedAt={savedAt} onReset={resetDraft} />
          <EditorTabs activePane={activePane} onChange={setActivePane} />
          <div className="tablet:grid tablet:grid-cols-2">
            <section
              id="resume-editor-pane"
              role="tabpanel"
              aria-labelledby="resume-editor-tab"
              className={`${activePane === 'editor' ? 'block' : 'hidden'} tablet:block tablet:p-6 p-4 dark:bg-neutral-950`}
            >
              <div className="mx-auto max-w-2xl space-y-5">
                <ErrorSummary visible={showErrorSummary} />
                <DocumentSettingsEditor
                  selectedRegionId={selectedRegionId}
                  onSelectedRegionChange={setSelectedRegionId}
                />
                <SectionEditorList
                  selectedRegionId={selectedRegionId}
                  onSelectedRegionChange={setSelectedRegionId}
                  openSectionIds={openSectionIds}
                  onOpenSectionIdsChange={setOpenSectionIds}
                />
              </div>
            </section>
            <section
              id="resume-preview-pane"
              role="tabpanel"
              aria-labelledby="resume-preview-tab"
              className={`${activePane === 'preview' ? 'block' : 'hidden'} tablet:block tablet:p-6 min-h-80 border-l border-slate-200 bg-slate-50 p-4 dark:border-neutral-700 dark:bg-neutral-900`}
            >
              <PreviewFrame
                draft={previewDraft}
                selectedRegionId={selectedRegionId}
                onSelectedRegionChange={selectPreviewRegion}
              />
            </section>
          </div>
        </form>
      </FormProvider>
    </main>
  )
}
