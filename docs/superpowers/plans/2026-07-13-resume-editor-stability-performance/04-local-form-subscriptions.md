# Task 4: Wire localized form subscriptions

**Parent plan:** [Resume Editor Stability and Performance Implementation Plan](../2026-07-13-resume-editor-stability-performance.md)

**Files:**

- Modify: `src/app/(dev)/resume-editor/_components/resume-editor.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/resume-editor.test.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/document-settings-editor.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/fields/field-shell.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/fields/repeatable-text-field.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/fields/skill-reference-field.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/section-editors/*.tsx`

**Interfaces:**

- `ResumeEditor` consumes `useResumeDraftSession` and `PreviewDraftBridgeHandle`.
- `useResumeFieldArray(name)` accepts only `FieldArrayPath<ResumeDraft>`.
- Each editor watches only its own section or nested array.

- [ ] **Step 1: Add failing subscription-isolation tests**

Add architecture assertions:

```ts
expect(resumeEditorSource).not.toContain('useWatch')
expect(resumeEditorSource).not.toContain('resumeDraftSchema.safeParse')
```

Add real behavior tests for labels, deletion values, preview updates, autosave, asset export gating, and error navigation after removing the parent watch.

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_components/resume-editor.test.tsx' 'src/app/(dev)/resume-editor/_components/section-editors/section-editors.test.tsx'
```

Expected: architecture assertions fail against the current parent watch.

- [ ] **Step 3: Wire session hook and preview bridge**

Remove `watchedDraft`, repeated parsing, autosave effects, and preview parent-map effects from `ResumeEditor`. Store a `PreviewDraftBridgeHandle` ref for export; keep pane, selection, and navigation state in the parent.

- [ ] **Step 4: Localize field and list subscriptions**

```ts
const { errors } = useFormState({ control, name, exact: true })
const values = useWatch({ control, name })
```

Use watched values for render labels. Keep `getValues()` only inside event callbacks.

- [ ] **Step 5: Strengthen field-array path types**

Change helpers and component props from `FieldPath<ResumeDraft>` to `FieldArrayPath<ResumeDraft>` where they call `useFieldArray()`. Remove the corresponding casts.

- [ ] **Step 6: Verify complete editor behavior**

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_components' 'src/app/(dev)/resume-editor/_model'
pnpm typecheck
pnpm lint
```

Expected: all commands pass with no uncontrolled-field, hook-order, or act warnings.

- [ ] **Step 7: Commit Task 4**

```bash
git add 'src/app/(dev)/resume-editor'
git commit -m "refactor(resume): form 구독 범위 지역화"
```
