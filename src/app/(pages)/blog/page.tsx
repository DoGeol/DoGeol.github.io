import type { Metadata, NextPage } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Blog`,
  }
}

const Page: NextPage = () => {
  return (
    <section className="h-full w-full">
      <div className="container mx-auto flex h-full w-full items-center justify-center">
        블로그 페이지
      </div>
    </section>
  )
}

export default Page
