type ErrorSummaryProps = {
  visible: boolean
  canNavigate: boolean
  onNavigate: () => void
}

export function ErrorSummary({ visible, canNavigate, onNavigate }: ErrorSummaryProps) {
  if (!visible) return null

  return (
    <section
      role="alert"
      aria-labelledby="resume-export-error-heading"
      className="rounded-md border border-red-700 bg-red-50 p-4 text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-200"
    >
      <h2 id="resume-export-error-heading" className="font-semibold">
        내보내기 오류
      </h2>
      <p className="mt-1 text-sm">오류가 있는 항목을 확인해 주세요.</p>
      {canNavigate && (
        <button
          type="button"
          onClick={onNavigate}
          className="mt-2 inline-flex rounded-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 dark:focus-visible:outline-red-300"
        >
          첫 번째 오류로 이동
        </button>
      )}
    </section>
  )
}
