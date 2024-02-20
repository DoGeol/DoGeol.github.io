import React from 'react'
import ThemeModeButton from '@/components/theme/ThemeModeButton'
import Link from 'next/link'

export default function GlobalNavigation(): React.JSX.Element {
  return (
    <nav
      className={
        'sticky top-0 z-[9999] flex h-[3rem] items-center justify-between border-b border-solid bg-white/70 px-[1.6rem] backdrop-blur-sm dark:border-b-neutral-600 dark:bg-neutral-900/70'
      }
    >
      <div className={'flex items-center justify-start'}>
        {/* logo */}
        <div className={'px-[1rem]'}>
          <div className={'h-[1.4rem] w-[1.4rem]'}>
            <img src={'/logo.png'} alt={'logo-pdg'} />
          </div>
        </div>
        {/* contents */}
        <ul className={'flex gap-[0.4rem] text-[1.2rem] font-medium [&>li]:transition-all'}>
          <Link href={'/'}>
            <li
              className={
                'dark:hover:bg-neutral-80 flex h-[3rem] cursor-pointer items-center justify-center rounded-xl px-[1.2rem] hover:bg-neutral-200'
              }
            >
              <span>메인</span>
            </li>
          </Link>
          <Link href={'/sample'}>
            <li
              className={
                'dark:hover:bg-neutral-80 flex h-[3rem] cursor-pointer items-center justify-center rounded-xl px-[1.2rem] hover:bg-neutral-200'
              }
            >
              <span>샘플</span>
            </li>
          </Link>
        </ul>
      </div>
      {/* settings */}
      <ThemeModeButton />
    </nav>
  )
}
