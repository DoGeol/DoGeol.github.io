'use client'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'

export default function DarkThemeProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [isMount, setIsMount] = useState<boolean>(false)
  useEffect(() => {
    setIsMount(true)
  }, [])

  if (!isMount) {
    return <></>
  }
  return <ThemeProvider attribute={'class'}>{children}</ThemeProvider>
}
