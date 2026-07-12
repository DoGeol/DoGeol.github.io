import { useFieldArray, useFormContext, type FieldArrayPath, type FieldPath } from 'react-hook-form'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'
import { createDefaultItem } from '@/app/(dev)/resume-editor/_model/default-items'

export const cardClassName =
  'space-y-3 rounded-md border border-slate-200 p-3 dark:border-neutral-700'

export const useResumeFieldArray = (name: FieldPath<ResumeDraft>) => {
  const { control } = useFormContext<ResumeDraft>()
  return useFieldArray({
    control,
    name: name as FieldArrayPath<ResumeDraft>,
    keyName: 'formKey',
  })
}

export const focusLastInput = (containerName: string) => {
  window.requestAnimationFrame(() => {
    const regions = document.querySelectorAll<HTMLElement>(
      `[data-item-list="${containerName}"] [data-editor-region-id]`,
    )
    const region = regions.item(regions.length - 1)
    region
      ?.querySelector<HTMLElement>('input:not([type="hidden"]):not([readonly]), textarea, select')
      ?.focus()
  })
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isDeepEqual = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) return true
  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length && left.every((value, index) => isDeepEqual(value, right[index]))
    )
  }
  if (!isRecord(left) || !isRecord(right)) return false
  const leftKeys = Object.keys(left).sort()
  const rightKeys = Object.keys(right).sort()
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every((key, index) => key === rightKeys[index] && isDeepEqual(left[key], right[key]))
  )
}

const getFactoryDefault = (value: Record<string, unknown>, id: string): unknown => {
  const createId = () => id
  if ('text' in value) return createDefaultItem('text', createId)
  if ('type' in value && 'target' in value) return createDefaultItem('contact', createId)
  if ('category' in value) return createDefaultItem('catalog-skill', createId)
  if ('companyName' in value && 'histories' in value)
    return createDefaultItem('experience', createId)
  if ('department' in value) return createDefaultItem('history', createId)
  if ('details' in value) return createDefaultItem('project-work', createId)
  if ('school' in value) return createDefaultItem('education', createId)
  if ('acquiredAt' in value) return createDefaultItem('license', createId)
  if ('works' in value && 'startMonth' in value) return createDefaultItem('project', createId)
  if ('startMonth' in value && 'summary' in value) return createDefaultItem('activity', createId)
  return null
}

export const isUntouchedDefaultItem = (value: unknown): boolean => {
  if (!isRecord(value) || typeof value.id !== 'string') return false
  const expected = getFactoryDefault(value, value.id)
  return expected !== null && isDeepEqual(value, expected)
}

export const containsEditorRegionId = (value: unknown, regionId: string): boolean => {
  if (Array.isArray(value)) return value.some((nested) => containsEditorRegionId(nested, regionId))
  if (!isRecord(value)) return false
  if (value.id === regionId) return true
  return Object.values(value).some((nested) => containsEditorRegionId(nested, regionId))
}

export const shouldDeleteItem = (value: unknown, message: string) =>
  isUntouchedDefaultItem(value) || window.confirm(message)

type ItemRegionProps = {
  id: string
  label: string
  selected: boolean
  children: React.ReactNode
}

export function ItemRegion({ id, label, selected, children }: ItemRegionProps) {
  return (
    <article
      data-editor-region-id={id}
      aria-label={label}
      className={`${cardClassName} ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {children}
    </article>
  )
}
