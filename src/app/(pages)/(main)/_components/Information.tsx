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
          '[&_.front]:hover:transform-rotate-y-180 [&_.back]:hover:transform-rotate-y-0 relative h-[10rem] w-[10rem] shrink-0 mo:h-[16rem] mo:w-[16rem]'
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
          className={'text-title break-keep leading-[1.15] [&_strong]:text-sky-600'}
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
        <ul
          className={
            'mt-[1.2rem] flex items-center justify-start gap-[0.8rem] font-medium capitalize text-neutral-400 transition-all dark:text-neutral-400'
          }
        >
          {data?.contact?.map((item) => (
            <Link
              href={`${item.type === 'email' ? `mailto:${item.url}` : `${item.url}`}`}
              key={item.id}
              target={item.target}
            >
              <li className={'cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-300'}>
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  )
}
