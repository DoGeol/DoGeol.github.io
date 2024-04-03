'use client'

import React, { useEffect, useMemo, useState } from 'react'
import ThemeModeButton from '@/components/theme/ThemeModeButton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function GlobalNavigation(): React.JSX.Element {
  const [scrollPercent, setScrollPercent] = useState<number>(0)
  const pathname = usePathname()
  const menuName = useMemo(() => pathname.split('/').at(1), [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollPercent(scrolled)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setScrollPercent(0)
  }, [pathname])

  return (
    <nav
      className={
        'sticky top-0 z-[9999] h-[4rem] bg-white/70 backdrop-blur-sm dark:bg-neutral-900/70'
      }
    >
      <div className={'flex items-center justify-between px-[1.6rem]'}>
        <div className={'flex items-center justify-start'}>
          {/* logo */}
          <div className={'px-[1rem]'}>
            <div className={'h-[1.4rem] w-[1.4rem]'}>
              <img src={'/logo.png'} alt={'logo-pdg'} />
            </div>
          </div>
          {/* contents */}
          <ul className={'flex gap-[0.4rem] text-[1.2rem] font-medium transition-all'}>
            <Link href={'/'}>
              <li
                className={
                  'flex h-[4rem] cursor-pointer items-center justify-center rounded-xl px-[1.2rem] hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }
              >
                <span className={menuName === '' ? 'text-blue-600 dark:text-blue-400' : ''}>
                  메인
                </span>
              </li>
            </Link>
            <Link href={'/sample'}>
              <li
                className={
                  'flex h-[4rem] cursor-pointer items-center justify-center rounded-xl px-[1.2rem] hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }
              >
                <span className={menuName === 'sample' ? 'text-blue-600 dark:text-blue-400' : ''}>
                  컴포넌트
                </span>
              </li>
            </Link>
          </ul>
        </div>
        {/* settings */}
        <ThemeModeButton />
      </div>
      {/* scroll progress bar */}
      <div
        className={'absolute bottom-0 left-0 h-[0.1rem] w-full bg-gray-200 dark:bg-neutral-600 '}
      >
        <div
          className={'h-[0.15rem] bg-sky-400 dark:bg-sky-500'}
          style={{ width: `${scrollPercent}%` }}
        ></div>
      </div>
    </nav>
  )
}
