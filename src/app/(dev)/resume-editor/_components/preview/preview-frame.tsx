'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import {
  parsePreviewToEditorMessage,
  type EditorToPreviewMessage,
  type PreviewMode,
} from '@/app/(dev)/_shared/resume-preview-protocol'

import { PreviewStage } from './preview-stage'
import { PreviewToolbar, previewPresets, type PreviewPreset } from './preview-toolbar'

const HANDSHAKE_TIMEOUT_MS = 3000

export function PreviewFrame({
  draft,
  selectedRegionId,
  onSelectedRegionChange,
}: {
  draft: ResumeDraft | null
  selectedRegionId: string | null
  onSelectedRegionChange: (regionId: string) => void
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const handshakeTimeoutRef = useRef<number | null>(null)
  const [preset, setPreset] = useState<PreviewPreset>('desktop')
  const [mode, setMode] = useState<PreviewMode>('select')
  const [scale, setScale] = useState(1)
  const [ready, setReady] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [frameKey, setFrameKey] = useState(0)
  const viewport = previewPresets[preset]
  const origin = typeof window === 'undefined' ? '' : window.location.origin

  const post = useCallback(
    (message: EditorToPreviewMessage) =>
      iframeRef.current?.contentWindow?.postMessage(message, origin),
    [origin],
  )

  useEffect(() => {
    handshakeTimeoutRef.current = window.setTimeout(() => setTimedOut(true), HANDSHAKE_TIMEOUT_MS)
    return () => {
      if (handshakeTimeoutRef.current !== null) {
        window.clearTimeout(handshakeTimeoutRef.current)
        handshakeTimeoutRef.current = null
      }
    }
  }, [frameKey])

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      const source = iframeRef.current?.contentWindow
      if (source === null || source === undefined) return
      const message = parsePreviewToEditorMessage(event, origin, source)
      if (message === null) return
      if (message.type === 'PREVIEW_READY') {
        if (handshakeTimeoutRef.current !== null) {
          window.clearTimeout(handshakeTimeoutRef.current)
          handshakeTimeoutRef.current = null
        }
        setReady(true)
        setTimedOut(false)
        return
      }
      onSelectedRegionChange(message.regionId)
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [onSelectedRegionChange, origin])

  useEffect(() => {
    if (!ready || draft === null) return
    post({ type: 'RENDER_DRAFT', draft, selectedRegionId })
  }, [draft, post, ready, selectedRegionId])

  useEffect(() => {
    if (!ready) return
    post({ type: 'SET_PREVIEW_MODE', mode })
  }, [mode, post, ready])

  return (
    <div className="flex h-full min-h-80 flex-col">
      <PreviewToolbar
        preset={preset}
        mode={mode}
        scale={scale}
        status={timedOut ? '연결 실패' : ready ? '연결됨' : '연결 중'}
        onPresetChange={setPreset}
        onModeChange={setMode}
      />
      {timedOut && (
        <div
          role="alert"
          className="flex items-center justify-between border-x border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          <span>프리뷰에 연결하지 못했습니다</span>
          <button
            type="button"
            className="rounded border border-red-700 px-2 py-1 dark:border-red-400"
            onClick={() => {
              setReady(false)
              setTimedOut(false)
              setFrameKey((current) => current + 1)
            }}
          >
            다시 연결
          </button>
        </div>
      )}
      <PreviewStage viewport={viewport} onScaleChange={setScale}>
        {(currentScale) => (
          <iframe
            key={frameKey}
            ref={iframeRef}
            title="실제 이력서 프리뷰"
            src="/resume-preview"
            width={viewport.width}
            height={viewport.height}
            className="block border-0 bg-white"
            style={{ transform: `scale(${currentScale})`, transformOrigin: 'top left' }}
          />
        )}
      </PreviewStage>
    </div>
  )
}
