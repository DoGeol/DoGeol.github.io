'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  type FieldErrors,
  type FieldPath,
} from 'react-hook-form'

import { resumeSchema, type ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

import { clearResumeDraft, readResumeDraft, writeResumeDraft } from '../_model/draft-storage'
import { downloadResumeJson, serializeResumeForExport } from '../_model/export-resume'
import { EditorTabs, type EditorPane } from './editor-tabs'
import { EditorToolbar } from './editor-toolbar'
import { ErrorSummary } from './error-summary'

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

type MetadataFieldProps = {
  name: 'metadata.title' | 'metadata.socialTitle' | 'metadata.description'
  label: string
  multiline?: boolean
}

function MetadataField({ name, label, multiline = false }: MetadataFieldProps) {
  const { register, formState } = useFormContextForMetadata()
  const error = formState.errors.metadata?.[name.split('.')[1] as keyof ResumeDraft['metadata']]
  const field = register(name)
  const commonProps = {
    ...field,
    id: name,
    'aria-invalid': error === undefined ? ('false' as const) : ('true' as const),
    'aria-describedby': error === undefined ? undefined : `${name}-error`,
    className:
      'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100',
  }

  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-slate-800 dark:text-neutral-200">
        {label}
      </label>
      {multiline ? <textarea {...commonProps} rows={4} /> : <input {...commonProps} />}
      {error?.message !== undefined && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-700 dark:text-red-300">
          {String(error.message)}
        </p>
      )}
    </div>
  )
}

const useFormContextForMetadata = () => useFormContext<ResumeDraft>()

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
  const [hydrated, setHydrated] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [activePane, setActivePane] = useState<EditorPane>('editor')
  const [showErrorSummary, setShowErrorSummary] = useState(false)
  const autosaveBaselineRef = useRef<ResumeDraft | null>(null)

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
    const firstErrorPath = findFirstErrorPath(errors)
    if (firstErrorPath !== null) form.setFocus(firstErrorPath)
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
          <div className="md:grid md:grid-cols-2">
            <section
              id="resume-editor-pane"
              role="tabpanel"
              aria-labelledby="resume-editor-tab"
              className={`${activePane === 'editor' ? 'block' : 'hidden'} p-4 md:block md:p-6 dark:bg-neutral-950`}
            >
              <div className="mx-auto max-w-2xl space-y-5">
                <ErrorSummary visible={showErrorSummary} />
                <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                  <h2 className="text-lg font-semibold dark:text-neutral-50">문서 정보</h2>
                  <MetadataField name="metadata.title" label="이력서 제목" />
                  <MetadataField name="metadata.socialTitle" label="소셜 제목" />
                  <MetadataField name="metadata.description" label="설명" multiline />
                </div>
              </div>
            </section>
            <section
              id="resume-preview-pane"
              role="tabpanel"
              aria-labelledby="resume-preview-tab"
              className={`${activePane === 'preview' ? 'block' : 'hidden'} min-h-80 border-l border-slate-200 bg-slate-50 p-4 md:block md:p-6 dark:border-neutral-700 dark:bg-neutral-900`}
            >
              <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                프리뷰 준비 중
              </div>
            </section>
          </div>
        </form>
      </FormProvider>
    </main>
  )
}
