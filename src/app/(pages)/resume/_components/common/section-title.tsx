import React, { PropsWithChildren } from 'react'

const SectionTitle = ({ children }: PropsWithChildren) => {
  return (
    <h2 className={'text-primary-600 dark:text-primary-500 text-4xl font-medium'}>{children}</h2>
  )
}

export default SectionTitle
