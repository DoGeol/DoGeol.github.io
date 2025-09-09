import React from 'react'
import { ABOUT_ME, CAREER, INFORMATION } from '@/app/(pages)/resume/_constant/data'
import Information from '@/app/(pages)/resume/_components/Information'
import AboutMe from '@/app/(pages)/resume/_components/AboutMe'
import Experience from '@/app/(pages)/resume/_components/Experience'

export default function Home(): React.JSX.Element {
  return (
    <div
      className={
        'mx-auto flex min-h-[calc(100dvh_-_4rem)] min-w-[30rem] max-w-[120rem] flex-col text-[1.4rem]'
      }
    >
      <div className={'mt-[3.2rem] w-full p-[3.2rem] mo:mt-[6rem]'}>
        <Information data={INFORMATION} />
      </div>
      <div className={'w-full p-[3.2rem]'}>
        <AboutMe data={ABOUT_ME} />
      </div>
      {/* Experience*/}
      <div className={'w-full p-[3.2rem]'}>
        <Experience data={CAREER} />
      </div>
    </div>
  )
}
