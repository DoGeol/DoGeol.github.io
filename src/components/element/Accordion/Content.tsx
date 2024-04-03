import React, { PropsWithChildren } from 'react'
import { useAccordionState } from '@/components/element/Accordion/Root'
import { useAccordionItemState } from '@/components/element/Accordion/Item'

export const AccordionContent = ({ children }: PropsWithChildren): React.JSX.Element => {
  const { values } = useAccordionState()
  const itemValue = useAccordionItemState()
  const isExpanded = values?.includes(itemValue)

  return (
    <div
      className={`overscroll-none transition-[max-height] delay-0 ${isExpanded ? 'max-h-[1000px] duration-500 ease-in' : 'max-h-[0px] duration-300 ease-out'}`}
    >
      <div className={'p-[1.6rem] pt-[0.8rem]'}>{children}</div>
    </div>
  )
}
