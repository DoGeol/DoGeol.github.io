# Task 6: Lock coverage, documentation, and visual output

**Parent plan:** [Resume Editor Stability and Performance Implementation Plan](../2026-07-13-resume-editor-stability-performance.md)

**Files:**

- Modify: `package.json`
- Modify: `vitest.config.ts`
- Modify: `docs/how-to/development.md`
- Modify: `docs/reference/stack/testing.md`
- Modify: `docs/explanation/architecture.md`
- Modify: `tests/e2e/resume-editor.spec.ts-snapshots/resume-editor-desktop-desktop-chromium-darwin.png`
- Modify: `tests/e2e/resume-editor.spec.ts-snapshots/resume-editor-mobile-edit-mobile-chromium-darwin.png`
- Modify only if changed intentionally: `tests/e2e/resume-editor.spec.ts-snapshots/resume-editor-mobile-preview-mobile-chromium-darwin.png`

**Interfaces:**

- Produces: `pnpm test:coverage`.
- Coverage floors: statements 85%, branches 75%, functions 90%, lines 88%.
- Documents isolated Playwright and localized form/preview/session boundaries.

- [ ] **Step 1: Add coverage command and thresholds**

```json
"test:coverage": "vitest run --coverage"
```

```ts
coverage: {
  provider: 'v8',
  thresholds: { statements: 85, branches: 75, functions: 90, lines: 88 },
}
```

- [ ] **Step 2: Update stable documentation**

Document `PLAYWRIGHT_PORT`, non-reused servers, RHF session subscription, the isolated preview full-watch boundary, lazy skill panels, and CI E2E as nonvisual workflow/route coverage.

- [ ] **Step 3: Run format, docs, and coverage**

```bash
pnpm format
pnpm docs:check
pnpm test:coverage
```

- [ ] **Step 4: Regenerate editor-only visual snapshots**

```bash
PLAYWRIGHT_PORT=3119 pnpm exec playwright test tests/e2e/resume-editor.spec.ts --grep '@visual' --update-snapshots
```

Expected: only intentional editor snapshots change; public route snapshots remain untouched.

- [ ] **Step 5: Inspect changed snapshots directly**

Open all three editor PNG files at original resolution. Verify no clipping, overlap, lost focus rings, or unreadable controls in desktop, mobile edit, and mobile preview.

- [ ] **Step 6: Run complete fresh verification**

```bash
pnpm format
pnpm docs:check
pnpm check
pnpm test:coverage
PLAYWRIGHT_PORT=3120 pnpm test:e2e
```

Expected: all commands exit 0; production contains nine public pages and no editor/preview route or marker.

- [ ] **Step 7: Verify invariants and commit Task 6**

```bash
git diff --check
git diff --exit-code develop -- src/app/'(pages)'/resume/_data/resume.json README.md tests/e2e/routes.spec.ts-snapshots
rg 'TODO|FIXME|placeholder|준비 중' 'src/app/(dev)/resume-editor' docs
```

Expected: canonical/public invariants have no diff and no product placeholder remains.

```bash
git add package.json vitest.config.ts docs tests/e2e/resume-editor.spec.ts-snapshots
git commit -m "test(resume): 최적화 검증 계약 완성"
```
