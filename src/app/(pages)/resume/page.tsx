import React from 'react'
import type { Metadata, NextPage } from 'next'
import Information from '@/app/(pages)/resume/_components/infomation'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Resume: 편도걸`,
  }
}

const Page: NextPage = () => {
  return (
    <section className={'mx-auto flex max-w-7xl min-w-xs flex-col space-y-6 py-8'}>
      <Information />
      <article className={'flex px-6 py-4'}>Introduce</article>
      <article className={'flex px-6 py-4'}>Skills</article>
      <article className={'flex px-6 py-4'}>Experience</article>
      <article className={'flex px-6 py-4'}>Project</article>
      <article className={'flex px-6 py-4'}>Contact</article>
    </section>
  )
}

export default Page
