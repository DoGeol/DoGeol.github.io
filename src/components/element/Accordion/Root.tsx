'use client'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type AccordionRootProps = {
  multiple?: boolean
  values: string[]
  onChange?: (values: any[]) => void
  rounded?: boolean
}

type TStateContext = {
  values: string[]
  rounded: boolean
}

type TActionContext = {
  setter: (item: string) => void
}

const AccordionStateContext = createContext<TStateContext>({ values: [], rounded: false })
const AccordionActionsContext = createContext<TActionContext>({ setter: () => null })

export const AccordionRoot = ({
  children,
  multiple = true,
  values = [],
  onChange,
  rounded = false,
}: PropsWithChildren<AccordionRootProps>) => {
  const [items, setItems] = useState<any[]>(values)

  const setter = useCallback(
    (item: string) => {
      let newItem = new Set([item])
      if (multiple) {
        newItem = new Set(items)
        newItem.has(item) ? newItem.delete(item) : newItem.add(item)
      }
      setItems(Array.from(newItem))
    },
    [items, multiple],
  )

  const memoizedItems = useMemo(() => items, [items])
  const memoizedRounded = useMemo(() => rounded, [rounded])
  const memoizedSetter = useMemo(() => setter, [setter])

  useEffect(() => {
    if (onChange && typeof onChange === 'function') {
      onChange(memoizedItems)
    }
  }, [memoizedItems])

  return (
    <AccordionActionsContext.Provider value={{ setter: memoizedSetter }}>
      <AccordionStateContext.Provider value={{ values: memoizedItems, rounded: memoizedRounded }}>
        <div>{children}</div>
      </AccordionStateContext.Provider>
    </AccordionActionsContext.Provider>
  )
}

export const useAccordionState = () => useContext(AccordionStateContext)
export const useAccordionActions = () => useContext(AccordionActionsContext)
