'use client'

import { useEffect, useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(''), 2000)
    return () => window.clearTimeout(timer)
  }, [message])

  return (
    <div className="flex items-center gap-2">
      <span role="status" aria-live="polite" className="text-xs text-neutral-500">
        {message}
      </span>
      <button
        type="button"
        aria-label="코드 복사"
        className="rounded-md border px-3 py-1.5 text-xs"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code)
            setMessage('복사됨')
          } catch {
            setMessage('복사 실패')
          }
        }}
      >
        Copy
      </button>
    </div>
  )
}
