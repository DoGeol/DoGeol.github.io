import Link from 'next/link'
import type { PropsWithChildren } from 'react'

import { DocsSidebar, MobileDocsNav } from '@/features/component-docs/ui/navigation/navigation'

export default function ComponentsLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <a
        href="#component-docs-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-3"
      >
        본문으로 건너뛰기
      </a>
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur dark:bg-neutral-900/90">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <Link href="/components" className="font-semibold">
            PDG Components
          </Link>
          <div className="tablet:hidden">
            <MobileDocsNav />
          </div>
          <Link href="/" className="tablet:block hidden text-sm text-neutral-500">
            Playground
          </Link>
        </div>
      </header>
      <div className="tablet:grid-cols-[14rem_minmax(0,1fr)] pc:grid-cols-[14rem_minmax(0,1fr)_12rem] mx-auto grid max-w-7xl">
        <aside className="tablet:block sticky top-14 hidden h-[calc(100vh-3.5rem)] border-r px-5 py-8">
          <DocsSidebar />
        </aside>
        <main id="component-docs-content" className="tablet:px-10 min-w-0 px-5 py-10">
          {children}
        </main>
      </div>
    </div>
  )
}
