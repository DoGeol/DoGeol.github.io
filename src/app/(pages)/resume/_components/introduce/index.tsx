import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import introduce from '@/app/(pages)/resume/_infos/introduce'
import dayjs from 'dayjs'
import HighlightedText from '@/features/highlighted-text'

const Introduce = () => {
  return (
    <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start gap-4')}>
      <h2 className={'text-primary-600 dark:text-primary-500 text-3xl font-medium'}>Introduce</h2>
      <div className={'h-full w-full space-y-3.5 break-keep'}>
        {introduce.textList.map((s) => (
          <p key={s} className={'leading-relaxed'}>
            <HighlightedText text={s} useUnderline={false} />
          </p>
        ))}
      </div>
      <div
        className={
          'flex w-full flex-col items-end justify-end text-sm font-extralight text-shadow-md'
        }
      >
        <p className={'inline-flex items-center justify-center gap-x-1'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4 fill-green-400"
          >
            <path
              fillRule="evenodd"
              d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clipRule="evenodd"
            />
          </svg>
          Latest Updated
        </p>
        <p className={'text-sm'}>{dayjs(introduce.latestUpdatedDate).format('YYYY. MM. DD')}</p>
      </div>
    </article>
  )
}

export default Introduce
