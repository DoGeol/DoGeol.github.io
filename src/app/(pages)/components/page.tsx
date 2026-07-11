import Link from 'next/link'

import { componentDocs } from '@/features/component-docs/model/catalog'

export default function ComponentsPage() {
  return (
    <div className="max-w-3xl">
      <p className="text-primary-600 mb-3 text-sm font-semibold">Component catalog</p>
      <h1 className="text-4xl font-bold tracking-tight">Components</h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
        프로젝트에서 실제 사용하는 UI의 사용법, 예제, 원본 코드를 한곳에서 확인합니다.
      </p>
      <div className="tablet:grid-cols-2 mt-10 grid gap-4">
        {componentDocs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/components/${doc.slug}`}
            className="hover:border-primary-400 focus:outline-primary-500 rounded-xl border p-5 transition hover:shadow-sm focus:outline-2"
          >
            <span className="text-xs text-neutral-500">{doc.category}</span>
            <h2 className="mt-2 text-xl font-semibold">{doc.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              {doc.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
