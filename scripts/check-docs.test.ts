import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { checkDocs } from './check-docs.mjs'

const roots: string[] = []

const createRoot = () => {
  const root = mkdtempSync(path.join(tmpdir(), 'check-docs-'))
  roots.push(root)
  return root
}

const write = (root: string, relativePath: string, content: string) => {
  const filePath = path.join(root, relativePath)
  mkdirSync(path.dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
}

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }))
})

describe('checkDocs', () => {
  it('에이전트 규칙이 300자를 넘으면 오류를 반환한다', () => {
    const root = createRoot()
    write(root, 'docs/agent/code.md', '가'.repeat(301))

    const result = checkDocs(root)

    expect(result.errors).toContainEqual(expect.stringContaining('300자'))
  })

  it('존재하지 않는 상대 Markdown 링크를 오류로 반환한다', () => {
    const root = createRoot()
    write(root, 'docs/README.md', '[없는 문서](reference/missing.md)')

    const result = checkDocs(root)

    expect(result.errors).toContainEqual(expect.stringContaining('깨진 링크'))
  })

  it('일반 Wiki가 12KB를 넘으면 경고를 반환한다', () => {
    const root = createRoot()
    write(root, 'docs/reference/large.md', 'a'.repeat(12 * 1024 + 1))

    const result = checkDocs(root)

    expect(result.warnings).toContainEqual(expect.stringContaining('12KB'))
  })
})
