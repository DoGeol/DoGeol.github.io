import { getCanonicalResumeData } from '@/app/(pages)/resume/_model/resume-data'
import { ResumePreviewRuntime } from '@/app/(dev)/resume-preview/_components/resume-preview-runtime'

export default function ResumePreviewPage() {
  return (
    <main className="h-full w-full">
      <ResumePreviewRuntime initialResume={getCanonicalResumeData()} />
    </main>
  )
}
