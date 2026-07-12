'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { resumeDraftSchema, type ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import {
  clearResumeDraft,
  readResumeDraft,
  writeResumeDraft,
} from '@/app/(dev)/resume-editor/_model/draft-storage'

const SAVE_DEBOUNCE_MS = 300

export interface ResumeDraftSession {
  notice: string | null
  savedAt: string | null
  resetDraft: () => void
}

export function useResumeDraftSession(
  form: UseFormReturn<ResumeDraft>,
  initialResume: ResumeDraft,
): ResumeDraftSession {
  const [notice, setNotice] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const hydratedRef = useRef(false)
  const saveTimeoutRef = useRef<number | null>(null)
  const suppressedSignatureRef = useRef<string | null>(null)

  const clearPendingSave = useCallback(() => {
    if (saveTimeoutRef.current === null) return
    window.clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = null
  }, [])

  useEffect(() => {
    let active = true
    hydratedRef.current = false

    const result = readResumeDraft(sessionStorage)
    if (result.status === 'restored') form.reset(result.draft)

    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        if (!hydratedRef.current) return
        clearPendingSave()

        const parsedDraft = resumeDraftSchema.safeParse(values)
        if (!parsedDraft.success) return

        const signature = JSON.stringify(parsedDraft.data)
        if (signature === suppressedSignatureRef.current) {
          suppressedSignatureRef.current = null
          return
        }
        suppressedSignatureRef.current = null

        saveTimeoutRef.current = window.setTimeout(() => {
          const nextSavedAt = writeResumeDraft(sessionStorage, parsedDraft.data)
          saveTimeoutRef.current = null
          setSavedAt(nextSavedAt)
        }, SAVE_DEBOUNCE_MS)
      },
    })

    queueMicrotask(() => {
      if (!active) return
      if (result.status === 'restored') setSavedAt(result.savedAt)
      if (result.status === 'discarded') {
        setNotice('초안을 복구할 수 없어 원본을 불러왔습니다')
      }
      hydratedRef.current = true
    })

    return () => {
      active = false
      hydratedRef.current = false
      unsubscribe()
      clearPendingSave()
    }
  }, [clearPendingSave, form])

  const resetDraft = useCallback(() => {
    clearPendingSave()
    clearResumeDraft(sessionStorage)
    const canonicalDraft = structuredClone(initialResume)
    suppressedSignatureRef.current = JSON.stringify(canonicalDraft)
    form.reset(canonicalDraft)
    setSavedAt(null)
    setNotice('원본 이력서로 초기화했습니다')
  }, [clearPendingSave, form, initialResume])

  return { notice, savedAt, resetDraft }
}
