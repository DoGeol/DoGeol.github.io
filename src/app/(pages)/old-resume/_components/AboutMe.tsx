import React from 'react'
import { TAboutMe } from '@/app/(pages)/old-resume/_constant/types'

type TProps = {
  data: TAboutMe
}
export default function AboutMe({ data }: TProps): React.JSX.Element {
  return (
    <div className={'flex flex-col justify-start'}>
      <h2
        className={
          'text-title bg-linear-to-r from-blue-500 to-sky-100 bg-clip-text font-bold text-transparent'
        }
      >
        About Me
      </h2>
      <div className={'mb-8 h-px w-full bg-blue-600 dark:bg-blue-200'} />
      <strong className={'text-sub-title'} dangerouslySetInnerHTML={{ __html: data.title }} />
      <ul className={'text-desc'}>
        {data?.descriptions?.map((desc, idx) => (
          <li key={`${idx}_${desc}`} className={`tablet:pl-7 pc:pl-8 relative pl-5`}>
            <span className={'absolute top-0 left-0'}>{idx + 1}.</span>
            <span
              className={
                '[&>span]:rounded-2xl [&>span]:bg-blue-400 [&>span]:px-2.5 [&>span]:text-white dark:[&>span]:bg-blue-600'
              }
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
