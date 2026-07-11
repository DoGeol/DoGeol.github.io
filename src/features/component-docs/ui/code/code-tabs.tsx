'use client'

import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { CopyButton } from './copy-button'

export function CodeTabs({
  children,
  code,
  highlightedCode,
}: PropsWithChildren<{ code: string; highlightedCode: string }>) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  return (
    <section className="my-6 overflow-hidden rounded-xl border">
      <div role="tablist" className="flex items-center gap-1 border-b p-2">
        {(['preview', 'code'] as const).map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            className={`rounded-md px-3 py-1.5 text-sm ${tab === value ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300' : ''}`}
            onClick={() => setTab(value)}
          >
            {value === 'preview' ? 'Preview' : 'Code'}
          </button>
        ))}
        <div className="ml-auto">
          <CopyButton code={code} />
        </div>
      </div>
      {tab === 'preview' ? (
        <div className="flex min-h-72 items-center justify-center bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] bg-[size:16px_16px] p-6 dark:bg-[radial-gradient(#404040_1px,transparent_1px)]">
          {children}
        </div>
      ) : (
        <div
          className="docs-code overflow-x-auto text-sm"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      )}
    </section>
  )
}
