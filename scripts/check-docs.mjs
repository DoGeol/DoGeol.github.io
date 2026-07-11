import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const AGENT_LIMIT = 300
const WIKI_BYTE_LIMIT = 12 * 1024
const WIKI_LINE_LIMIT = 250
const WIKI_H2_LIMIT = 7

const walkMarkdown = (directory) => {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return walkMarkdown(entryPath)
    return entry.name.endsWith('.md') ? [entryPath] : []
  })
}

const isAgentRule = (root, filePath) => {
  const relativePath = path.relative(root, filePath)
  return relativePath === 'AGENTS.md' || relativePath.startsWith(`docs${path.sep}agent${path.sep}`)
}

const isWikiPage = (root, filePath) => {
  const relativePath = path.relative(root, filePath)
  return (
    relativePath.startsWith(`docs${path.sep}`) &&
    !relativePath.startsWith(`docs${path.sep}agent${path.sep}`) &&
    !relativePath.startsWith(`docs${path.sep}superpowers${path.sep}`)
  )
}

const findBrokenLinks = (filePath, content) => {
  const brokenLinks = []

  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, '')
    const pathOnly = target.split('#')[0].split('?')[0]

    if (!pathOnly || /^[a-z][a-z\d+.-]*:/i.test(pathOnly)) continue

    const resolvedPath = path.resolve(path.dirname(filePath), decodeURIComponent(pathOnly))
    if (!fs.existsSync(resolvedPath)) brokenLinks.push(target)
  }

  return brokenLinks
}

export const checkDocs = (root) => {
  const errors = []
  const warnings = []
  const markdownFiles = [
    ...(fs.existsSync(path.join(root, 'AGENTS.md')) ? [path.join(root, 'AGENTS.md')] : []),
    ...walkMarkdown(path.join(root, 'docs')),
  ]

  for (const filePath of markdownFiles) {
    const relativePath = path.relative(root, filePath)
    const content = fs.readFileSync(filePath, 'utf8')

    if (isAgentRule(root, filePath)) {
      const characterCount = Array.from(content.trim()).length
      if (characterCount > AGENT_LIMIT) {
        errors.push(`${relativePath}: 에이전트 규칙이 300자를 초과했습니다 (${characterCount}자)`)
      }
    }

    for (const target of findBrokenLinks(filePath, content)) {
      errors.push(`${relativePath}: 깨진 링크 ${target}`)
    }

    if (isWikiPage(root, filePath)) {
      const byteCount = Buffer.byteLength(content)
      const lineCount = content.split(/\r?\n/).length
      const h2Count = content.match(/^## /gm)?.length ?? 0

      if (byteCount > WIKI_BYTE_LIMIT) {
        warnings.push(`${relativePath}: Wiki가 12KB를 초과했습니다 (${byteCount} bytes)`)
      }
      if (lineCount > WIKI_LINE_LIMIT) {
        warnings.push(`${relativePath}: Wiki가 250줄을 초과했습니다 (${lineCount}줄)`)
      }
      if (h2Count > WIKI_H2_LIMIT) {
        warnings.push(`${relativePath}: H2가 7개를 초과했습니다 (${h2Count}개)`)
      }
    }
  }

  return { errors, warnings }
}

const isDirectRun = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false

if (isDirectRun) {
  const root = process.cwd()
  const result = checkDocs(root)

  result.warnings.forEach((warning) => console.warn(`warning: ${warning}`))
  result.errors.forEach((error) => console.error(`error: ${error}`))

  if (result.errors.length > 0) process.exitCode = 1
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log('Documentation checks passed.')
  }
}
