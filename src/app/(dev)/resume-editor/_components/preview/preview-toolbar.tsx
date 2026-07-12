'use client'

import type { PreviewMode } from '@/app/(dev)/_shared/resume-preview-protocol'

export const previewPresets = {
  desktop: { label: '데스크톱', width: 1440, height: 1000 },
  tablet: { label: '태블릿', width: 768, height: 1024 },
  mobile: { label: '모바일', width: 390, height: 844 },
} as const

export type PreviewPreset = keyof typeof previewPresets

export function PreviewToolbar({
  preset,
  mode,
  scale,
  onPresetChange,
  onModeChange,
}: {
  preset: PreviewPreset
  mode: PreviewMode
  scale: number
  onPresetChange: (preset: PreviewPreset) => void
  onModeChange: (mode: PreviewMode) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-t-lg border border-slate-300 bg-white p-3 text-sm dark:border-neutral-600 dark:bg-neutral-800">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">프리뷰 viewport</legend>
        {(
          Object.entries(previewPresets) as [
            PreviewPreset,
            (typeof previewPresets)[PreviewPreset],
          ][]
        ).map(([value, option]) => (
          <label key={value} className="inline-flex items-center gap-1.5">
            <input
              type="radio"
              name="preview-viewport"
              value={value}
              checked={preset === value}
              onChange={() => onPresetChange(value)}
            />
            {option.label} {option.width}×{option.height}
          </label>
        ))}
      </fieldset>
      <div className="ml-auto inline-flex rounded-md border border-slate-300 p-0.5 dark:border-neutral-600">
        <button
          type="button"
          aria-pressed={mode === 'select'}
          className="rounded px-2 py-1 aria-pressed:bg-slate-900 aria-pressed:text-white dark:aria-pressed:bg-white dark:aria-pressed:text-neutral-950"
          onClick={() => onModeChange('select')}
        >
          선택 모드
        </button>
        <button
          type="button"
          aria-pressed={mode === 'actual'}
          className="rounded px-2 py-1 aria-pressed:bg-slate-900 aria-pressed:text-white dark:aria-pressed:bg-white dark:aria-pressed:text-neutral-950"
          onClick={() => onModeChange('actual')}
        >
          실제 화면
        </button>
      </div>
      <output aria-label="현재 프리뷰 배율">{Math.round(scale * 100)}%</output>
    </div>
  )
}
