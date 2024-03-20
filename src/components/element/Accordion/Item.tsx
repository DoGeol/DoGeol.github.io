import React, { createContext, PropsWithChildren, useContext } from 'react'
import { useAccordionState } from '@/components/element/Accordion/Root'

type TAccordionItemProps = {
  value: string
}

const AccordionItemContext = createContext<string>('')

export const AccordionItem = ({
  children,
  value,
}: PropsWithChildren<TAccordionItemProps>): React.JSX.Element => {
  const { rounded } = useAccordionState()

  const itemClasses = [
    'accordion-item w-full border-x border-t border-solid border-neutral-300 last:border-b',
    rounded ? 'first:rounded-t-xl last:rounded-b-xl' : '',
  ]
    .filter((c) => !!c)
    .join(' ')
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={itemClasses}>{children}</div>
    </AccordionItemContext.Provider>
  )
}

export const useAccordionItemState = () => useContext(AccordionItemContext)
