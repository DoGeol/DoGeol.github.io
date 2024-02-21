'use client'
import React, { PropsWithChildren } from 'react'
import { useAccordionActions, useAccordionState } from '@/components/element/Accordion/Root'
import { useAccordionItemState } from '@/components/element/Accordion/Item'

export const AccordionTitle = ({ children }: PropsWithChildren): React.JSX.Element => {
  const { values } = useAccordionState()
  const { setter } = useAccordionActions()
  const itemValue = useAccordionItemState()
  const isExpanded = values?.includes(itemValue)

  return (
    <div
      className={
        'flex h-[4.8rem] cursor-pointer items-center justify-between px-[1.6rem] [&>span]:hover:underline'
      }
      onClick={() => {
        setter(itemValue)
      }}
    >
      <span className={'text-desc'}>{children}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`h-[2rem] w-[2rem] ${isExpanded ? '-rotate-180' : ''} text-neutral-500 transition-transform`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  )
}
