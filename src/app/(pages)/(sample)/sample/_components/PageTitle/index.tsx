'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { menusData } from '@/app/(pages)/(sample)/sample/_constant/menus'

export default function SampleComponentPageTitle(): React.JSX.Element {
  const pathname = usePathname()
  const menuName = pathname.split('/').at(-1)
  const menu = menusData.filter((menu) => menu.src === `${menuName}`)

  return (
    <h2 className={'text-sample-title mb-[0.8rem] font-bold capitalize'}>
      {menu[0]?.title || '-'}
    </h2>
  )
}
