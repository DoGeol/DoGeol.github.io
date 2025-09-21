import React from 'react'
import type { Metadata, NextPage } from 'next'
import Information from '@/app/(pages)/resume/_components/infomation'
import Introduce from '@/app/(pages)/resume/_components/introduce'
import Experience from '@/app/(pages)/resume/_components/experience'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Resume: 편도걸`,
  }
}

const Page: NextPage = () => {
  return (
    <section className={'mx-auto flex max-w-6xl min-w-xs flex-col space-y-6 py-8'}>
      <Information />
      <Introduce />
      <Experience />
      <article className={'flex px-6 py-4'}>Projects</article>
      <article className={'flex px-6 py-4'}>Contact</article>
    </section>
  )
}

export default Page
