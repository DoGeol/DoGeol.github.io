import React from 'react'
import { TAboutMe } from '@/app/(pages)/(main)/_constant/types'

type TProps = {
  data: TAboutMe
}
export default function AboutMe({ data }: TProps): React.JSX.Element {
  return (
    <div className={'flex flex-col justify-start'}>
      <h2
        className={
          'bg-linear-to-r from-blue-500 to-sky-100 bg-clip-text text-title font-bold text-transparent'
        }
      >
        About Me
      </h2>
      <div className={'mb-[2rem] h-[0.1rem] w-full bg-blue-600 dark:bg-blue-200'} />
      <strong className={'text-sub-title'} dangerouslySetInnerHTML={{ __html: data.title }} />
      <ul className={'text-desc'}>
        {data?.descriptions?.map((desc, idx) => (
          <li key={`${idx}_${desc}`} className={`relative pl-[clamp(1.2rem,2vw,2rem)]`}>
            <span className={'absolute left-0 top-0'}>{idx + 1}.</span>
            <span
              className={
                '[&>span]:rounded-2xl [&>span]:bg-blue-400 [&>span]:px-[0.6rem] [&>span]:text-white dark:[&>span]:bg-blue-600'
              }
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
