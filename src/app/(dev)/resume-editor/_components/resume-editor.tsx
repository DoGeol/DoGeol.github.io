'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useRef, useState } from 'react'
import { FormProvider, useForm, type FieldErrors, type FieldPath } from 'react-hook-form'

import { resumeSchema, type ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

import {
  downloadResumeJson,
  serializeResumeForExport,
} from '@/app/(dev)/resume-editor/_model/export-resume'
import { DocumentSettingsEditor } from '@/app/(dev)/resume-editor/_components/document-settings-editor'
import { EditorTabs, type EditorPane } from '@/app/(dev)/resume-editor/_components/editor-tabs'
import { EditorToolbar } from '@/app/(dev)/resume-editor/_components/editor-toolbar'
import { ErrorSummary } from '@/app/(dev)/resume-editor/_components/error-summary'
import {
  PreviewDraftBridge,
  type PreviewDraftBridgeHandle,
} from '@/app/(dev)/resume-editor/_components/preview/preview-draft-bridge'
import {
  SectionEditorList,
  type EditorFocusRequest,
} from '@/app/(dev)/resume-editor/_components/section-editors/section-editor-list'
import {
  buildEditorRegionIndex,
  findEditorNavigationTarget,
} from '@/app/(dev)/resume-editor/_model/editor-region-index'
import { useResumeDraftSession } from '@/app/(dev)/resume-editor/_model/use-resume-draft-session'

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
  const {
    notice,
    savedAt,
    resetDraft: resetDraftSession,
  } = useResumeDraftSession(form, initialResume)
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
  const previewBridgeRef = useRef<PreviewDraftBridgeHandle>(null)

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

  const selectPreviewRegion = useCallback(
    (regionId: string, fallbackSectionId: string | null) => {
      setActivePane('editor')
      setFocusRequest(null)
      const currentDraft = form.getValues()
      if (buildEditorRegionIndex(currentDraft).has(regionId)) {
        setSelectedRegionId(regionId)
        return
      }
      if (
        fallbackSectionId !== null &&
        currentDraft.sections.some((section) => section.id === fallbackSectionId)
      ) {
        setSelectedRegionId(fallbackSectionId)
      }
    },
    [form],
  )

  const resetDraft = () => {
    if (!window.confirm('저장된 초안을 지우고 원본으로 되돌릴까요?')) return
    resetDraftSession()
    setShowErrorSummary(false)
    setFirstErrorPath(null)
    setFocusRequest(null)
  }

  const submitValidDraft = (draft: ResumeDraft) => {
    const firstAssetError = previewBridgeRef.current?.reapplyAssetErrors() ?? null
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
    const firstAssetError = previewBridgeRef.current?.reapplyAssetErrors() ?? null
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
          onSubmit={(event) => {
            void form.handleSubmit(submitValidDraft, submitInvalidDraft)(event)
          }}
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
              <PreviewDraftBridge
                ref={previewBridgeRef}
                form={form}
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
