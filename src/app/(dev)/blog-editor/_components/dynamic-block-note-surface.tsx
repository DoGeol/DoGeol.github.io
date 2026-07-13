'use client'

import dynamic from 'next/dynamic'

export const DynamicBlockNoteSurface = dynamic(
  () => import('./block-note-surface').then(({ BlockNoteSurface }) => BlockNoteSurface),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-64 items-center justify-center text-sm text-neutral-500">
        에디터 불러오는 중…
      </div>
    ),
  },
)
