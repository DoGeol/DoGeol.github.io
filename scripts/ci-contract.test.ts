import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const routesSpec = readFileSync(path.join(root, 'tests/e2e/routes.spec.ts'), 'utf8')
const nodeVersion = readFileSync(path.join(root, '.nvmrc'), 'utf8').trim()

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

  it('main 배포를 quality 성공과 공식 Pages Actions로 제한한다', () => {
    const workflow = readFileSync(
      path.join(root, '.github/workflows/quality-and-deploy.yml'),
      'utf8',
    )

    expect(workflow).toContain('pull_request:')
    expect(workflow).toContain('branches: [main, develop]')
    expect(workflow).toContain('pnpm test:e2e:ci')
    expect(workflow).toContain('needs: quality')
    expect(workflow).toContain("github.ref == 'refs/heads/main'")
    expect(workflow).toContain('pages: write')
    expect(workflow).toContain('id-token: write')
    expect(workflow).toContain('path: ./out')
    expect(workflow).toContain('out/components.html')
    expect(workflow).toContain('out/components/accordion.html')
    expect(workflow).toContain('out/components/input.html')
    expect(workflow).not.toMatch(/uses: [^\n]+@v\d/)
  })

  it('setup-node가 설치 가능한 Node 버전을 사용한다', () => {
    expect(nodeVersion).toBe('22.16.0')
  })
})
