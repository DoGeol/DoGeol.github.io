# Task 2: Remove component source trace warnings

**Parent plan:** [Resume Editor Stability and Performance Implementation Plan](../2026-07-13-resume-editor-stability-performance.md)

**Files:**

- Modify: `src/features/component-docs/model/source-registry.ts`
- Modify: `src/features/component-docs/model/source-registry.test.ts`

**Interfaces:**

- Consumes: the existing `SourceId` union.
- Produces: `sourceReaders: Record<SourceId, () => Promise<string>>` with statically scoped paths.
- Preserves: `readSource(sourceId): Promise<string>`.

- [ ] **Step 1: Add a failing static-source contract test**

Assert every source ID returns known source text and the registry no longer funnels paths through a shared variable:

```ts
expect(await readSource('accordion-root')).toContain('export')
expect(await readSource('input')).toContain('Input')
expect(registrySource).not.toContain('readFile(filePath')
```

- [ ] **Step 2: Verify RED**

Run `pnpm vitest run src/features/component-docs/model/source-registry.test.ts`.

Expected: FAIL on the shared `filePath` assertion.

- [ ] **Step 3: Replace the root-dynamic read with static readers**

```ts
const sourceReaders: Record<SourceId, () => Promise<string>> = {
  'accordion-root': () =>
    readFile(path.join(process.cwd(), 'src/shared/ui/Accordion/Root.tsx'), 'utf8'),
  // Each remaining allowlisted source has its own direct readFile call.
}

export const readSource = (sourceId: SourceId) => sourceReaders[sourceId]()
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
