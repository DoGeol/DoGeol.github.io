import type { ReactNode } from 'react'

import { highlightCode } from '@/features/component-docs/lib/highlight'

import type { BlogBlock } from '../_model/blog-post-schema'

const renderText = (text: string, styles: Record<string, unknown>, key: string) => {
  let node: ReactNode = text
  if (styles.code === true) node = <code>{node}</code>
  if (styles.bold === true) node = <strong>{node}</strong>
  if (styles.italic === true) node = <em>{node}</em>
  if (styles.strike === true) node = <s>{node}</s>
  if (styles.underline === true) node = <u>{node}</u>
  return <span key={key}>{node}</span>
}

const inlineContent = (block: BlogBlock) => {
  if (!Array.isArray(block.content)) return null
  return block.content.map((item, index) => {
    if (item.type === 'text') return renderText(item.text, item.styles, `${block.id}-${index}`)
    const content =
      typeof item.content === 'string'
        ? item.content
        : item.content.map((part, partIndex) =>
            renderText(part.text, part.styles, `${block.id}-${index}-${partIndex}`),
          )
    return (
      <a
        key={`${block.id}-${index}`}
        href={item.href}
        target={item.href.startsWith('http') ? '_blank' : undefined}
        rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {content}
      </a>
    )
  })
}

async function renderBlock(block: BlogBlock): Promise<ReactNode> {
  const content = inlineContent(block)
  const children =
    block.children.length === 0 ? null : await BlogBlockContent({ blocks: block.children })
  switch (block.type) {
    case 'heading': {
      const id = `heading-${block.id}`
      if (block.props.level === 2)
        return (
          <section key={block.id}>
            <h2 id={id}>{content}</h2>
            {children}
          </section>
        )
      if (block.props.level === 3)
        return (
          <section key={block.id}>
            <h3 id={id}>{content}</h3>
            {children}
          </section>
        )
      return (
        <section key={block.id}>
          <h4 id={id}>{content}</h4>
          {children}
        </section>
      )
    }
    case 'paragraph':
      return (
        <div key={block.id}>
          <p>{content}</p>
          {children}
        </div>
      )
    case 'bulletListItem':
      return (
        <ul key={block.id}>
          <li>
            {content}
            {children}
          </li>
        </ul>
      )
    case 'numberedListItem':
      return (
        <ol key={block.id}>
          <li>
            {content}
            {children}
          </li>
        </ol>
      )
    case 'checkListItem':
      return (
        <ul key={block.id} className="blog-check-list">
          <li>
            <input type="checkbox" checked={block.props.checked === true} readOnly />
            {content}
            {children}
          </li>
        </ul>
      )
    case 'quote':
      return (
        <blockquote key={block.id}>
          {content}
          {children}
        </blockquote>
      )
    case 'divider':
      return <hr key={block.id} />
    case 'image': {
      const url = typeof block.props.url === 'string' ? block.props.url : ''
      const alt = typeof block.props.name === 'string' ? block.props.name : ''
      const caption = typeof block.props.caption === 'string' ? block.props.caption : ''
      return (
        <figure key={block.id}>
          <img src={url} alt={alt} />
          {caption !== '' && <figcaption>{caption}</figcaption>}
          {children}
        </figure>
      )
    }
    case 'table': {
      if (block.content === undefined || Array.isArray(block.content)) return null
      return (
        <div key={block.id} className="blog-table-scroll">
          <table>
            <tbody>
              {block.content.rows.map((row, rowIndex) => (
                <tr key={`${block.id}-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={`${block.id}-${rowIndex}-${cellIndex}`}>
                      {typeof cell === 'string'
                        ? cell
                        : cell.map((item) =>
                            item.type === 'text'
                              ? item.text
                              : typeof item.content === 'string'
                                ? item.content
                                : item.content.map((part) => part.text).join(''),
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    case 'codeBlock': {
      const code = Array.isArray(block.content)
        ? block.content.map((item) => (item.type === 'text' ? item.text : '')).join('')
        : ''
      const language =
        typeof block.props.language === 'string' && block.props.language !== ''
          ? block.props.language
          : 'text'
      const highlighted = await highlightCode(code)
      return (
        <div
          key={block.id}
          data-content-type="codeBlock"
          data-language={language}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      )
    }
  }
}

export async function BlogBlockContent({ blocks }: { blocks: BlogBlock[] }) {
  const rendered: ReactNode[] = []

  for (let index = 0; index < blocks.length;) {
    const block = blocks[index]
    if (block.type === 'bulletListItem' || block.type === 'numberedListItem') {
      const type = block.type
      const items: BlogBlock[] = []
      while (index < blocks.length && blocks[index].type === type) {
        items.push(blocks[index])
        index += 1
      }
      const children = await Promise.all(
        items.map(async (item) => {
          const nested =
            item.children.length > 0 ? await BlogBlockContent({ blocks: item.children }) : null
          return (
            <li key={item.id}>
              {inlineContent(item)}
              {nested}
            </li>
          )
        }),
      )
      rendered.push(
        type === 'bulletListItem' ? (
          <ul key={items[0].id}>{children}</ul>
        ) : (
          <ol key={items[0].id}>{children}</ol>
        ),
      )
      continue
    }

    rendered.push(await renderBlock(block))
    index += 1
  }

  return <>{rendered}</>
}
