'use client'

import type { NextPage } from 'next'

import Menus from './_components/Menus'
import PageTitle from './_components/PageTitle'
import { menusData } from './_constant/menus'

const Page: NextPage = () => {
  return (
    <section className="h-full w-full">
      <PageTitle />

      <div className="@container container mx-auto">
        <div className="grid grid-cols-1 gap-4 @[480px]:grid-cols-2 @[768px]:grid-cols-3 @[1024px]:grid-cols-4">
            <Menus menus={menusData}/>
        </div>
      </div>
    </section>
  )
}

export default Page
