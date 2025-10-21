import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'

export interface HighlightedTextProps {
  text: string
  className?: string
  useUnderline?: boolean
}

export default function HighlightedText({
  text,
  className = '',
  useUnderline = false,
}: HighlightedTextProps) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong
            key={i}
            className={cn(
              'font-semibold text-gray-800 dark:text-gray-200',
              useUnderline && 'underline underline-offset-2',
              className,
            )}
          >
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}
