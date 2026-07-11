import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { SourceId } from './catalog'

export async function readSource(sourceId: SourceId): Promise<string> {
  let filePath: string
  switch (sourceId) {
    case 'accordion-root':
      filePath = path.join(process.cwd(), 'src/shared/ui/Accordion/Root.tsx')
      break
    case 'input':
      filePath = path.join(process.cwd(), 'src/shared/ui/Input/index.tsx')
      break
    case 'accordion-examples':
      filePath = path.join(
        process.cwd(),
        'src/features/component-docs/examples/accordion-examples.tsx',
      )
      break
    case 'input-examples':
      filePath = path.join(process.cwd(), 'src/features/component-docs/examples/input-examples.tsx')
      break
    default:
      throw new Error(`Unknown source id: ${sourceId}`)
  }
  return readFile(filePath, 'utf8')
}
