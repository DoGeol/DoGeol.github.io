# Resume Editor Stability and Performance Design

**Status:** approved **Date:** 2026-07-13

## Problem

The resume editor is functionally complete and well tested, but its development harness and render boundaries have avoidable coupling:

- ESLint can descend into repository-local worktrees and lint generated `.next`/`out` files.
- Local Playwright can reuse an unrelated server already listening on port 3000.
- Component source reads make Turbopack trace the project root and emit two build warnings.
- `ResumeEditor` subscribes to the entire 35KB draft, validates it repeatedly, and rerenders the editor shell for every keystroke.
- Field errors and array labels rely on broad form subscriptions or render-time `getValues()` calls.
- The canonical data can mount 57 catalog cards, 57 checkboxes per opened skill selector, and up to roughly 72 nested DnD contexts when every section is open.

## Goals

1. Make lint and E2E execution independent of sibling worktrees and unrelated local servers.
2. Remove the component-source Turbopack trace warnings without changing rendered component docs.
3. Keep `ResumeEditor` as the only `useForm<ResumeDraft>` owner while moving whole-draft observation into isolated autosave and preview boundaries.
4. Subscribe fields and repeated editors only to the paths they render.
5. Avoid mounting large skill editing surfaces until the user opens them.
6. Preserve public routes, public resume output, canonical JSON, editor behavior, DnD semantics, accessibility, and production exclusion.

## Non-goals

- No schema, canonical JSON, template registry, or section visitor redesign.
- No global DnD context migration.
- No new runtime dependency.
- No public `/resume` visual or route change.
- No automatic repository write from the editor.

## Architecture

### Tooling boundary

ESLint explicitly ignores `.worktrees/**` and `.pnpm-store/**`; Git ignores the local pnpm store. Playwright uses `PLAYWRIGHT_PORT` with a deterministic default, binds to `127.0.0.1`, and never reuses an existing server. A port collision must fail visibly rather than validate another checkout.

Component source files are mapped to statically scoped reader functions. Each function passes one literal project-relative path directly to `readFile()`, so Turbopack traces the four allowlisted files instead of following a shared dynamic root path.

### Draft session boundary

`useResumeDraftSession(form, initialResume)` owns hydration, versioned `sessionStorage`, the 300ms debounce, reset suppression, notice text, and saved time. It observes values through the React Hook Form subscription API instead of rendering from `useWatch()`.

The hook returns:

```ts
interface ResumeDraftSession {
  notice: string | null
  savedAt: string | null
  resetDraft(): void
}
```

### Preview boundary

`PreviewDraftBridge` is the only component that watches the entire draft. It derives current and deferred schema-valid snapshots, owns preview asset validation, renders `PreviewFrame`, and exposes the export asset gate through an imperative handle:

```ts
export interface PreviewDraftBridgeHandle {
  reapplyAssetErrors(): FieldPath<ResumeDraft> | null
}
```

The bridge maps deferred preview region IDs to owning section IDs and reports both the selected ID and optional fallback section to `ResumeEditor`. `ResumeEditor` remains responsible for pane switching and stable selection.

### Local form subscriptions

- `FieldShell` uses `useFormState({ name, exact: true })`.
- Section editors use `useWatch()` for their section or nested array only.
- Repeatable text and skill-reference components watch their own arrays.
- `useResumeFieldArray()` accepts `FieldArrayPath<ResumeDraft>` rather than casting arbitrary `FieldPath` values.
- Render-time labels use watched values, not incidental parent rerenders.

### Skill editing surfaces

The catalog editor is closed initially and conditionally mounts its 57 cards only when opened or when navigation targets a catalog skill. Skill-reference rows remain visible because they are resume data; the 57 catalog choices live in a separate closed picker. Opening the picker enables text search and category filtering. Filtering never changes the underlying reference order and does not participate in DnD.

## Data flow

```text
RHF form owner
  ├─ subscription → draft session → sessionStorage/savedAt
  ├─ local useWatch → active field/section editors
  └─ PreviewDraftBridge full watch
       ├─ draft validation/deferred snapshot
       ├─ asset validation/export gate
       └─ iframe preview → selected region + fallback section
```

## Error handling

- Invalid transient drafts are not autosaved or sent to the iframe.
- Pending and failed current assets continue to block export.
- Asset errors remain attached to exact RHF paths.
- Navigation to a catalog validation error forces the catalog editor to mount.
- Preview timeout, retry, exact-origin/source checks, and actual-mode purity remain unchanged.

## Performance acceptance

- Editing a nested field does not require a whole-draft subscription in `ResumeEditor`.
- Updating one field error does not subscribe every `FieldShell` to the full error object.
- The initial editor DOM contains no catalog skill-card inputs.
- A closed skill-reference picker contains no catalog choice checkboxes.
- Opening and filtering the picker does not mutate selected references or their order.
- Current canonical data and exported JSON remain byte-equivalent unless the user edits them.

## Verification

- Focused RED/GREEN tests for each new hook and component boundary.
- `pnpm test:coverage` with thresholds below the current measured baseline.
- `pnpm docs:check`, `pnpm check`, and full desktop/mobile `pnpm test:e2e`.
- Editor visual baselines are updated only for intentional editor-shell changes and inspected directly.
- Existing public resume snapshots, canonical JSON, README, sitemap, route table, and production static-export exclusion remain unchanged.
