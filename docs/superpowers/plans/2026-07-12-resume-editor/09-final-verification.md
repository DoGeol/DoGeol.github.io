# Task 9: responsive E2E, 문서와 최종 검증

**Parent plan:** [Resume Editor Implementation Plan](../2026-07-12-resume-editor.md)

**Deliverable:** desktop/mobile 편집 경험과 전체 workflow가 E2E·visual test로 고정되고, 운영 방법과 architecture가 문서화되며, public 출력과 production 격리가 최종 검증된다.

**Files:**

- Modify: `src/app/(dev)/resume-editor/_components/*.tsx`
- Modify: `src/app/(dev)/resume-editor/_components/preview/*.tsx`
- Modify: `tests/e2e/resume-editor.spec.ts`
- Create: `tests/e2e/resume-editor.spec.ts-snapshots/resume-editor-desktop-desktop-chromium-darwin.png`
- Create: `tests/e2e/resume-editor.spec.ts-snapshots/resume-editor-mobile-edit-mobile-chromium-darwin.png`
- Create: `tests/e2e/resume-editor.spec.ts-snapshots/resume-editor-mobile-preview-mobile-chromium-darwin.png`
- Modify: `docs/how-to/development.md`
- Modify: `docs/explanation/architecture.md`
- Modify: `docs/explanation/project-structure.md`
- Modify: `docs/reference/stack/state-data.md`
- Modify: `docs/reference/stack/forms-utilities.md`
- Modify: `docs/reference/stack/optional.md`
- Modify: `docs/reference/stack/testing.md`
- Modify: `docs/reference/adoption-matrix.md`

**Interfaces:**

- Consumes: completed editor, renderer, preview, build checks and existing route visual baselines
- Produces: documented local edit → preview → download → replace workflow
- Constraint: existing `/resume` screenshots, route table and sitemap remain unchanged.

- [ ] **Step 1: responsive acceptance test를 먼저 완성한다**

`resume-editor.spec.ts`에 project-specific skip을 사용해 다음을 검증한다.

Desktop (`desktop-chromium`):

- toolbar 아래 editor/preview pane이 동시에 visible이다.
- pane width 비율이 각각 전체 content의 약 40%/60%이고 독립 `overflow-y: auto`다.
- toolbar는 viewport 상단에 sticky이고 iframe은 준비 완료 상태다.

Mobile (`mobile-chromium`):

- 최초에는 편집 pane만 보이고 `편집` tab이 selected다.
- `프리뷰` tab을 누르면 form은 숨고 preview만 보인다.
- mobile preset iframe width가 `390`, tablet은 `768`, desktop은 `1440`으로 바뀐다.
- 각 tab/toolbar action을 390px에서 가로 scroll 없이 keyboard로 사용할 수 있다.

Run: `pnpm exec playwright test tests/e2e/resume-editor.spec.ts`

Expected: 일부 FAIL. Task 8 기능을 바꾸지 않고 layout와 responsive class만 조정한다.

- [ ] **Step 2: Mandao-style editor shell을 production quality로 다듬는다**

최종 layout contract:

- page root: `h-dvh`, neutral canvas, vertical flex와 `overflow-hidden`
- toolbar: compact sticky surface, 문서 상태·초안 저장 시각·초기화·JSON export
- desktop content: `grid-cols-[minmax(22rem,2fr)_minmax(0,3fr)]`, 두 pane 독립 scroll
- editor pane: section card hierarchy, selected primary outline, drag handle와 field actions의 명확한 hit area
- preview pane: 어두운 stage, centered device canvas, viewport toolbar와 scale badge
- mobile `<768px`: ARIA tablist 아래 active pane만 DOM-visible; toolbar action은 2행 허용
- `prefers-reduced-motion`에서 accordion, selection scroll와 device scale animation을 제거
- light/dark theme에서 text, border, error, focus ring이 WCAG AA contrast를 만족

모든 icon-only button은 accessible name, destructive action은 명확한 문구를 갖는다. 색만으로 selected/error/dirty 상태를 전달하지 않는다. `data-testid`는 layout measurement와 handshake status처럼 semantic locator가 불가능한 지점에만 사용한다.

- [ ] **Step 3: 전체 workflow E2E를 완성한다**

독립 test와 `beforeEach`의 `sessionStorage.clear()`로 다음을 고정한다.

