import type { BlogBlock } from './blog-post-schema'

export type BlogTocItem = {
  id: string
  level: 2 | 3 | 4
  text: string
}

const inlineText = (content: BlogBlock['content']): string => {
  if (!Array.isArray(content)) return ''
  return content
    .map((item) => {
      if (item.type === 'text') return item.text
      if (item.type === 'link') {
        return typeof item.content === 'string'
          ? item.content
          : item.content.map((part) => part.text).join('')
      }
      return ''
    })
    .join('')
}

const visitBlocks = (blocks: BlogBlock[], visit: (block: BlogBlock) => void) => {
  for (const block of blocks) {
    visit(block)
    visitBlocks(block.children, visit)
  }
}

export const buildBlogToc = (blocks: BlogBlock[]) => {
  const items: BlogTocItem[] = []
  visitBlocks(blocks, (block) => {
    if (block.type !== 'heading') return
    const level = block.props.level
    if (level !== 2 && level !== 3 && level !== 4) return
    items.push({ id: `heading-${block.id}`, level, text: inlineText(block.content) })
  })
  return items
}

export const extractBlogPlainText = (blocks: BlogBlock[]) => {
  const fragments: string[] = []
  visitBlocks(blocks, (block) => {
    const text = inlineText(block.content).trim()
    if (text !== '') fragments.push(text)
  })
  return fragments.join(' ')
}

export const calculateReadingMinutes = (blocks: BlogBlock[], wordsPerMinute = 250) => {
  const words = extractBlogPlainText(blocks).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
