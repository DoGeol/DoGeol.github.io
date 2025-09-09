import React, { PropsWithChildren } from 'react'
import { useAccordionActions, useAccordionState } from '@/features/ui/Accordion/Root'
import { useAccordionItemState } from '@/features/ui/Accordion/Item'

type TAccordionTitleProps = {
  wrapperClass?: string
  ellipsis?: boolean
}

export const AccordionTitle = ({
  children,
  wrapperClass,
  ellipsis = false,
}: PropsWithChildren<TAccordionTitleProps>): React.JSX.Element => {
  const { values } = useAccordionState()
  const { setter } = useAccordionActions()
  const itemValue = useAccordionItemState()
  const isExpanded = values?.includes(itemValue)

  return (
    <div
      className={`flex h-[4.8rem] cursor-pointer items-center justify-between px-[1.6rem] transition-all hover:[&>span]:underline hover:[&>span]:underline-offset-4 ${isExpanded ? 'bg-blue-100 dark:bg-blue-900' : ''} ${wrapperClass}`}
      onClick={() => {
        setter(itemValue)
      }}
    >
      <span className={`text-desc ${ellipsis ? 'truncate' : ''}`}>{children}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`h-[2rem] w-[2rem] ${isExpanded ? '-rotate-180' : ''} shrink-0 text-neutral-500 transition-transform`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  )
}
