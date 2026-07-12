# Task 3: Add session and preview observation boundaries

**Parent plan:** [Resume Editor Stability and Performance Implementation Plan](../2026-07-13-resume-editor-stability-performance.md)

**Files:**

- Create: `src/app/(dev)/resume-editor/_components/preview/preview-draft-bridge.tsx`
- Create: `src/app/(dev)/resume-editor/_components/preview/preview-draft-bridge.test.tsx`
- Create: `src/app/(dev)/resume-editor/_model/use-resume-draft-session.ts`
- Create: `src/app/(dev)/resume-editor/_model/use-resume-draft-session.test.tsx`
- Modify: `src/app/(dev)/resume-editor/_model/editor-region-index.ts`
- Modify: `src/app/(dev)/resume-editor/_model/editor-region-index.test.ts`

**Interfaces:**

- Produces: `useResumeDraftSession(form, initialResume): ResumeDraftSession`.
- Produces: `PreviewDraftBridgeHandle.reapplyAssetErrors()`.
- Produces: `buildPreviewRegionParents(draft): Map<string, string>`.
- `PreviewDraftBridge` consumes `selectedRegionId` and reports `(regionId, fallbackSectionId?)`.

- [ ] **Step 1: Write failing session-hook tests**

Use a real `useForm<ResumeDraft>` harness and injected storage to verify restoration, 299/300ms debounce, invalid transient skip, reset suppression, and next-edit autosave:

```ts
expect(storage.getItem(RESUME_DRAFT_STORAGE_KEY)).toBeNull()
await advanceTimersByTimeAsync(300)
expect(readResumeDraft(storage)).toMatchObject({ status: 'restored' })
```

- [ ] **Step 2: Verify session RED**

Run `pnpm vitest run 'src/app/(dev)/resume-editor/_model/use-resume-draft-session.test.tsx'`.

Expected: FAIL because the hook does not exist.

- [ ] **Step 3: Implement the subscription hook**

Use `form.subscribe({ formState: { values: true }, callback })`, a timer ref, hydration state, and canonical reset signature. Do not call `useWatch()` in this hook.

- [ ] **Step 4: Write failing bridge and parent-map tests**

```ts
expect(buildPreviewRegionParents(fixture).get('history-work-1')).toBe('section-experience')
expect(handle.current?.reapplyAssetErrors()).toBeNull()
```

Change a nested form value and assert only the bridge sends the updated draft to its mocked frame boundary.

- [ ] **Step 5: Verify bridge RED**

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_components/preview/preview-draft-bridge.test.tsx' 'src/app/(dev)/resume-editor/_model/editor-region-index.test.ts'
```

Expected: FAIL because the bridge and parent-map helper are absent.

- [ ] **Step 6: Implement bridge and region-parent helper**

The bridge owns full `useWatch()`, current/deferred parsing, `usePreviewAssets()`, `PreviewFrame`, and `useImperativeHandle()`. Keep the selected-region callback stable and include the deferred fallback section.

- [ ] **Step 7: Verify Task 3 GREEN**

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_model/use-resume-draft-session.test.tsx' 'src/app/(dev)/resume-editor/_components/preview/preview-draft-bridge.test.tsx' 'src/app/(dev)/resume-editor/_model/editor-region-index.test.ts'
pnpm typecheck
pnpm lint
```

- [ ] **Step 8: Commit Task 3**

```bash
git add 'src/app/(dev)/resume-editor/_components/preview' 'src/app/(dev)/resume-editor/_model'
git commit -m "refactor(resume): draft 관찰 경계 분리"
```
