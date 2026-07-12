import { RepeatableTextField } from '@/app/(dev)/resume-editor/_components/fields/repeatable-text-field'
import { TextField } from '@/app/(dev)/resume-editor/_components/fields/text-field'

type Props = {
  sectionIndex: number
  sectionId: string
  selectedRegionId: string | null
  onSelectedRegionChange: (id: string) => void
}
export function IntroduceEditor({
  sectionIndex,
  sectionId,
  selectedRegionId,
  onSelectedRegionChange,
}: Props) {
  const base = `sections.${sectionIndex}.data` as const
  return (
    <div className="space-y-4">
      <RepeatableTextField
        name={`${base}.paragraphs`}
        label="소개 문단"
        addLabel="문단 추가"
        selectedRegionId={selectedRegionId}
        owningSectionId={sectionId}
        onSelectedRegionChange={onSelectedRegionChange}
      />
      <TextField name={`${base}.updatedAt`} label="수정일" type="date" />
    </div>
  )
}
