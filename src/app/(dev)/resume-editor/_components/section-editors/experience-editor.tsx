import { useFormContext } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { NullableDateField } from '@/app/(dev)/resume-editor/_components/fields/nullable-date-field'
import { RepeatableTextField } from '@/app/(dev)/resume-editor/_components/fields/repeatable-text-field'
import { SelectField } from '@/app/(dev)/resume-editor/_components/fields/select-field'
import { SkillReferenceField } from '@/app/(dev)/resume-editor/_components/fields/skill-reference-field'
import { TextField } from '@/app/(dev)/resume-editor/_components/fields/text-field'
import { createDefaultItem } from '@/app/(dev)/resume-editor/_model/default-items'

import {
  cardClassName,
  containsEditorRegionId,
  focusLastInput,
  SortableItemRegion,
  shouldDeleteItem,
  useResumeFieldArray,
} from '@/app/(dev)/resume-editor/_components/section-editors/section-editor-helpers'
import { SortableList } from '@/app/(dev)/resume-editor/_components/sortable/sortable-list'

type Props = {
  sectionIndex: number
  selectedRegionId: string | null
  onSelectedRegionChange: (id: string) => void
}

function HistoryList({
  name,
  selectedRegionId,
  owningSectionId,
  parentId,
  onSelectedRegionChange,
}: {
  name: `sections.${number}.data.items.${number}.histories`
  selectedRegionId: string | null
  owningSectionId: string
  parentId: string
  onSelectedRegionChange: (id: string) => void
}) {
  const form = useFormContext<ResumeDraft>()
  const histories = useResumeFieldArray(name)
  return (
    <div data-item-list={name} className="space-y-3">
      <h4 className="font-semibold">경력 상세</h4>
      <SortableList
        containerId={`histories-${parentId}`}
        entries={histories.fields.map((history, index) => ({
          id: String(history.id),
          label: form.getValues(`${name}.${index}`).department || '새 경력 상세',
        }))}
        onMove={histories.move}
      >
        {histories.fields.map((history, historyIndex) => {
          const base = `${name}.${historyIndex}` as const
          const value = form.getValues(base)
          return (
            <SortableItemRegion
              key={history.formKey}
              id={String(history.id)}
              label={value.department || '새 경력 상세'}
              selected={selectedRegionId === history.id}
            >
              <TextField name={`${base}.department`} label="부서명" />
              <TextField name={`${base}.role`} label="역할" />
              <TextField name={`${base}.startDate`} label="시작일" type="date" />
              <NullableDateField name={`${base}.endDate`} label="종료일" inputType="date" />
              <RepeatableTextField
                name={`${base}.works`}
                label="주요 업무"
                addLabel="업무 추가"
                selectedRegionId={selectedRegionId}
                owningSectionId={owningSectionId}
                onSelectedRegionChange={onSelectedRegionChange}
                containerId={`history-works-${String(history.id)}`}
              />
              <SkillReferenceField
                name={`${base}.skills`}
                selectedRegionId={selectedRegionId}
                owningSectionId={owningSectionId}
                onSelectedRegionChange={onSelectedRegionChange}
                containerId={`history-skills-${String(history.id)}`}
              />
              <button
                type="button"
                aria-label={`${value.department || '경력 상세'} 삭제`}
                onClick={() => {
                  if (!shouldDeleteItem(value, '경력 상세를 삭제할까요?')) return
                  histories.remove(historyIndex)
                  if (selectedRegionId !== null && containsEditorRegionId(value, selectedRegionId))
                    onSelectedRegionChange(owningSectionId)
                }}
                className="rounded border px-3 py-2 text-sm"
              >
                경력 상세 삭제
              </button>
            </SortableItemRegion>
          )
        })}
      </SortableList>
      <button
        type="button"
        onClick={() => {
          histories.append(createDefaultItem('history'))
          focusLastInput(name)
        }}
        className="rounded border px-3 py-2 text-sm"
      >
        경력 상세 추가
      </button>
    </div>
  )
}

export function ExperienceEditor({
  sectionIndex,
  selectedRegionId,
  onSelectedRegionChange,
}: Props) {
  const form = useFormContext<ResumeDraft>()
  const base = `sections.${sectionIndex}.data` as const
  const companies = useResumeFieldArray(`${base}.items`)
  const section = form.getValues(`sections.${sectionIndex}`)
  if (section.type !== 'experience') return null
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input type="checkbox" {...form.register(`${base}.showTotalPeriod`)} />
        전체 경력 기간 표시
      </label>
      <div data-item-list="companies" className="space-y-4">
        <SortableList
          containerId={`companies-${section.id}`}
          entries={companies.fields.map((company, index) => ({
            id: String(company.id),
            label: section.data.items[index]?.companyName || '새 회사',
          }))}
          onMove={companies.move}
        >
          {companies.fields.map((company, companyIndex) => {
            const itemBase = `${base}.items.${companyIndex}` as const
            const value = section.data.items[companyIndex]!
            return (
              <SortableItemRegion
                key={company.formKey}
                id={String(company.id)}
                label={value.companyName || '새 회사'}
                selected={selectedRegionId === company.id}
              >
                <TextField name={`${itemBase}.companyName`} label="회사명" />
                <TextField name={`${itemBase}.logoPath`} label="회사 로고 경로" />
                <RepeatableTextField
                  name={`${itemBase}.serviceSummary`}
                  label="서비스 요약"
                  addLabel="서비스 요약 추가"
                  selectedRegionId={selectedRegionId}
                  owningSectionId={section.id}
                  onSelectedRegionChange={onSelectedRegionChange}
                  containerId={`service-summary-${String(company.id)}`}
                />
                <RepeatableTextField
                  name={`${itemBase}.experienceSummary`}
                  label="경험 요약"
                  addLabel="경험 요약 추가"
                  selectedRegionId={selectedRegionId}
                  owningSectionId={section.id}
                  onSelectedRegionChange={onSelectedRegionChange}
                  containerId={`experience-summary-${String(company.id)}`}
                />
                <SelectField
                  name={`${itemBase}.employmentStatus`}
                  label="재직 상태"
                  options={[
                    { value: 'retired', label: '퇴사' },
                    { value: 'employed', label: '재직' },
                    { value: 'recommended-retired', label: '추천 퇴사' },
                  ]}
                />
                <div className={cardClassName}>
                  <HistoryList
                    name={`${itemBase}.histories`}
                    selectedRegionId={selectedRegionId}
                    owningSectionId={section.id}
                    parentId={String(company.id)}
                    onSelectedRegionChange={onSelectedRegionChange}
                  />
                </div>
                <button
                  type="button"
                  aria-label={`${value.companyName || '회사'} ${value.companyName ? '회사 ' : ''}삭제`.replace(
                    '회사 회사',
                    '회사 회사',
                  )}
                  onClick={() => {
                    if (!shouldDeleteItem(value, '회사 경력을 삭제할까요?')) return
                    companies.remove(companyIndex)
                    if (
                      selectedRegionId !== null &&
                      containsEditorRegionId(value, selectedRegionId)
                    )
                      onSelectedRegionChange(section.id)
                  }}
                  className="rounded border px-3 py-2 text-sm"
                >
                  회사 삭제
                </button>
              </SortableItemRegion>
            )
          })}
        </SortableList>
        <button
          type="button"
          onClick={() => {
            companies.append(createDefaultItem('experience'))
            focusLastInput('companies')
          }}
          className="rounded border px-3 py-2 text-sm"
        >
          회사 추가
        </button>
      </div>
    </div>
  )
}
