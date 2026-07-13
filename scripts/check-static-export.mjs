import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const forbiddenTokens = [
  'resume-editor',
  'resume-preview',
  'resume-editor-dev-only-marker',
  'resume-editor-client-only-marker',
  'resume-editor:draft:v1',
  'PREVIEW_READY',
  'blog-editor',
  'blog-editor-client-only-marker',
  'blog-editor:drafts:v1',
]
const textExtensions = new Set(['.html', '.js', '.css', '.json', '.txt', '.xml'])
const requiredBlogFiles = [
  'blog.html',
  'blog/react-server-components.html',
  'blog/rss.xml',
  'sitemap.xml',
]

const listFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name)
    return entry.isDirectory() ? listFiles(absolute) : entry.isFile() ? [absolute] : []
  })

export const collectForbiddenStaticExportFiles = (outputDirectory) => {
  if (!existsSync(outputDirectory)) throw new Error(`정적 export가 없습니다: ${outputDirectory}`)
  return listFiles(outputDirectory).flatMap((file) => {
    const relative = path.relative(outputDirectory, file).split(path.sep).join('/')
    const content = textExtensions.has(path.extname(file)) ? readFileSync(file, 'utf8') : ''
    return forbiddenTokens
      .filter((token) => relative.includes(token) || content.includes(token))
      .map((token) => ({ file: relative, token }))
  })
}

export const assertDevelopmentRoutesExcluded = (outputDirectory) => {
  const violations = collectForbiddenStaticExportFiles(outputDirectory)
  if (violations.length === 0) return
  const details = violations.map(({ file, token }) => `- ${file}: ${token}`).join('\n')
  throw new Error(`Development-only 산출물이 포함되었습니다:\n${details}`)
}

export const assertBlogStaticExportFiles = (outputDirectory) => {
  if (!existsSync(outputDirectory)) throw new Error(`정적 export가 없습니다: ${outputDirectory}`)
  const missing = requiredBlogFiles.filter((file) => !existsSync(path.join(outputDirectory, file)))
  if (missing.length > 0) {
    throw new Error(
      `블로그 공개 산출물이 없습니다:\n${missing.map((file) => `- ${file}`).join('\n')}`,
    )
  }
}

const isMain = process.argv[1]
  ? import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
  : false
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const outputDirectory = path.join(root, 'out')
  assertDevelopmentRoutesExcluded(outputDirectory)
  assertBlogStaticExportFiles(outputDirectory)
  console.log('Development-only 격리와 블로그 static export 검사 통과')
}
