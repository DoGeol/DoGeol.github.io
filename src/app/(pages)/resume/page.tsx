import React from 'react'
import type { Metadata, NextPage, ResolvingMetadata } from 'next'
import Information from '@/app/(pages)/resume/_components/infomation'
import Introduce from '@/app/(pages)/resume/_components/introduce'
import Experience from '@/app/(pages)/resume/_components/experience'
import Project from '@/app/(pages)/resume/_components/project'
import Education from '@/app/(pages)/resume/_components/education'
import Activity from '@/app/(pages)/resume/_components/activity'
import License from '@/app/(pages)/resume/_components/license'

export async function generateMetadata(
  {
    params,
    searchParams,
  }: { params: { slug: string }; searchParams: { [key: string]: string | string[] | undefined } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previousOpenGraph = (await parent).openGraph || {}
  const previousTwitter = (await parent).twitter || {}

  return {
    title: `Resume 편도걸`,
    openGraph: {
      ...previousOpenGraph,
      title: '프론트엔드 개발자 편도걸 이력서',
      description: '안녕하세요, 6년차 프론트엔드 개발자 편도걸 입니다.',
    },
    twitter: {
      ...previousTwitter,
      title: '프론트엔드 개발자 편도걸 이력서',
      description: '안녕하세요, 6년차 프론트엔드 개발자 편도걸 입니다.',
    },
  }
}

const Page: NextPage = () => {
  return (
    <section className={'mx-auto flex max-w-6xl min-w-xs flex-col space-y-6 py-8'}>
      <Information />
      <Introduce />
      <Experience />
      <Project />
      <Education />
      <Activity />
      <License />
    </section>
  )
}

export default Page
