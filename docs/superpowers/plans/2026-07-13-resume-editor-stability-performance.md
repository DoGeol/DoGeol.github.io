# Resume Editor Stability and Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Isolate the resume editor's development harness and whole-draft subscriptions while reducing the default skill-editor DOM without changing public output or editor behavior.

**Architecture:** Keep `ResumeEditor` as the single RHF form owner. Move session observation into a subscription hook, move the full draft watch into an imperative preview bridge, and make field/list subscriptions path-local. Lazy-mount large skill surfaces while preserving stable IDs and existing DnD arrays.

**Tech Stack:** Next.js 16.2, React 19.2, React Hook Form 7.81, Zod 4.4, dnd-kit, Vitest, Testing Library, Playwright, pnpm.

## Global Constraints

- Preserve current public UI, routes, canonical JSON, sitemap, and static output.
- `/resume-editor` and `/resume-preview` remain development-only and absent from production output.
- Keep one `useForm<ResumeDraft>` owner and strict TypeScript with no `any`.
- Use `@/` for internal imports, kebab-case files, Korean UI/test/document text, and existing image elements.
- Do not add runtime dependencies or migrate to a global DnD context.
- Follow TDD for behavior and refactoring changes; capture genuine RED before production edits.
- Each task ends with focused verification and one conventional commit.

## Task Map

1. [Tooling isolation](2026-07-13-resume-editor-stability-performance/01-tooling-isolation.md)
2. [Static component source paths](2026-07-13-resume-editor-stability-performance/02-static-source-paths.md)
3. [Draft observation boundaries](2026-07-13-resume-editor-stability-performance/03-draft-boundaries.md)
4. [Localized form subscriptions](2026-07-13-resume-editor-stability-performance/04-local-form-subscriptions.md)
5. [Lazy skill editing surfaces](2026-07-13-resume-editor-stability-performance/05-lazy-skill-editors.md)
6. [Coverage, documentation, and final verification](2026-07-13-resume-editor-stability-performance/06-final-verification.md)

## Required Order

```text
Task 1 tooling isolation
  └─ Task 2 warning-free source reads
       └─ Task 3 new observation boundaries
            └─ Task 4 production wiring and local subscriptions
                 └─ Task 5 lazy skill UI
                      └─ Task 6 documentation and full verification
```

Task 3 adds tested boundaries without removing the old parent wiring. Task 4 performs the atomic cutover and updates every consumer that previously depended on the parent-wide rerender. Task 5 starts only after localized subscriptions are stable.

## Final Review and Completion Audit

- [ ] Review the complete `develop..HEAD` range against the approved design and all six task documents.
- [ ] Fix every Critical or Important finding with a failing regression test first.
- [ ] Re-run `pnpm docs:check`, `pnpm check`, `pnpm test:coverage`, and full E2E on a dedicated port.
- [ ] Confirm `git status --short` is clean, public/canonical invariants hold, and production output excludes dev routes.
- [ ] Use `superpowers:verification-before-completion`, then `superpowers:finishing-a-development-branch` without merging or pushing until the user chooses.
