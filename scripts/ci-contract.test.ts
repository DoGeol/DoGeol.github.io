import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const routesSpec = readFileSync(path.join(root, 'tests/e2e/routes.spec.ts'), 'utf8')

describe('CI contract', () => {
  it('Linux CI에서는 visual screenshot test만 제외한다', () => {
    expect(packageJson.scripts['test:e2e:ci']).toBe('playwright test --grep-invert @visual')
    expect(routesSpec).toContain("test('/resume 현행 디자인을 유지한다 @visual'")
  })

  it('legacy gh-pages 배포 계약을 사용하지 않는다', () => {
    expect(packageJson.scripts).not.toHaveProperty('predeploy')
    expect(packageJson.scripts).not.toHaveProperty('deploy')
    expect(packageJson.devDependencies).not.toHaveProperty('gh-pages')
  })
})
