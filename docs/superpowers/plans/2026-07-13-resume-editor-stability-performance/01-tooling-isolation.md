# Task 1: Isolate lint and Playwright processes

**Parent plan:** [Resume Editor Stability and Performance Implementation Plan](../2026-07-13-resume-editor-stability-performance.md)

**Files:**

- Modify: `.gitignore`
- Modify: `eslint.config.mjs`
- Modify: `playwright.config.ts`
- Modify: `scripts/ci-contract.test.ts`

**Interfaces:**

- Consumes: `PLAYWRIGHT_PORT` as an optional decimal port.
- Produces: a Playwright origin bound to `127.0.0.1`, default port `3100`, and `reuseExistingServer: false`.
- Produces: lint ignores for `.worktrees/**` and `.pnpm-store/**`.

- [ ] **Step 1: Add failing tooling contract assertions**

Extend `scripts/ci-contract.test.ts` to read `.gitignore`, `eslint.config.mjs`, and `playwright.config.ts`:

```ts
expect(gitignore).toContain('/.pnpm-store/')
expect(eslintConfig).toContain("'.worktrees/**'")
expect(eslintConfig).toContain("'.pnpm-store/**'")
expect(playwrightConfig).toContain("process.env.PLAYWRIGHT_PORT ?? '3100'")
expect(playwrightConfig).toContain('reuseExistingServer: false')
expect(playwrightConfig).toContain('127.0.0.1')
```

- [ ] **Step 2: Verify RED**

Run `pnpm vitest run scripts/ci-contract.test.ts`.

Expected: FAIL because the ignore and dedicated-server contracts are absent.

- [ ] **Step 3: Implement the isolated configuration**

Add `/.pnpm-store/` to `.gitignore`, expand `globalIgnores()`, and configure one Playwright origin:

```ts
const port = Number(process.env.PLAYWRIGHT_PORT ?? '3100')
const origin = `http://127.0.0.1:${port}`

use: { baseURL: origin, colorScheme: 'light', trace: 'retain-on-failure' }
webServer: {
  command: `pnpm dev --hostname 127.0.0.1 --port ${port}`,
  url: origin,
  reuseExistingServer: false,
  timeout: 120_000,
}
```

- [ ] **Step 4: Verify GREEN and real isolation**

```bash
pnpm vitest run scripts/ci-contract.test.ts
pnpm lint
PLAYWRIGHT_PORT=3117 pnpm exec playwright test tests/e2e/resume-editor.spec.ts --grep 'desktop shell'
```

Expected: contract test, lint, and dedicated-port E2E pass.

- [ ] **Step 5: Commit Task 1**

```bash
git add .gitignore eslint.config.mjs playwright.config.ts scripts/ci-contract.test.ts
git commit -m "chore(test): worktree와 브라우저 검증 격리"
```
