import React from 'react'
import Link from 'next/link'
import { TInformation } from '@/app/(pages)/old-resume/_constant/types'

type TProps = {
  data: TInformation
}
export default function Information({ data }: TProps): React.JSX.Element {
  return (
    <div className={'flex justify-start gap-8'}>
      <div
        className={
          'hover:[&_.front]:transform-rotate-y-180 hover:[&_.back]:transform-rotate-y-0 tablet:h-64 tablet:w-64 relative h-40 w-40 shrink-0'
        }
        style={{ perspective: '500px' }}
      >
        <div
          className={
            'front transform-rotate-y-0 backface-visibility-hidden absolute top-0 left-0 h-full w-full overflow-hidden rounded-full border border-solid bg-[url("/profile/pdg-real.webp")] bg-cover bg-bottom bg-no-repeat transition-all duration-500 ease-in-out'
          }
        />
        <div
          className={
            'back transform-rotate-y-180-back backface-visibility-hidden absolute top-0 left-0 h-full w-full overflow-hidden rounded-full border border-solid bg-[url("/logo.png")] bg-cover bg-bottom bg-no-repeat transition-all duration-500 ease-in-out'
          }
        />
      </div>
      <div className={'tablet:p-6 p-3'}>
        <h1
          className={
            'text-title leading-[1.15] break-keep [&_strong]:bg-linear-to-r [&_strong]:from-blue-500 [&_strong]:to-blue-400 [&_strong]:bg-clip-text [&_strong]:text-transparent'
          }
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
        <ul
          className={
            'tablet:flex-col tablet:items-start tablet:justify-center mt-5 flex gap-3 font-medium text-neutral-400 transition-all dark:text-neutral-400'
          }
        >
          {data?.contact?.map((item) => (
            <Link
              href={`${item.type === 'email' ? `mailto:${item.url}` : `${item.url}`}`}
              key={item.id}
              target={item.target}
            >
              <li className={'cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-300'}>
                {item.name} <span className={'tablet:inline-block hidden'}>: {item.url}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  )
}
