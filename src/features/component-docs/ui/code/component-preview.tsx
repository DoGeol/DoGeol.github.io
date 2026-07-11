import type { PropsWithChildren } from 'react'
import { highlightCode } from '../../lib/highlight'
import type { SourceId } from '../../model/catalog'
import { readSource } from '../../model/source-registry'
import { CodeTabs } from './code-tabs'

export async function ComponentPreview({
  children,
  sourceId,
}: PropsWithChildren<{ sourceId: SourceId }>) {
  const code = await readSource(sourceId)
  return (
    <CodeTabs code={code} highlightedCode={await highlightCode(code)}>
      {children}
    </CodeTabs>
  )
}
