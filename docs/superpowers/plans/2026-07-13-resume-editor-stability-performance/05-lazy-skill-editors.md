# Task 5: Lazy-mount large skill surfaces

**Parent plan:** [Resume Editor Stability and Performance Implementation Plan](../2026-07-13-resume-editor-stability-performance.md)

**Files:**

- Create: `src/app/(dev)/resume-editor/_components/skills/skill-catalog-editor.tsx`
- Create: `src/app/(dev)/resume-editor/_components/skills/skill-editor-options.ts`
- Create: `src/app/(dev)/resume-editor/_components/skills/skill-reference-picker.tsx`
- Create: `src/app/(dev)/resume-editor/_components/skills/skill-editors.test.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/document-settings-editor.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/fields/skill-reference-field.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/resume-editor.test.tsx`
- Modify: `tests/e2e/resume-editor.spec.ts`

**Interfaces:**

- `SkillCatalogEditor` consumes RHF context, selection ID, and selection callback.
- `SkillReferencePicker` consumes catalog, selected IDs, and `onToggle(skillId, checked)`.
- Closed panels do not render catalog cards or choice checkboxes.

- [ ] **Step 1: Write failing lazy-mount tests**

```tsx
expect(screen.queryByLabelText('기술 ID')).not.toBeInTheDocument()
await user.click(screen.getByRole('button', { name: /기술 목록 57개 열기/ }))
expect(screen.getAllByLabelText('기술 ID')).toHaveLength(57)
```

For references, assert the closed picker shows selected rows but no catalog choice checkboxes.

- [ ] **Step 2: Write failing search/category tests**

Open the picker, type `react`, select `프론트엔드`, and verify only matching choices remain while `getValues(name)` and selected order stay unchanged.

- [ ] **Step 3: Verify RED**

Run `pnpm vitest run 'src/app/(dev)/resume-editor/_components/skills/skill-editors.test.tsx'`.

Expected: FAIL because the lazy skill components do not exist.

- [ ] **Step 4: Implement catalog disclosure**

Use `aria-expanded`/`aria-controls` and conditional children. Default to closed; derive forced-open state when `selectedRegionId` belongs to the catalog so validation navigation mounts the target field.

- [ ] **Step 5: Implement reference picker**

Keep selected sortable references mounted. Mount query, category select, and catalog checkboxes only when opened. Filtering changes only rendered choices and never calls `move()` or mutates references.

- [ ] **Step 6: Add desktop/mobile E2E acceptance**

Assert initial skill cards are absent, opening shows them, and opening/filtering a history picker preserves selected order and introduces no horizontal overflow.

- [ ] **Step 7: Verify Task 5 GREEN**

```bash
pnpm vitest run 'src/app/(dev)/resume-editor/_components'
PLAYWRIGHT_PORT=3118 pnpm exec playwright test tests/e2e/resume-editor.spec.ts --grep '기술'
pnpm typecheck
pnpm lint
```

- [ ] **Step 8: Commit Task 5**

```bash
git add 'src/app/(dev)/resume-editor' tests/e2e/resume-editor.spec.ts
git commit -m "perf(resume): 대형 기술 편집 UI 지연 마운트"
```
