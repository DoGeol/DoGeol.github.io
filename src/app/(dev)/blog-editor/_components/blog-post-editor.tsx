'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import type { BlogPostDraft } from '@/app/(pages)/blog/_model/blog-post-schema'

import { clearBlogDrafts, readBlogDrafts, writeBlogDrafts } from '../_model/draft-storage'
import type { BlogDraftStorageState } from '../_model/draft-storage'
import { downloadBlogPostJson, serializeBlogPostForExport } from '../_model/export-blog-post'
import { validateBlogAssets, type AssetProvider } from '../_model/asset-provider'
import { LocalPublicAssetProvider } from '../_model/local-public-asset-provider'
import { useBlogDraftStorage } from '../_model/use-blog-draft-storage'
import { BlogPostMetadataEditor } from './blog-post-metadata-editor'
import { DynamicBlockNoteSurface } from './dynamic-block-note-surface'

type EditorPane = 'editor' | 'preview'

const today = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

function BlogPostEditorWorkspace({
  canonicalDraft,
  initialDraft,
  initialSavedAt,
  initialNotice,
  canonicalSlug,
  assetProvider,
}: {
  canonicalDraft: BlogPostDraft
  initialDraft: BlogPostDraft
  initialSavedAt: string | null
  initialNotice: string | null
  canonicalSlug?: string
  assetProvider: AssetProvider
}) {
  const [draft, setDraft] = useState(initialDraft)
  const [activePane, setActivePane] = useState<EditorPane>('editor')
  const [savedAt, setSavedAt] = useState<string | null>(initialSavedAt)
  const [notice, setNotice] = useState<string | null>(initialNotice)
  const [errors, setErrors] = useState<string[]>([])
  const editorTabRef = useRef<HTMLButtonElement>(null)
  const previewTabRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const current = readBlogDrafts(sessionStorage).drafts
        const time = new Date().toISOString()
        writeBlogDrafts(sessionStorage, { ...current, [draft.id]: draft }, time)
        setSavedAt(time)
      } catch {
        setNotice('현재 입력은 초안으로 저장할 수 없습니다. 이미지와 본문 형식을 확인하세요.')
      }
    }, 300)
    return () => window.clearTimeout(timer)
  }, [draft])

  const updateDraft = (next: BlogPostDraft) => setDraft({ ...next, updatedAt: today() })
  const selectPane = (pane: EditorPane) => {
    setActivePane(pane)
    ;(pane === 'editor' ? editorTabRef : previewTabRef).current?.focus()
  }
  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, current: EditorPane) => {
    const next =
      event.key === 'Home'
        ? 'editor'
        : event.key === 'End'
          ? 'preview'
          : event.key === 'ArrowRight'
            ? current === 'editor'
              ? 'preview'
              : 'editor'
            : event.key === 'ArrowLeft'
              ? current === 'preview'
                ? 'editor'
                : 'preview'
              : null
    if (next === null) return
    event.preventDefault()
    selectPane(next)
  }
  const reset = () => {
    if (!window.confirm('현재 탭의 초안을 지우고 원본으로 되돌릴까요?')) return
    const current = readBlogDrafts(sessionStorage).drafts
    delete current[draft.id]
    if (Object.keys(current).length === 0) clearBlogDrafts(sessionStorage)
    else writeBlogDrafts(sessionStorage, current)
    setDraft(canonicalDraft)
    setErrors([])
    setNotice('원본으로 되돌렸습니다.')
  }
  const exportJson = async () => {
    const assetErrors = await validateBlogAssets(draft, assetProvider)
    if (assetErrors.length > 0) {
      setErrors(assetErrors.map(({ path, message }) => `${path}: ${message}`))
      return
    }
    const result = serializeBlogPostForExport(draft, canonicalSlug)
    if (!result.success) {
      setErrors(result.issues.map((issue) => `${issue.path.join('.') || '글'}: ${issue.message}`))
      return
    }
    setErrors([])
    downloadBlogPostJson(result.filename, result.json, document)
  }

  return (
    <main
      data-blog-editor-client-marker="blog-editor-client-only-marker"
      className="h-dvh overflow-hidden bg-slate-100 text-slate-950 dark:bg-neutral-950 dark:text-white"
    >
      <div className="flex h-full min-h-0 flex-col">
        <header className="tablet:px-6 flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/blog-editor"
              className="text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              ← 글 목록
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold">{draft.title.trim() || '제목 없는 글'}</h1>
              <p className="text-xs text-neutral-500">
                {savedAt === null
                  ? '초안 저장 준비 중'
                  : `현재 탭에 저장됨 ${new Date(savedAt).toLocaleTimeString('ko-KR')}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
            >
              초안 초기화
            </button>
            <button
              type="button"
              onClick={() => void exportJson()}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              JSON 내보내기
            </button>
          </div>
        </header>
        <div
          role="tablist"
          aria-label="블로그 편집 화면"
          className="tablet:hidden grid shrink-0 grid-cols-2 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        >
          {(['editor', 'preview'] as const).map((pane) => (
            <button
              key={pane}
              ref={pane === 'editor' ? editorTabRef : previewTabRef}
              id={`blog-${pane}-tab`}
              type="button"
              role="tab"
              aria-selected={activePane === pane}
              aria-controls={`blog-${pane}-pane`}
              tabIndex={activePane === pane ? 0 : -1}
              onClick={() => selectPane(pane)}
              onKeyDown={(event) => handleTabKeyDown(event, pane)}
              className={`border-b-2 px-4 py-3 text-sm font-semibold ${activePane === pane ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-neutral-500'}`}
            >
              {pane === 'editor' ? '편집' : '프리뷰'}
            </button>
          ))}
        </div>
        {notice !== null && (
          <p
            role="status"
            className="shrink-0 border-b border-amber-200 bg-amber-50 px-5 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
          >
            {notice}
          </p>
        )}
        <div className="tablet:grid-cols-[minmax(22rem,2fr)_minmax(0,3fr)] tablet:grid min-h-0 flex-1 overflow-hidden">
          <section
            id="blog-editor-pane"
            role="tabpanel"
            aria-labelledby="blog-editor-tab"
            aria-label="글 편집"
            className={`${activePane === 'editor' ? 'block' : 'hidden'} tablet:block tablet:p-6 min-h-0 overflow-y-auto p-4`}
          >
            <div className="mx-auto max-w-3xl space-y-5">
              {errors.length > 0 && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                >
                  <p className="font-bold">내보내기 전에 확인하세요.</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              <BlogPostMetadataEditor
                draft={draft}
                canonicalSlug={canonicalSlug}
                onChange={updateDraft}
              />
              <section className="min-h-96 rounded-xl border border-neutral-200 bg-white py-5 dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="px-5 text-sm font-bold">본문</h2>
                <DynamicBlockNoteSurface
                  blocks={draft.blocks}
                  editable
                  onChange={(blocks) => updateDraft({ ...draft, blocks })}
                />
              </section>
            </div>
          </section>
          <section
            id="blog-preview-pane"
            role="tabpanel"
            aria-labelledby="blog-preview-tab"
            aria-label="글 프리뷰"
            className={`${activePane === 'preview' ? 'block' : 'hidden'} tablet:block tablet:p-8 min-h-0 overflow-y-auto border-l border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900`}
          >
            <article className="mx-auto max-w-3xl">
              <header className="border-b border-neutral-200 pb-6 dark:border-neutral-800">
                <h1 className="text-4xl font-black tracking-tight">
                  {draft.title.trim() || '제목 없는 글'}
                </h1>
                <p className="mt-4 leading-7 text-neutral-600 dark:text-neutral-400">
                  {draft.summary || '글의 요약이 여기에 표시됩니다.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {draft.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </header>
              <div className="mt-6">
                <DynamicBlockNoteSurface
                  blocks={draft.blocks}
                  editable={false}
                  onChange={() => undefined}
                />
              </div>
            </article>
          </section>
        </div>
      </div>
    </main>
  )
}

