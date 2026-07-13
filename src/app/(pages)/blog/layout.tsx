import type { PropsWithChildren } from 'react'
import './blog.css'

import { BlogHeader } from './_components/blog-header'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-dvh bg-white text-slate-800 dark:bg-neutral-900 dark:text-neutral-200">
      <BlogHeader />
      <main>{children}</main>
    </div>
  )
}

export default Layout
