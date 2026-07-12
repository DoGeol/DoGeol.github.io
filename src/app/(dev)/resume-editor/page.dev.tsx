import { getCanonicalResumeData } from '@/app/(pages)/resume/_model/resume-data'

import { ResumeEditor } from './_components/resume-editor'

export default function ResumeEditorPage() {
  return <ResumeEditor initialResume={getCanonicalResumeData()} />
}
