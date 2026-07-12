import type { Metadata, ResolvingMetadata } from 'next'

import { canonicalResumeData } from '@/app/(pages)/resume/_model/resume-data'
import { ResumeDocument } from '@/app/(pages)/resume/_templates/registry'

export async function generateMetadata(
  _: PageProps<'/resume'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previous = await parent
  return {
    title: canonicalResumeData.metadata.title,
    openGraph: {
      ...previous.openGraph,
      title: canonicalResumeData.metadata.socialTitle,
      description: canonicalResumeData.metadata.description,
    },
    twitter: {
      ...previous.twitter,
      title: canonicalResumeData.metadata.socialTitle,
      description: canonicalResumeData.metadata.description,
    },
  }
}

export default function Page() {
  return <ResumeDocument resume={canonicalResumeData} />
}
