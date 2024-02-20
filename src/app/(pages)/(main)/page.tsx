import Information from '@/app/(pages)/(main)/_components/Information'
import React from 'react'
import { ABOUT_ME, INFORMATION } from '@/app/(pages)/(main)/_constant/data'
import AboutMe from '@/app/(pages)/(main)/_components/AboutMe'

export default function Home(): React.JSX.Element {
  return (
    <div
      className={
        'mx-auto flex min-h-[calc(100dvh_-_3rem)] min-w-[30rem] max-w-[80rem] flex-col text-[1.4rem]'
      }
    >
      <div className={'mt-[3.2rem] w-full p-[3.2rem] mo:mt-[6rem]'}>
        <Information data={INFORMATION} />
      </div>
      {/*<div className={'my-[3.2rem] h-[0.1rem] w-full bg-black dark:bg-neutral-400'}></div>*/}
      <div className={'w-full p-[3.2rem]'}>
        <AboutMe data={ABOUT_ME} />
      </div>
      <div className={'w-full p-[3.2rem]'}>
        <div className={'flex flex-col justify-start gap-[1.6rem]'}>
          <h2 className={'text-title'}>Experience</h2>
          <div className={'text-desc h-[300rem]'}></div>
        </div>
      </div>
    </div>
  )
}
