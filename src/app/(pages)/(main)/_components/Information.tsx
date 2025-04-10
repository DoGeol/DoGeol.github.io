import React from 'react'
import Link from 'next/link'
import { TInformation } from '@/app/(pages)/(main)/_constant/types'

type TProps = {
  data: TInformation
}
export default function Information({ data }: TProps): React.JSX.Element {
  return (
    <div className={'flex justify-start gap-[2.0rem]'}>
      <div
        className={
          'hover:[&_.front]:transform-rotate-y-180 hover:[&_.back]:transform-rotate-y-0 relative h-[10rem] w-[10rem] shrink-0 mo:h-[16rem] mo:w-[16rem]'
        }
        style={{ perspective: '500px' }}
      >
        <div
          className={
            'front transform-rotate-y-0 backface-visibility-hidden absolute left-0 top-0 h-full w-full overflow-hidden rounded-full border border-solid bg-[url("/profile/pdg-real.webp")] bg-cover bg-bottom bg-no-repeat transition-all duration-500 ease-in-out'
          }
        />
        <div
          className={
            'back transform-rotate-y-180-back backface-visibility-hidden absolute left-0 top-0 h-full w-full overflow-hidden rounded-full border border-solid bg-[url("/logo.png")] bg-cover bg-bottom bg-no-repeat transition-all duration-500 ease-in-out'
          }
        />
      </div>
      <div className={'p-[0.8rem] mo:p-[1.6rem]'}>
        <h1
          className={
            'break-keep text-title leading-[1.15] [&_strong]:bg-linear-to-r [&_strong]:from-blue-500 [&_strong]:to-blue-400 [&_strong]:bg-clip-text [&_strong]:text-transparent'
          }
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
        <ul
          className={
            'mt-[1.2rem] flex gap-[0.8rem] font-medium text-neutral-400 transition-all dark:text-neutral-400 mo:flex-col mo:items-start mo:justify-center'
          }
        >
          {data?.contact?.map((item) => (
            <Link
              href={`${item.type === 'email' ? `mailto:${item.url}` : `${item.url}`}`}
              key={item.id}
              target={item.target}
            >
              <li className={'cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-300'}>
                {item.name} <span className={'hidden mo:inline-block'}>: {item.url}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  )
}
