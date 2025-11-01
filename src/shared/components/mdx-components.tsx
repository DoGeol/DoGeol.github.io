import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="tracking-tigh mt-10 mb-4 text-4xl font-bold text-red-500">{children}</h1>
  ),
  h2: ({ children }) => <h2 className="mt-8 mb-3 text-3xl font-bold tracking-tight">{children}</h2>,
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 text-2xl font-semibold tracking-tight">{children}</h3>
  ),
  p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
  a: ({ children, ...props }) => (
    <a className="text-blue-600 hover:underline dark:text-blue-400" {...props}>
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-4 list-disc pl-6">{children}</ul>,
  li: ({ children }) => <li className="my-2">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 pl-4 italic">{children}</blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-md bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-gray-800">
      {children}
    </code>
  ),
}

export function useMDXComponents(): MDXComponents {
  return mdxComponents
}
