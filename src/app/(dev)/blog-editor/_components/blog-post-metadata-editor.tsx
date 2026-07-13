'use client'

import { useState } from 'react'

import type { BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'
import { createSuggestedSlug, updateSuggestedSlug } from '@/app/(pages)/blog/_model/blog-slug'

const fieldClass =
  'mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-blue-950 dark:disabled:bg-neutral-800'

export function BlogPostMetadataEditor({
  draft,
  canonicalSlug,
  onChange,
}: {
  draft: BlogPostDraft
  canonicalSlug?: string
  onChange: (draft: BlogPostDraft) => void
}) {
  const [suggestedSlug, setSuggestedSlug] = useState(() => createSuggestedSlug(draft.title))
  const update = <Key extends keyof BlogPostDraft>(key: Key, value: BlogPostDraft[Key]) =>
    onChange({ ...draft, [key]: value })
  const slugLocked = canonicalSlug !== undefined && draft.status === 'published'

  return (
    <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="tablet:grid-cols-2 grid gap-4">
        <label className="tablet:col-span-2 text-sm font-medium">
          제목
          <input
            className={fieldClass}
            value={draft.title}
            onChange={(event) => {
              const title = event.target.value
              const next = updateSuggestedSlug({
                currentSlug: draft.slug,
                previousSuggestedSlug: suggestedSlug,
                nextTitle: title,
              })
              setSuggestedSlug(next.suggestedSlug)
              onChange({ ...draft, title, slug: next.slug })
            }}
          />
        </label>
        <label className="text-sm font-medium">
          slug
          <input
            aria-label="slug"
            className={fieldClass}
            value={draft.slug}
            disabled={slugLocked}
            onChange={(event) => update('slug', event.target.value)}
          />
          {slugLocked && (
            <span className="mt-1 block text-xs text-neutral-500">
              공개된 URL은 변경할 수 없습니다.
            </span>
          )}
        </label>
        <label className="text-sm font-medium">
          상태
          <select
            className={fieldClass}
            value={draft.status}
            onChange={(event) => {
              const status = event.target.value === 'published' ? 'published' : 'draft'
              onChange({
                ...draft,
                status,
                publishedAt:
                  status === 'published'
                    ? (draft.publishedAt ?? draft.updatedAt)
                    : draft.publishedAt,
              })
            }}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
        <label className="tablet:col-span-2 text-sm font-medium">
          요약
          <textarea
            className={`${fieldClass} min-h-24 resize-y`}
            value={draft.summary}
            onChange={(event) => update('summary', event.target.value)}
          />
        </label>
        <label className="tablet:col-span-2 text-sm font-medium">
          태그
          <input
            className={fieldClass}
            value={draft.tags.join(', ')}
            placeholder="React, Next.js"
            onChange={(event) =>
              update(
                'tags',
                event.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              )
            }
          />
        </label>
        <label className="text-sm font-medium">
          대표 이미지 경로
          <input
            className={fieldClass}
            value={draft.coverImage?.source.path ?? ''}
            placeholder="/blog/images/cover.webp"
            onChange={(event) => {
              const path = event.target.value
              update(
                'coverImage',
                path === ''
                  ? null
                  : {
                      source: { provider: 'public', path },
                      alt: draft.coverImage?.alt ?? '',
                      caption: draft.coverImage?.caption ?? null,
                    },
              )
            }}
          />
        </label>
        <label className="text-sm font-medium">
          대표 이미지 대체 텍스트
          <input
            className={fieldClass}
            value={draft.coverImage?.alt ?? ''}
            disabled={draft.coverImage === null}
            onChange={(event) =>
              draft.coverImage !== null &&
              update('coverImage', { ...draft.coverImage, alt: event.target.value })
            }
          />
        </label>
      </div>
    </section>
  )
}
