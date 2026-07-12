import { useRef, type KeyboardEvent } from 'react'

export type EditorPane = 'editor' | 'preview'

type EditorTabsProps = {
  activePane: EditorPane
  onChange: (pane: EditorPane) => void
}

export function EditorTabs({ activePane, onChange }: EditorTabsProps) {
  const editorTabRef = useRef<HTMLButtonElement>(null)
  const previewTabRef = useRef<HTMLButtonElement>(null)

  const selectAndFocus = (pane: EditorPane) => {
    onChange(pane)
    const tab = pane === 'editor' ? editorTabRef.current : previewTabRef.current
    tab?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentPane: EditorPane =
      event.currentTarget.id === 'resume-editor-tab' ? 'editor' : 'preview'
    const nextPane =
      event.key === 'ArrowRight'
        ? currentPane === 'editor'
          ? 'preview'
          : 'editor'
        : event.key === 'ArrowLeft'
          ? currentPane === 'preview'
            ? 'editor'
            : 'preview'
          : event.key === 'Home'
            ? 'editor'
            : event.key === 'End'
              ? 'preview'
              : null
    if (nextPane === null) return
    event.preventDefault()
    selectAndFocus(nextPane)
  }

  return (
    <div
      role="tablist"
      aria-label="이력서 편집 화면"
      className="tablet:hidden grid grid-cols-2 border-b border-slate-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
    >
      <button
        ref={editorTabRef}
        id="resume-editor-tab"
        type="button"
        role="tab"
        aria-selected={activePane === 'editor'}
        aria-controls="resume-editor-pane"
        tabIndex={activePane === 'editor' ? 0 : -1}
        onClick={() => onChange('editor')}
        onKeyDown={handleKeyDown}
        className={`border-b-2 px-4 py-3 text-sm font-medium ${
          activePane === 'editor'
            ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
            : 'border-transparent text-slate-600 dark:text-neutral-400'
        }`}
      >
        편집
      </button>
      <button
        ref={previewTabRef}
        id="resume-preview-tab"
        type="button"
        role="tab"
        aria-selected={activePane === 'preview'}
        aria-controls="resume-preview-pane"
        tabIndex={activePane === 'preview' ? 0 : -1}
        onClick={() => onChange('preview')}
        onKeyDown={handleKeyDown}
        className={`border-b-2 px-4 py-3 text-sm font-medium ${
          activePane === 'preview'
            ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
            : 'border-transparent text-slate-600 dark:text-neutral-400'
        }`}
      >
        프리뷰
      </button>
    </div>
  )
}
