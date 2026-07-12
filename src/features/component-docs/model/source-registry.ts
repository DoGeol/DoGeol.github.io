import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { SourceId } from './catalog'

const sourceReaders = {
  'accordion-root': () =>
    readFile(path.join(process.cwd(), 'src/shared/ui/Accordion/Root.tsx'), 'utf8'),
  input: () => readFile(path.join(process.cwd(), 'src/shared/ui/Input/index.tsx'), 'utf8'),
  'accordion-examples': () =>
    readFile(
      path.join(process.cwd(), 'src/features/component-docs/examples/accordion-examples.tsx'),
      'utf8',
    ),
  'input-examples': () =>
    readFile(
      path.join(process.cwd(), 'src/features/component-docs/examples/input-examples.tsx'),
      'utf8',
    ),
} satisfies Record<SourceId, () => Promise<string>>

export async function readSource(sourceId: SourceId): Promise<string> {
  const read = sourceReaders[sourceId]
  if (!read) {
    throw new Error(`Unknown source id: ${sourceId}`)
  }

  return read()
}
