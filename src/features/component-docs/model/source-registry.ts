import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { SourceId } from './catalog'

const sourceFiles = {
  'accordion-root': 'src/shared/ui/Accordion/Root.tsx',
  input: 'src/shared/ui/Input/index.tsx',
  'accordion-examples': 'src/features/component-docs/examples/accordion-examples.tsx',
  'input-examples': 'src/features/component-docs/examples/input-examples.tsx',
} as const satisfies Record<SourceId, string>

export async function readSource(sourceId: SourceId): Promise<string> {
  const relativePath = sourceFiles[sourceId]
  if (!relativePath) throw new Error(`Unknown source id: ${sourceId}`)
  return readFile(path.join(process.cwd(), relativePath), 'utf8')
}
