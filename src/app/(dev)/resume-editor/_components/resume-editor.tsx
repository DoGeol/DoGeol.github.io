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
import {
  SectionEditorList,
  type EditorFocusRequest,
} from '@/app/(dev)/resume-editor/_components/section-editors/section-editor-list'
import {
  buildEditorRegionIndex,
  findEditorNavigationTarget,
} from '@/app/(dev)/resume-editor/_model/editor-region-index'

const SAVE_DEBOUNCE_MS = 300

const findFirstErrorPath = (
  errors: FieldErrors<ResumeDraft>,
  prefix = '',
): FieldPath<ResumeDraft> | null => {
  for (const [key, value] of Object.entries(errors)) {
    if (value === undefined) continue
    const path = prefix === '' ? key : `${prefix}.${key}`
    if ('message' in value && value.message !== undefined) {
      if ('type' in value && (value.type === 'asset' || value.type === 'asset-pending')) continue
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
    shouldFocusError: false,
  })
  const watchedDraft = useWatch({ control: form.control })
  const deferredWatchedDraft = useDeferredValue(watchedDraft)
  const deferredDraftResult = useMemo(
    () => resumeDraftSchema.safeParse(deferredWatchedDraft),
    [deferredWatchedDraft],
  )
  const currentDraftResult = useMemo(
    () => resumeDraftSchema.safeParse(watchedDraft),
    [watchedDraft],
  )
  const currentDraft = currentDraftResult.success ? currentDraftResult.data : null
  const deferredDraft = deferredDraftResult.success ? deferredDraftResult.data : null
  const { previewDraft, reapplyAssetErrors } = usePreviewAssets(form, currentDraft, deferredDraft)
  const [hydrated, setHydrated] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [activePane, setActivePane] = useState<EditorPane>('editor')
  const [showErrorSummary, setShowErrorSummary] = useState(false)
  const [firstErrorPath, setFirstErrorPath] = useState<FieldPath<ResumeDraft> | null>(null)
  const [focusRequest, setFocusRequest] = useState<EditorFocusRequest | null>(null)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    initialResume.sections[0]?.id ?? null,
  )
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(
    () => new Set(initialResume.sections[0] === undefined ? [] : [initialResume.sections[0].id]),
  )
  const autosaveBaselineRef = useRef<ResumeDraft | null>(null)
  const previewRegionParentsRef = useRef(new Map<string, string>())

  const navigateToField = useCallback(
    (fieldPath: FieldPath<ResumeDraft>) => {
      const draft = form.getValues()
      const target = findEditorNavigationTarget(draft, fieldPath)
      setActivePane('editor')
      if (target.sectionId !== null) {
        setOpenSectionIds((current) => new Set([...current, target.sectionId!]))
      }
      if (target.regionId !== null) setSelectedRegionId(target.regionId)
      setFocusRequest((current) => ({
        token: (current?.token ?? 0) + 1,
        regionId: target.regionId,
        sectionId: target.sectionId,
        fieldPath,
      }))
    },
    [form],
  )

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
      setFocusRequest(null)
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
    const parsedDraft = resumeDraftSchema.safeParse(watchedDraft)
    if (!parsedDraft.success) return
    if (
      autosaveBaselineRef.current !== null &&
      JSON.stringify(parsedDraft.data) === JSON.stringify(autosaveBaselineRef.current)
    ) {
      return
    }
    autosaveBaselineRef.current = null

    const timeout = window.setTimeout(() => {
      const nextSavedAt = writeResumeDraft(sessionStorage, parsedDraft.data)
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
    setFirstErrorPath(null)
    setFocusRequest(null)
  }

  const submitValidDraft = (draft: ResumeDraft) => {
    const firstAssetError = reapplyAssetErrors()
    if (firstAssetError !== null) {
      setShowErrorSummary(true)
      setFirstErrorPath(firstAssetError)
      navigateToField(firstAssetError)
      return
    }
    const result = serializeResumeForExport(draft)
    if (!result.success) {
      setShowErrorSummary(true)
      const firstIssuePath = result.issues[0]?.path.join('.') as FieldPath<ResumeDraft> | undefined
      setFirstErrorPath(firstIssuePath ?? null)
      if (firstIssuePath !== undefined) navigateToField(firstIssuePath)
      return
    }

    setShowErrorSummary(false)
    setFirstErrorPath(null)
    downloadResumeJson(result.json, document)
  }

  const submitInvalidDraft = (errors: FieldErrors<ResumeDraft>) => {
    setShowErrorSummary(true)
    const strictResult = resumeSchema.safeParse(form.getValues())
    const firstStrictPath = strictResult.success
      ? null
      : (strictResult.error.issues[0]?.path.join('.') as FieldPath<ResumeDraft> | undefined)
    const firstAssetError = reapplyAssetErrors()
    const firstErrorPath = findFirstErrorPath(errors)
    const targetPath = firstStrictPath ?? firstErrorPath ?? firstAssetError
    setFirstErrorPath(targetPath)
    if (targetPath !== null) navigateToField(targetPath)
  }

  return (
    <main
      data-testid="resume-editor-client-root"
      data-resume-editor-client-marker="resume-editor-client-only-marker"
      className="h-dvh overflow-hidden bg-slate-100 text-slate-950 dark:bg-neutral-950 dark:text-neutral-100 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:scroll-auto motion-reduce:[&_*]:transition-none [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-blue-600 dark:[&_button]:focus-visible:outline-blue-300"
    >
      <FormProvider {...form}>
        <form
          className="flex h-full min-h-0 flex-col overflow-hidden"
          onSubmit={form.handleSubmit(submitValidDraft, submitInvalidDraft)}
          noValidate
        >
          <EditorToolbar notice={notice} savedAt={savedAt} onReset={resetDraft} />
          <EditorTabs activePane={activePane} onChange={setActivePane} />
          <div
            data-testid="editor-content"
            className="tablet:grid-cols-[minmax(22rem,2fr)_minmax(0,3fr)] tablet:grid min-h-0 flex-1 overflow-hidden"
          >
            <section
              id="resume-editor-pane"
              role="tabpanel"
              aria-labelledby="resume-editor-tab"
              className={`${activePane === 'editor' ? 'block' : 'hidden'} tablet:block tablet:p-6 min-h-0 min-w-0 overflow-y-auto p-4 dark:bg-neutral-950`}
            >
              <div className="mx-auto max-w-2xl space-y-5">
                <ErrorSummary
                  visible={showErrorSummary}
                  canNavigate={firstErrorPath !== null}
                  onNavigate={() => {
                    if (firstErrorPath !== null) navigateToField(firstErrorPath)
                  }}
                />
                <DocumentSettingsEditor
                  selectedRegionId={selectedRegionId}
                  onSelectedRegionChange={setSelectedRegionId}
                />
                <SectionEditorList
                  selectedRegionId={selectedRegionId}
                  onSelectedRegionChange={setSelectedRegionId}
                  openSectionIds={openSectionIds}
                  onOpenSectionIdsChange={setOpenSectionIds}
                  focusRequest={focusRequest}
                />
              </div>
            </section>
            <section
              id="resume-preview-pane"
              role="tabpanel"
              aria-labelledby="resume-preview-tab"
              className={`${activePane === 'preview' ? 'block' : 'hidden'} tablet:block tablet:p-6 min-h-0 min-w-0 overflow-y-auto border-l border-slate-500 bg-slate-800 p-4 dark:border-neutral-400 dark:bg-neutral-950`}
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
