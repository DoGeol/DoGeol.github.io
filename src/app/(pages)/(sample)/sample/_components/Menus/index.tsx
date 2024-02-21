'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IMenu } from '@/app/(pages)/(sample)/sample/_constant/menus'

type TSampleComponentMenusProps = {
  menus: IMenu[]
}
export default function SampleComponentMenus({
  menus = [],
}: TSampleComponentMenusProps): React.JSX.Element {
  const pathname = usePathname()
  const menuName = pathname.split('/').at(-1)

  return (
    <ul className={'flex flex-col gap-[0.4rem]'}>
      {menus
        ?.sort((a, b) => (a.title > b.title ? 1 : -1))
        ?.map((menu) => (
          <Link key={menu.id} href={`/sample/${menu.src}`}>
            <li
              className={`text-[1.6rem] font-medium ${menu.src === `${menuName}` ? 'text-sky-500' : ''} `}
            >
              {menu.title}
            </li>
          </Link>
        ))}
    </ul>
  )
}