function BlogPostEditorSession({
  initialStorageState,
  initialDraft,
  canonicalSlug,
  assetProvider,
}: {
  initialStorageState: BlogDraftStorageState
  initialDraft: BlogPostDraft
  canonicalSlug?: string
  assetProvider: AssetProvider
}) {
  const [stored] = useState(initialStorageState)
  const restored = stored.drafts[initialDraft.id]
  const editorDraft = restored ?? initialDraft
  const restoredAt = restored === undefined ? null : stored.savedAt
  const notice =
    restored !== undefined
      ? '현재 탭의 초안을 복원했습니다.'
      : stored.status === 'discarded'
        ? '손상되거나 오래된 초안을 버리고 원본을 열었습니다.'
        : null
  const storageRevision = restored === undefined ? stored.status : stored.savedAt

  return (
    <BlogPostEditorWorkspace
      key={`${initialDraft.id}:${storageRevision}`}
      canonicalDraft={initialDraft}
      initialDraft={editorDraft}
      initialSavedAt={restoredAt}
      initialNotice={notice}
      canonicalSlug={canonicalSlug}
      assetProvider={assetProvider}
    />
  )
}

export function BlogPostEditor({
  initialDraft,
  canonicalSlug,
  assetProvider = new LocalPublicAssetProvider(),
}: {
  initialDraft: BlogPostDraft
  canonicalSlug?: string
  assetProvider?: AssetProvider
}) {
  const { hydrated, state } = useBlogDraftStorage()

  if (!hydrated) {
    return <main className="grid min-h-dvh place-items-center">편집기를 준비하고 있습니다.</main>
  }

  return (
    <BlogPostEditorSession
      initialStorageState={state}
      initialDraft={initialDraft}
      canonicalSlug={canonicalSlug}
      assetProvider={assetProvider}
    />
  )
}
