import { canonicalResumeData } from '@/app/(pages)/resume/_model/resume-data'
import { ResumeDocument } from '@/app/(pages)/resume/_templates/registry'

export default function ResumePreviewPage() {
  return <ResumeDocument resume={canonicalResumeData} />
}
