# Task 2: Remove component source trace warnings

**Parent plan:** [Resume Editor Stability and Performance Implementation Plan](../2026-07-13-resume-editor-stability-performance.md)

**Files:**

- Modify: `src/features/component-docs/model/source-registry.ts`
- Modify: `src/features/component-docs/model/source-registry.test.ts`

**Interfaces:**

- Consumes: the existing `SourceId` union.
- Produces: `sourceFiles: Record<SourceId, URL>` with statically scoped URLs.
- Preserves: `readSource(sourceId): Promise<string>`.

- [ ] **Step 1: Add a failing static-source contract test**

Assert every source ID returns known source text and the registry no longer contains `process.cwd()`:

```ts
expect(await readSource('accordion-root')).toContain('export')
expect(await readSource('input')).toContain('Input')
expect(registrySource).not.toContain('process.cwd()')
```

- [ ] **Step 2: Verify RED**

Run `pnpm vitest run src/features/component-docs/model/source-registry.test.ts`.

Expected: FAIL on the `process.cwd()` assertion.

- [ ] **Step 3: Replace root-dynamic paths with static URLs**

```ts
const sourceFiles: Record<SourceId, URL> = {
  'accordion-root': new URL('../../../shared/ui/Accordion/Root.tsx', import.meta.url),
  input: new URL('../../../shared/ui/Input/index.tsx', import.meta.url),
  'accordion-examples': new URL('../examples/accordion-examples.tsx', import.meta.url),
  'input-examples': new URL('../examples/input-examples.tsx', import.meta.url),
}

export const readSource = (sourceId: SourceId) => readFile(sourceFiles[sourceId], 'utf8')
```

- [ ] **Step 4: Verify tests and warning-free build**

```bash
pnpm vitest run src/features/component-docs/model/source-registry.test.ts
pnpm build
```

Expected: tests and build pass with no `Encountered unexpected file in NFT list` warning.

- [ ] **Step 5: Commit Task 2**

```bash
git add src/features/component-docs/model/source-registry.ts src/features/component-docs/model/source-registry.test.ts
git commit -m "refactor(docs): component source 경로 정적화"
```
