import Link from 'next/link'

import ThemeModeButton from '@/features/theme-toggle'

export function BlogHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="tablet:px-8 mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        <nav aria-label="블로그 주 메뉴" className="flex items-center gap-8">
          <Link
            href="/blog"
            className="text-base font-bold tracking-tight text-slate-900 dark:text-white"
          >
            PDG Dev Notes
          </Link>
          <div className="tablet:flex hidden items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
            <Link
              href="/blog"
              className="flex h-14 items-center border-b-2 border-blue-600 font-semibold text-blue-600 dark:border-blue-400 dark:text-blue-400"
            >
              블로그
            </Link>
            <Link href="/blog#tags" className="hover:text-primary-600 dark:hover:text-primary-400">
              태그
            </Link>
            <Link href="/resume" className="hover:text-primary-600 dark:hover:text-primary-400">
              소개
            </Link>
          </div>
        </nav>
        <ThemeModeButton />
      </div>
    </header>
  )
}
