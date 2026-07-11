import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  componentDocs,
  getAdjacentDocs,
  getComponentDoc,
} from '@/features/component-docs/model/catalog'

export const dynamicParams = false

export function generateStaticParams() {
  return componentDocs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const doc = getComponentDoc((await params).slug)
  if (!doc) return {}
  return {
    title: `${doc.title} | Components`,
    description: doc.description,
    alternates: { canonical: `https://dogeol.github.io/components/${doc.slug}` },
  }
}

export default async function ComponentDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const doc = getComponentDoc((await params).slug)
  if (!doc) notFound()
  const Content = (await doc.load()).default
  const adjacent = getAdjacentDocs(doc.slug)
  return (
    <div className="pc:grid pc:grid-cols-[minmax(0,1fr)_12rem] pc:gap-12">
      <article className="docs-prose max-w-3xl min-w-0">
        <p className="text-primary-600 text-sm font-semibold">{doc.category}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{doc.title}</h1>
        <p className="mt-4 text-lg">{doc.description}</p>
        <Content />
        <nav
          aria-label="이전 및 다음 컴포넌트"
          className="mt-14 flex justify-between border-t pt-6 text-sm"
        >
          {adjacent.previous ? (
            <Link href={`/components/${adjacent.previous.slug}`}>← {adjacent.previous.title}</Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link href={`/components/${adjacent.next.slug}`}>{adjacent.next.title} →</Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
      <aside className="pc:block sticky top-20 hidden h-fit">
        <p className="mb-3 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
          On this page
        </p>
        <ul className="space-y-2 text-sm">
          {doc.sections.map((section) => (
            <li key={section.id}>
              <a className="hover:text-primary-600 text-neutral-500" href={`#${section.id}`}>
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
