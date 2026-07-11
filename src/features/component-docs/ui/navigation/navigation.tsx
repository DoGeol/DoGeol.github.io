'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { ComponentSlug } from '../../model/catalog'

const navigationDocs = [
  { slug: 'accordion', title: 'Accordion', category: 'Disclosure' },
  { slug: 'input', title: 'Input', category: 'Form' },
] as const

function NavLinks({ currentSlug }: { currentSlug?: ComponentSlug }) {
  const pathname = usePathname()
  return (
    <nav aria-label="컴포넌트 목록" className="space-y-6">
      {(['Disclosure', 'Form'] as const).map((category) => (
        <section key={category}>
          <h2 className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
            {category}
          </h2>
          <ul className="space-y-1">
            {navigationDocs
              .filter((doc) => doc.category === category)
              .map((doc) => {
                const active = currentSlug === doc.slug || pathname === `/components/${doc.slug}`
                return (
                  <li key={doc.slug}>
                    <Link
                      href={`/components/${doc.slug}`}
                      aria-current={active ? 'page' : undefined}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${active ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                    >
                      {doc.title}
                    </Link>
                  </li>
                )
              })}
          </ul>
        </section>
      ))}
    </nav>
  )
}

export function DocsSidebar({ currentSlug }: { currentSlug?: ComponentSlug }) {
  return <NavLinks currentSlug={currentSlug} />
}

export function MobileDocsNav({ currentSlug }: { currentSlug?: ComponentSlug }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        requestAnimationFrame(() => buttonRef.current?.focus())
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        className="text-sm"
      >
        Menu
      </button>
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="컴포넌트 메뉴"
            className="fixed inset-0 z-50 bg-white p-6 dark:bg-neutral-950"
          >
            <div className="mb-8 flex items-center justify-between">
              <strong>Components</strong>
              <button
                onClick={() => {
                  setOpen(false)
                  requestAnimationFrame(() => buttonRef.current?.focus())
                }}
                aria-label="메뉴 닫기"
              >
                Close
              </button>
            </div>
            <NavLinks currentSlug={currentSlug} />
          </div>,
          document.body,
        )}
    </>
  )
}
