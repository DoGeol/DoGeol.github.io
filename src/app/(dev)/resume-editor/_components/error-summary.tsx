type ErrorSummaryProps = {
  visible: boolean
}

export function ErrorSummary({ visible }: ErrorSummaryProps) {
  if (!visible) return null

  return (
    <section
      role="alert"
      aria-labelledby="resume-export-error-heading"
      className="rounded-md border border-red-300 bg-red-50 p-4 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
    >
      <h2 id="resume-export-error-heading" className="font-semibold">
        내보내기 오류
      </h2>
      <p className="mt-1 text-sm">오류가 있는 항목을 확인해 주세요.</p>
    </section>
  )
}
