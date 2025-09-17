'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { menusData } from '@/app/(pages)/old-component/_constant/menus'

export default function SampleComponentPageTitle(): React.JSX.Element {
  const pathname = usePathname()
  const menuName = pathname.split('/').at(-1)
  const menu = menusData.filter((menu) => menu.src === `${menuName}`)

  return <h2 className={'text-title font-bold capitalize mb-3'}>{menu[0]?.title || '-'}</h2>
}