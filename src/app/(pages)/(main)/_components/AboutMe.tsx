import React from 'react'
import { TAboutMe } from '@/app/(pages)/(main)/_constant/types'
import { ABOUT_ME } from '@/app/(pages)/(main)/_constant/data'

type TProps = {
  data: TAboutMe
}
export default function AboutMe({ data }: TProps): React.JSX.Element {
  return (
    <div className={'flex flex-col justify-start gap-[1.6rem]'}>
      <h2 className={'text-title'}>About Me</h2>
      <strong className={'text-sub-title'} dangerouslySetInnerHTML={{ __html: ABOUT_ME.title }} />
      <ul className={'text-desc'}>
        {ABOUT_ME?.descriptions?.map((desc, idx) => (
          <li key={`${idx}_${desc}`} className={`relative pl-[clamp(1.2rem,2vw,2rem)]`}>
            <span className={'absolute left-0 top-0'}>{idx + 1}.</span>
            <span
              className={
                '[&>span]:rounded-2xl [&>span]:bg-sky-200 [&>span]:px-[0.8rem] [&>span]:dark:bg-sky-700'
              }
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
