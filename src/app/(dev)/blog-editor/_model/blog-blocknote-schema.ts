import {
  BlockNoteSchema,
  createCodeBlockSpec,
  createHeadingBlockSpec,
  defaultBlockSpecs,
} from '@blocknote/core'
import { codeBlockOptions } from '@blocknote/code-block'

export const blogBlockNoteSchema = BlockNoteSchema.create({
  blockSpecs: {
    paragraph: defaultBlockSpecs.paragraph,
    heading: createHeadingBlockSpec({ levels: [2, 3, 4] }),
    bulletListItem: defaultBlockSpecs.bulletListItem,
    numberedListItem: defaultBlockSpecs.numberedListItem,
    checkListItem: defaultBlockSpecs.checkListItem,
    quote: defaultBlockSpecs.quote,
    codeBlock: createCodeBlockSpec(codeBlockOptions),
    table: defaultBlockSpecs.table,
    image: defaultBlockSpecs.image,
    divider: defaultBlockSpecs.divider,
  },
})
