'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { plainResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { ResumeDocument } from '@/app/(pages)/resume/_templates/registry'
import {
  parseEditorToPreviewMessage,
  type PreviewMode,
  type PreviewToEditorMessage,
} from '@/app/(dev)/_shared/resume-preview-protocol'

import { createSelectableRegionRenderer } from './selectable-region-renderer'

export function ResumePreviewRuntime({ initialResume }: { initialResume: ResumeDraft }) {
  const [draft, setDraft] = useState(initialResume)
  const [mode, setMode] = useState<PreviewMode>('select')
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const connectedRef = useRef(false)
  const origin = typeof window === 'undefined' ? '' : window.location.origin

  const send = useCallback(
    (message: PreviewToEditorMessage) => window.parent.postMessage(message, origin),
    [origin],
  )

  useEffect(() => {
    send({ type: 'PREVIEW_READY' })
    const retry = window.setInterval(() => {
      if (!connectedRef.current) send({ type: 'PREVIEW_READY' })
    }, 500)
    return () => window.clearInterval(retry)
  }, [send])

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      const message = parseEditorToPreviewMessage(event, origin, window.parent)
      if (message === null) return
      connectedRef.current = true
      if (message.type === 'SET_PREVIEW_MODE') {
        setMode(message.mode)
        return
      }
      setDraft(message.draft)
      setSelectedRegionId(message.selectedRegionId)
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [origin])

  useEffect(() => {
    document.title = draft.metadata.title
  }, [draft.metadata.title])

  const selectableRenderer = useMemo(
    () => createSelectableRegionRenderer({ selectedRegionId, send }),
    [selectedRegionId, send],
  )

  return (
    <ResumeDocument
      resume={draft}
      renderRegion={mode === 'select' ? selectableRenderer : plainResumeRegionRenderer}
    />
  )
}
