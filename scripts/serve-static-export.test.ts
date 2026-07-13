import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { resolveStaticExportFile } from './serve-static-export.mjs'

describe('resolveStaticExportFile', () => {
  const output = path.join('/workspace', 'out')

  it.each([
    ['/', 'index.html'],
    ['/blog', 'blog.html'],
    ['/blog/react-server-components', 'blog/react-server-components.html'],
    ['/blog/rss.xml', 'blog/rss.xml'],
    ['/_next/static/app.js', '_next/static/app.js'],
  ])('%s를 export file로 해석한다', (url, file) => {
    expect(resolveStaticExportFile(output, url)).toBe(path.join(output, file))
  })

  it('상위 directory traversal을 허용하지 않는다', () => {
    expect(() => resolveStaticExportFile(output, '/../package.json')).toThrow(/안전하지 않은 경로/)
  })
})
