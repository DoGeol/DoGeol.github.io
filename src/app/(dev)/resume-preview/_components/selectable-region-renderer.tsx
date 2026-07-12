'use client'

import { cloneElement, isValidElement, type HTMLAttributes, type KeyboardEvent } from 'react'

import type { ResumeRegion, ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import type { PreviewToEditorMessage } from '@/app/(dev)/_shared/resume-preview-protocol'

type RegionElementProps = HTMLAttributes<HTMLElement> & {
  'data-preview-region-id'?: string
  'data-preview-region-type'?: string
  'data-preview-selected'?: 'true'
}

const mergeClasses = (current: string | undefined, selected: boolean) =>
  [
    current,
    'cursor-pointer outline-2 outline-offset-2 outline-transparent transition-[outline-color]',
    selected
      ? 'outline-primary-500 hover:outline-primary-500'
      : 'hover:outline-primary-300 focus-visible:outline-primary-400',
  ]
    .filter(Boolean)
    .join(' ')

export const createSelectableRegionRenderer = ({
  selectedRegionId,
  send,
}: {
  selectedRegionId: string | null
  send: (message: PreviewToEditorMessage) => void
}): ResumeRegionRenderer => {
  const renderRegion = (region: ResumeRegion) => {
    if (!isValidElement<RegionElementProps>(region.children)) return region.children

    const originalClick = region.children.props.onClick
    const originalKeyDown = region.children.props.onKeyDown
    const select = () =>
      send({ type: 'SELECT_REGION', regionId: region.id, regionType: region.type })
    const onClick: NonNullable<RegionElementProps['onClick']> = (event) => {
      originalClick?.(event)
      event.preventDefault()
      event.stopPropagation()
      select()
    }
    const onKeyDown: NonNullable<RegionElementProps['onKeyDown']> = (event) => {
      originalKeyDown?.(event)
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      event.stopPropagation()
      select()
    }
    const selected = selectedRegionId === region.id

    return cloneElement(region.children, {
      'data-preview-region-id': region.id,
      'data-preview-region-type': region.type,
      ...(selected ? { 'data-preview-selected': 'true' as const } : {}),
      tabIndex: 0,
      'aria-label': `${region.label} 편집`,
      className: mergeClasses(region.children.props.className, selected),
      onClick,
      onKeyDown: onKeyDown as (event: KeyboardEvent<HTMLElement>) => void,
    })
  }

  return renderRegion
}
