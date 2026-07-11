import type { SourceId } from '../../model/catalog'
import { readSource } from '../../model/source-registry'
import { highlightCode } from '../../lib/highlight'
import { CopyButton } from './copy-button'

export async function SourceCode({ sourceIds }: { sourceIds: readonly SourceId[] }) {
  const sources = await Promise.all(
    sourceIds.map(async (id) => ({ id, code: await readSource(id) })),
  )
  return (
    <div className="space-y-5">
      {await Promise.all(
        sources.map(async ({ id, code }) => (
          <section
            key={id}
            className="overflow-hidden rounded-xl border bg-neutral-50 dark:bg-neutral-950"
          >
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="font-mono text-xs">{id}</span>
              <CopyButton code={code} />
            </div>
            <div
              className="docs-code overflow-x-auto text-sm"
              dangerouslySetInnerHTML={{ __html: await highlightCode(code) }}
            />
          </section>
        )),
      )}
    </div>
  )
}