1. metadata/company 수정이 iframe에 반영되고 region click이 정확한 form으로 돌아온다.
2. section 표시 switch가 preview에서 section을 숨기고 다시 보인다.
3. keyboard DnD로 section과 project를 이동하면 preview 순서와 exported array 순서가 같다.
4. company를 추가·수정·삭제하고 삭제 취소/확인을 모두 검증한다.
5. reload 후 같은 tab 초안이 복구되고 `초안 초기화` 후 canonical 값으로 돌아온다.
6. 필수 값을 비우면 export가 차단되고 error summary link가 field에 focus한다.
7. valid export의 Playwright `download`를 읽어 filename, JSON parse, 수정값, 2칸 들여쓰기와 마지막 `\n`을 검증한다.
8. select/actual mode를 전환하면 actual iframe에 `data-preview-region-id`가 하나도 없다.
9. 잘못된 image path는 연결된 form error와 preview alt text를 보여준다.
10. `/resume`에는 dev marker, selection attribute와 editor message code가 없다.

Download test는 임시 파일 내용을 읽기만 하고 repository의 canonical JSON을 덮어쓰지 않는다.

- [ ] **Step 4: editor visual baseline을 생성하고 검토한다**

각 screenshot 전 font ready, iframe ready, animation disabled와 deterministic canonical draft를 기다린다.

```ts
await page.evaluate(() => document.fonts.ready)
await expect(page.getByTestId('preview-status')).toHaveText('연결됨')
await expect(page).toHaveScreenshot('resume-editor-desktop.png')
```

Run once for new files only:

```bash
pnpm exec playwright test tests/e2e/resume-editor.spec.ts --grep '@visual' --update-snapshots
```

세 이미지를 직접 열어 1440×1000 desktop, 390×844 mobile edit/preview에서 clipping, 겹침, 잘린 focus ring과 unreadable scale이 없는지 확인한다. 기존 `tests/e2e/routes.spec.ts-snapshots/resume-*.png`는 갱신하지 않는다.

- [ ] **Step 5: 개발 workflow와 architecture 문서를 갱신한다**

각 기존 문서의 관련 heading 아래에 짧게 추가하고 문서당 250줄/12KB 제한을 유지한다.

- `development.md`: `pnpm dev` → `/resume-editor` → preview → export → `_data/resume.json` 수동 교체 → `pnpm check` 순서, image는 `public/`에 먼저 배치
- `architecture.md`: canonical JSON/schema/template registry/public vs dev boundary, iframe message data flow diagram
- `project-structure.md`: `(dev)`, `_data`, `_model`, `_templates`, scripts와 E2E ownership
- `state-data.md`: RHF form owner, deferred preview, versioned sessionStorage envelope
- `forms-utilities.md`: Zod/React Hook Form/resolvers의 adopted 역할
- `optional.md`: dnd-kit three packages의 adopted 역할과 배열 내부 이동 제한
- `testing.md`: schema/component/message/E2E/visual/static-export coverage
- `adoption-matrix.md`: 여섯 신규 package를 pinned version과 `adopted` 상태로 기록

`README.md`나 public route 문서에 dev route를 일반 사용자 기능처럼 추가하지 않는다.

- [ ] **Step 6: 문서·format과 전체 검증을 새 process에서 수행한다**

```bash
pnpm format
pnpm docs:check
pnpm check
pnpm test:e2e
```

Expected:

- typecheck, lint, unit/component, format, asset, production build/static exclusion 모두 PASS
- 전체 desktop/mobile E2E와 기존/new visual baseline PASS
- build 이후 `out/`에 dev route name이나 marker가 없음
- `git diff --exit-code -- tests/e2e/routes.spec.ts-snapshots/resume-desktop-chromium-darwin.png tests/e2e/routes.spec.ts-snapshots/resume-mobile-chromium-darwin.png` PASS

실패하면 `superpowers:systematic-debugging` 절차로 root cause를 확인하고 수정한 뒤 전체 네 명령을 처음부터 다시 실행한다.

- [ ] **Step 7: 요구사항 추적과 code review를 수행한다**

`superpowers:requesting-code-review`로 approved design의 목표·비목표, production exclusion, all-section fields, DnD accessibility, bidirectional preview, session/export와 template extension boundary를 대조한다. Review finding을 처리한 뒤 `superpowers:verification-before-completion`으로 Step 6의 fresh output을 다시 확인한다.

`git status --short`, `git diff --check`, `rg 'TODO|FIXME|placeholder|준비 중' src/app/\(dev\) docs`도 확인하고 제품용 placeholder가 남아 있으면 제거한다.

- [ ] **Step 8: Task 9를 커밋한다**

```bash
git add src/app/\(dev\)/resume-editor tests/e2e/resume-editor.spec.ts tests/e2e/resume-editor.spec.ts-snapshots docs
git commit -m "feat(resume): 편집기 workflow와 검증 완성"
```

마지막으로 `git status --short`가 비어 있고 branch가 Task 1–9의 conventional commit만 포함하는지 확인한다. Merge, push와 PR 생성은 별도 사용자 지시 전에는 수행하지 않는다.
