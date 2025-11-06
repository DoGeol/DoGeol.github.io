import type { MDXComponents } from 'mdx/types'
import { mdxStyles } from './styles'

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => <h1 className={mdxStyles.h1}>{children}</h1>,
  h2: ({ children }) => <h2 className={mdxStyles.h2}>{children}</h2>,
  h3: ({ children }) => <h3 className={mdxStyles.h3}>{children}</h3>,
  h4: ({ children }) => <h4 className={mdxStyles.h4}>{children}</h4>,
  h5: ({ children }) => <h5 className={mdxStyles.h5}>{children}</h5>,
  p: ({ children }) => <p className={mdxStyles.p}>{children}</p>,
  a: ({ children, ...props }) => (
    <a className={mdxStyles.a} {...props}>
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className={mdxStyles.ul}>{children}</ul>,
  ol: ({ children }) => <ol className={mdxStyles.ol}>{children}</ol>,
  li: ({ children }) => <li className={mdxStyles.li}>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className={mdxStyles.blockquote}>{children}</blockquote>
  ),
  pre: ({ children }) => <pre className={mdxStyles.pre}>{children}</pre>,
  code: ({ children }) => <code className={mdxStyles.code}>{children}</code>,
}
