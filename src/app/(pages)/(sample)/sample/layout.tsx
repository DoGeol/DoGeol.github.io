import { PropsWithChildren } from 'react'
import SampleComponentMenus from '@/app/(pages)/(sample)/sample/_components/Menus'
import Link from 'next/link'
import SampleComponentPageTitle from '@/app/(pages)/(sample)/sample/_components/PageTitle'
import { menusData } from '@/app/(pages)/(sample)/sample/_constant/menus'
import ThemeModeButton from '@/components/theme/ThemeModeButton'

export default function SampleLayout({ children }: PropsWithChildren) {
  return (
    <div
      className={
        'flex min-h-screen min-w-[30rem] flex-col text-[1.4rem] text-gray-700 dark:bg-neutral-900 dark:text-gray-300'
      }
    >
      <header
        className={
          'sticky top-0 border-b-[0.1rem] bg-sky-100/70 px-[2rem] py-[1.2rem] backdrop-blur-sm tablet:px-[3.2rem] tablet:py-[1.4rem] dark:border-b-neutral-600 dark:bg-neutral-800/70'
        }
      >
        <div className={'flex items-center justify-between'}>
          <div className={'flex items-center justify-start gap-[0.8rem]'}>
            {/* heroicons bars-3*/}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-[clamp(1.4rem,4vw,2rem)] w-[clamp(1.4rem,4vw,2rem)] cursor-pointer hover:text-sky-500 tablet:hidden"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <Link href={'/sample'}>
              <h1 className={'text-[clamp(1.4rem,4vw,2rem)] font-bold'}>Sample Preview Page</h1>
            </Link>
          </div>
          <div className={'flex items-center justify-end gap-[1.6rem]'}>
            <ThemeModeButton />
            <div className={'h-[3.2rem] w-[3.2rem] cursor-pointer overflow-hidden rounded-lg'}>
              <img src={'/profile/pdg.png'} />
            </div>
          </div>
        </div>
      </header>
      <div className={'flex'}>
        <aside
          className={
            'fixed hidden w-[30rem] flex-shrink-0 overflow-y-auto px-[2rem] py-[1.2rem] tablet:block tablet:px-[3.2rem] tablet:py-[1.4rem] dark:border-r-neutral-600'
          }
        >
          <SampleComponentMenus menus={menusData} />
        </aside>
        <main
          className={
            'w-full px-[2rem] py-[1.2rem] tablet:px-[3.2rem] tablet:py-[1.4rem] tablet:pl-[32rem]'
          }
        >
          <SampleComponentPageTitle />
          {children}
        </main>
      </div>
    </div>
  )
}
