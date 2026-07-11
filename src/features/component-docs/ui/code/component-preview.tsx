import type { PropsWithChildren } from 'react'

export function ComponentPreview({ children }: PropsWithChildren) {
  return (
    <div className="my-6 flex min-h-72 items-center justify-center rounded-xl border bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] bg-[size:16px_16px] p-6 dark:bg-[radial-gradient(#404040_1px,transparent_1px)]">
      {children}
    </div>
  )
}
