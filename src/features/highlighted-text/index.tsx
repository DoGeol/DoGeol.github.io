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
  return (
    <>
      {text.split('\n').map((line, lineIndex, lines) => (
        <React.Fragment key={lineIndex}>
          {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong
                key={partIndex}
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
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  )
}
