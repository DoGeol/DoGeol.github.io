'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { calculatePreviewScale, type Size } from '@/app/(dev)/resume-editor/_model/preview-scale'

export function PreviewStage({
  viewport,
  onScaleChange,
  children,
}: {
  viewport: Size
  onScaleChange: (scale: number) => void
  children: (scale: number) => ReactNode
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [available, setAvailable] = useState<Size | null>(null)
  const scale = available === null ? 1 : calculatePreviewScale(available, viewport)

  useEffect(() => {
    const stage = stageRef.current
    if (stage === null || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      if (entry === undefined || entry.contentRect.width <= 0 || entry.contentRect.height <= 0)
        return
      setAvailable({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => onScaleChange(scale), [onScaleChange, scale])

  return (
    <div
      ref={stageRef}
      data-testid="preview-stage"
      className="min-h-0 flex-1 overflow-auto rounded-b-lg border-x border-b border-slate-300 bg-slate-200 dark:border-neutral-600 dark:bg-neutral-950"
    >
      <div style={{ width: viewport.width * scale, height: viewport.height * scale }}>
        {children(scale)}
      </div>
    </div>
  )
}
