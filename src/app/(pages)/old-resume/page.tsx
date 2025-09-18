import React from 'react'
import { ABOUT_ME, CAREER, INFORMATION } from '@/app/(pages)/old-resume/_constant/data'
import Information from '@/app/(pages)/old-resume/_components/Information'
import AboutMe from '@/app/(pages)/old-resume/_components/AboutMe'
import Experience from '@/app/(pages)/old-resume/_components/Experience'

export default function Home(): React.JSX.Element {
  return (
    <div
      className={
        'mx-auto flex min-h-[calc(100dvh-theme(spacing.16))] min-w-xs max-w-7xl flex-col text-lg'
      }
    >
      <div className={'w-full p-12 mt-12 tablet:mt-24'}>
        <Information data={INFORMATION} />
      </div>
      <div className={'w-full p-12'}>
        <AboutMe data={ABOUT_ME} />
      </div>
      {/* Experience*/}
      <div className={'w-full p-12'}>
        <Experience data={CAREER} />
      </div>
    </div>
  )
}