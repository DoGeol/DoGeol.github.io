import { resumeTemplateOptions } from '@/app/(pages)/resume/_templates/registry'

import { SelectField } from '@/app/(dev)/resume-editor/_components/fields/select-field'
import { TextField } from '@/app/(dev)/resume-editor/_components/fields/text-field'
import { SkillCatalogEditor } from '@/app/(dev)/resume-editor/_components/skills/skill-catalog-editor'

type DocumentSettingsEditorProps = {
  selectedRegionId: string | null
  onSelectedRegionChange: (regionId: string) => void
}

export function DocumentSettingsEditor({
  selectedRegionId,
  onSelectedRegionChange,
}: DocumentSettingsEditorProps) {
  return (
    <section
      data-document-settings=""
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
    >
      <h2 className="text-lg font-semibold">문서 설정</h2>
      <p className="text-sm">
        스키마 버전 <span className="rounded bg-slate-100 px-2 py-1">1</span>
      </p>
      <SelectField name="templateId" label="템플릿" options={resumeTemplateOptions} />
      <TextField name="metadata.title" label="이력서 제목" />
      <TextField name="metadata.socialTitle" label="소셜 제목" />
      <TextField name="metadata.description" label="설명" multiline />
      <TextField name="assets.profileFront" label="앞면 프로필 이미지 경로" />
      <TextField name="assets.profileBack" label="뒷면 프로필 이미지 경로" />
      <SkillCatalogEditor
        selectedRegionId={selectedRegionId}
        onSelectedRegionChange={onSelectedRegionChange}
      />
    </section>
  )
}
