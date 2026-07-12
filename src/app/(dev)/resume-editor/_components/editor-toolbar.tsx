type EditorToolbarProps = {
  notice: string | null
  savedAt: string | null
  onReset: () => void
}

export function EditorToolbar({ notice, savedAt, onReset }: EditorToolbarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 dark:border-neutral-700 dark:bg-neutral-900">
      <div>
        <h1 className="text-xl font-semibold text-slate-950 dark:text-neutral-50">이력서 편집기</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-neutral-400">
          {savedAt === null ? '초안 저장 준비 중' : `초안 저장됨: ${savedAt}`}
        </p>
        {notice !== null && (
          <p role="status" className="mt-1 text-sm text-amber-700 dark:text-amber-300">
            {notice}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          초안 초기화
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          JSON 내보내기
        </button>
      </div>
    </header>
  )
}
