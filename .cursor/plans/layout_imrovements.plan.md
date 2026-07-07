---
name: Layout Package Improvements
overview: Fix Layout.moveTab edge-drop bugs, drag lifecycle holes, doc/code drift, and quality improvements in packages/layout. Twenty-one independently landable todos ordered by priority (correctness → robustness → architecture → cleanup).
todos:
  - id: fix-edge-drop-left-top
    content: "Bug: Fix edge-drop on left/top landing on wrong side (Layout.moveTab perpendicular branch)"
    status: completed
  - id: support-lone-root-edge-drop
    content: "Bug: Support edge-drop splitting of a lone root panel (findParentSplit null case)"
    status: completed
  - id: fix-remove-tab-selection
    content: "Bug: Fix Panel.removeTab stealing selection from unrelated tab"
    status: completed
  - id: fix-drag-cancel-lifecycle
    content: "Bug: Handle cancel drag phase; stop dispatching end on plain clicks (IoTab + IoLayout)"
    status: completed
  - id: dispose-tab-drag-ghost
    content: "Bug: Dispose and remove $tabDragGhost in IoLayout.dispose (overlay leak)"
    status: completed
  - id: fix-consolidate-orientation-flip
    content: "Bug: Fix Split.consolidateChildAt flipping parent orientation when parent has siblings"
    status: completed
  - id: clear-drop-marker-on-leave
    content: "Bug: Clear drop marker when pointer leaves all panels during drag"
    status: completed
  - id: guard-zero-tab-drop-target
    content: "Bug: Guard getDropTarget against panels with zero tabs (crash hardening)"
    status: completed
  - id: fix-add-tab-index-after-dedup
    content: "Bug: Adjust Panel.addTab insertion index after duplicate removal"
    status: completed
  - id: inherit-size-on-convert-to-split
    content: "Bug: Inherit target panel size when converting to split (prevent layout jump)"
    status: completed
  - id: resolve-normalization-contract
    content: "Arch: Resolve normalization contract — synchronous per CONTEXT.md or debounced per code"
    status: completed
  - id: reconcile-min-size-concept
    content: "Arch: Reconcile MinSize concept — implement minSize property or update CONTEXT.md"
    status: completed
  - id: reconcile-tab-overflow-menu
    content: "Arch: Reconcile tab-overflow hamburger menu — implement or mark roadmap in CONTEXT.md"
    status: completed
  - id: fix-nodearray-internal-op
    content: "Arch (core): Fix NodeArray.withInternalOperation re-entrancy and dispatch semantics"
    status: pending
  - id: unify-split-direction-types
    content: "Cleanup: Unify duplicate SplitDirection types (types/ vs Layout.ts)"
    status: completed
  - id: cache-drop-target-hit-testing
    content: "Perf: Cache drop-target hit-testing data for duration of drag"
    status: cancelled
  - id: extract-drop-zone-utility
    content: "Improvement: Extract drop-zone geometry into pure tested utility (dropZone.ts)"
    status: completed
  - id: normalize-io-tab-drag-ghost-imports
    content: "Cleanup: Normalize import style in IoTabDragGhost (.js extensions)"
    status: completed
  - id: clear-target-panel-on-menu-close
    content: "Improvement: Clear _targetPanelModel when add-tab menu closes"
    status: completed
  - id: normalize-after-move-tab
    content: "Improvement: Call normalize() synchronously at end of Layout.moveTab (depends on todo 11)"
    status: pending
  - id: unify-model-type-guards
    content: "Cleanup: Unify model type guards — duck typing vs instanceof"
    status: pending
isProject: false
---

<!-- Plan: @io-gui/layout improvements -->

# Layout Package Improvements

## Observations

Evaluation of `packages/layout` (2026-07-07, branch `layout-grill`, all 327 tests passing). The package has a sound model/view architecture — models (`Layout`, `Split`, `Panel`, `Tab`) own structure, elements (`IoLayout`, `IoSplit`, `IoPanel`, `IoTabs`, `IoTab`, `IoDivider`, `IoDrawer`, `IoTabDragGhost`) render it and translate gestures into model operations. CONTEXT.md maintains excellent vocabulary discipline.

The issues found cluster in three areas:

1. **Logic errors in `Layout.moveTab`** — edge-drop placement is wrong for `left`/`top` directions, and edge-drop on a lone root panel is impossible.
2. **Drag lifecycle holes** — the `cancel` phase is dispatched but never handled, `end` is dispatched on every pointerup, and the ghost element leaks on dispose. A stale `_dropTarget` can move tabs on a plain click.
3. **Doc/code drift** — CONTEXT.md promises synchronous normalization with a re-entrancy guard, a per-child `MinSize` property, a tab-overflow hamburger menu, and a shared drag singleton; none of these exist in the code as described.

There is also one core-package issue surfacing here: `NodeArray.withInternalOperation` is not re-entrant and does not suppress dispatch from method-level mutators (`splice`, `push`, …), so `Split.normalize`'s use of it does not do what the code implies.

## Approach

Fix correctness bugs first (todos 1–7), then minor robustness issues (8–10), then architectural alignment (11–16), then quality improvements (17–21). Each todo is independently landable; the only soft dependency is that todo 11 (synchronous normalization) should be decided before todo 20 (normalize in `moveTab`), and todo 17 (extract geometry) makes todo 8's guard trivially testable.

Every bug fix should land with a regression test. Model-level fixes go in `src/models/*.test.ts`; element-level fixes in `src/elements/*.test.ts` following the existing vitest + event-simulation patterns.

Verification for the whole plan: `npx vitest run packages/layout` plus manual drag-and-drop exercise via the demo (`src/demos/IoLayoutDemo.ts`).

---

## Todos

### 1. Fix edge-drop on `left`/`top` landing on the wrong side

**Todo:** `fix-edge-drop-left-top`  
**Status:** pending
**Type:** bug (high)
**Files:** `packages/layout/src/models/Layout.ts` (~line 109), `packages/layout/src/models/Layout.test.ts`

In `Layout.moveTab`, the perpendicular-split branch gates "new panel goes first" on `newIndex === -1`, which is only true for `left`/`top` when the target panel is at index 0 of its parent split. For a target at any other index, `newIndex = index - 1 >= 0`, the else branch runs, and `convertToSplit` places the new panel **after** the target — the tab lands on the right/bottom when the user dropped it on the left/top.

**Fix:** Replace the `newIndex === -1` sentinel with a direction check:

```ts
if (['left', 'top'].includes(direction)) {
  this.convertToSplit(parentSplit, targetPanel, new Panel({...tabs: [tab]}), targetPanel, orientation)
} else {
  this.convertToSplit(parentSplit, targetPanel, targetPanel, new Panel({...tabs: [tab]}), orientation)
}
```

**Test:** Vertical root split with panels `[A, B]`; drag a tab from A onto B's **left** edge; assert B's slot became a horizontal split with the new panel **first**. Repeat for `top` with a horizontal parent split.

---

### 2. Support edge-drop splitting of a lone root panel

**Todo:** `support-lone-root-edge-drop`  
**Status:** pending
**Type:** bug (high)
**Files:** `packages/layout/src/models/Layout.ts` (~lines 91–92), `packages/layout/src/models/Layout.test.ts`

When `layout.child` is a `Panel` (the normal state after consolidation), `findParentSplit` returns `null` and `moveTab` silently returns. In a single-panel layout with multiple tabs, dragging a tab to any edge does nothing — the first split can never be created by drag.

**Fix:** In `moveTab`, when `findParentSplit(targetPanel)` returns null and `targetPanel === this.child`, wrap the root: create a new `Split` with the derived orientation, assign it as `this.child`, place `targetPanel` and the new single-tab `Panel` in direction-appropriate order, then proceed. Guard the degenerate case (source === target with a single tab) the same way the perpendicular branch does.

**Test:** Layout with a single root `Panel` holding tabs `[a, b]`; `moveTab(tabB, rootPanel, 'right', ...)`; assert `layout.child` is now a horizontal `Split` with two panels, tab `b` in the second. Repeat for `'top'` asserting vertical orientation and order.

---

### 3. Fix `Panel.removeTab` stealing selection from an unrelated tab

**Todo:** `fix-remove-tab-selection`  
**Status:** pending
**Type:** bug (high)
**Files:** `packages/layout/src/models/Panel.ts` (~lines 60–68), `packages/layout/src/models/Panel.test.ts`

`removeTab` always calls `selectByIndex(min(index, length - 1))` after removal. With tabs `[A*, B, C]` (A selected), removing C re-selects index 1 → B becomes selected and A is deselected, even though the removed tab wasn't selected.

**Fix:** Capture `tab.selected` before splicing; only call `selectByIndex` when the removed tab was the selected one (or when no tab remains selected).

**Test:** Panel `[A selected, B, C]`; `removeTab(C)`; assert A still selected. Also keep existing behavior: `removeTab(A)` selects the nearest neighbor.

---

### 4. Handle the `cancel` drag phase and stop dispatching `end` on plain clicks

**Todo:** `fix-drag-cancel-lifecycle`  
**Status:** pending
**Type:** bug (high)
**Files:** `packages/layout/src/elements/IoLayout.ts` (`onTabDrag`, ~lines 83–109), `packages/layout/src/elements/IoTab.ts` (~lines 132–143), `packages/layout/src/elements/IoTab.test.ts`

Two compounding defects:

- `IoTab` dispatches `cancel` on pointercancel/pointerleave, but `IoLayout.onTabDrag` has no `cancel` branch — the ghost stays visible and `_dropTarget` stays set.
- `IoTab.onPointerup` (and `onPointercancel`/`onPointerleave`) dispatch drag events **unconditionally**, even when no drag ever started (`_dragging === false`).

Failure scenario: drag → move (sets `_dropTarget`) → pointercancel (ignored) → later plain click on any tab fires `end` → `_dropTarget` still non-null → `moveTab` teleports the clicked tab to the stale target.

**Fix:**
- In `IoTab`: only dispatch `move`/`end`/`cancel` when `this._dragging` is true; reset `_dragging = false` on `end`/`cancel`.
- In `IoLayout.onTabDrag`: add a `cancel` branch that resets `_dropTarget = null`, collapses the ghost (`expanded = false`), and calls `setDropTarget(null)` — same teardown as `end` without the `moveTab`.

**Test:** Simulate pointerdown → move past threshold → pointercancel; assert ghost collapsed. Then simulate a plain click on another tab; assert no `moveTab` side effect (tab order unchanged).

---

### 5. Dispose and remove `$tabDragGhost` in `IoLayout.dispose`

**Todo:** `dispose-tab-drag-ghost`  
**Status:** pending
**Type:** bug (leak)
**Files:** `packages/layout/src/elements/IoLayout.ts` (~lines 217–221)

The constructor appends both `$addMenu` and `$tabDragGhost` to `IoOverlaySingleton`, but `dispose` removes and disposes only `$addMenu`. Every mount/unmount cycle of an `IoLayout` leaves a ghost element in the overlay permanently.

**Fix:** Mirror the `$addMenu` teardown: `Overlay.removeChild(this.$tabDragGhost)` and `this.$tabDragGhost.dispose()` in `dispose()`.

**Test:** Instantiate and dispose an `IoLayout`; assert the overlay contains no `io-tab-drag-ghost` afterward.

---

### 6. Fix `Split.consolidateChildAt` flipping parent orientation when parent has siblings

**Todo:** `fix-consolidate-orientation-flip`  
**Status:** pending
**Type:** bug (medium)
**Files:** `packages/layout/src/models/Split.ts` (~lines 85–98), `packages/layout/src/models/Split.test.ts`, `packages/layout/CONTEXT.md` (Consolidation entry)

When a single-child split's sole child is itself a `Split`, `consolidateChildAt` sets `this.orientation = soleChild.orientation` and inlines the grandchildren. If the parent has other children — e.g. horizontal `[A, S]` where `S` consolidates to a vertical split — the whole parent flips to vertical, restacking `A` and visibly changing the layout.

**Fix:** Replace the redundant split with its sole child (`this.children.splice(index, 1, soleChild)` with size transfer), and only inline grandchildren + adopt orientation when either the orientations already match or the parent has exactly one child. Update the CONTEXT.md Consolidation entry, which currently describes the buggy behavior ("the parent adopts the lone child-split's own children and orientation").

**Test:** Horizontal split `[panelA, splitS]` where `splitS` has a lone child `splitS2` (vertical, `[B, C]`); after `normalize()`, assert parent is still horizontal with children `[panelA, splitS2]` and `splitS2` still vertical.

---

### 7. Clear the drop marker when the pointer leaves all panels

**Todo:** `clear-drop-marker-on-leave`  
**Status:** pending
**Type:** bug (UX)
**Files:** `packages/layout/src/elements/IoLayout.ts` (~lines 92–98)

During the `move` phase, `setDropTarget` is only called when `getDropTarget` returns non-null. When the pointer moves outside all panels, `_dropTarget` becomes null but the marker keeps highlighting the last panel — the UI promises a drop that releasing will not perform.

**Fix:** In the `move` branch, call `this.$tabDragGhost.setDropTarget(this._dropTarget)` unconditionally (the method already handles `null`).

**Test:** Simulate a drag move over a panel then a move to coordinates outside all panels; assert the ghost's marker reset state.

---

### 8. Guard `getDropTarget` against panels with zero tabs

**Todo:** `guard-zero-tab-drop-target`  
**Status:** pending
**Type:** bug (minor, crash-hardening)
**Files:** `packages/layout/src/elements/IoLayout.ts` (~line 134)

`y > tabRects[0].bottom` reads `tabRects[0]` without checking `tabs.length`. A rendered empty panel (legit terminal state per CONTEXT.md, or transiently during the debounced-normalize window) would throw during drag hit-testing.

**Fix:** Short-circuit: when `tabRects.length === 0`, treat the whole panel as an edge/center target without the tab-strip test.

**Test:** Covered naturally once todo 17 extracts the geometry into a pure function; add a zero-tabs case there.

---

### 9. Adjust `Panel.addTab` insertion index after duplicate removal

**Todo:** `fix-add-tab-index-after-dedup`  
**Status:** pending
**Type:** bug (minor)
**Files:** `packages/layout/src/models/Panel.ts` (~lines 48–58), `packages/layout/src/models/Panel.test.ts`

`addTab` removes an existing tab with the same id, then inserts at the caller-supplied `index` — but that index was computed against the pre-removal list. When the duplicate sits before the insertion point, the tab lands one slot too far right.

**Fix:** After removing the duplicate at `existingIndex`, decrement the requested `index` when `existingIndex < index`.

**Test:** Panel `[X, A, B]`; `addTab(new Tab({id:'X'}), 2)`; assert result `[A, X, B]` (X at index 1), not `[A, B, X]`.

---

### 10. Inherit the target panel's size when converting it to a split

**Todo:** `inherit-size-on-convert-to-split`  
**Status:** pending
**Type:** bug (minor, layout jump)
**Files:** `packages/layout/src/models/Layout.ts` (`convertToSplit`, ~lines 127–132), `packages/layout/src/models/Layout.test.ts`

`convertToSplit` creates the new `Split` with default `size: "auto"`, discarding the target panel's fixed size. A `300px` panel jumps to flex-grow after an edge drop.

**Fix:** Set `newSplit.size = panel.size` and reset `panel.size` to `DEFAULT_SIZE` (the panel now sizes within the new split; `ensureOneChildHasAutoSize` keeps the invariant).

**Test:** Panel with `size: "300px"` in a split; edge-drop a tab onto it; assert the replacing split has `size: "300px"`.

---

### 11. Resolve the normalization contract: synchronous (per CONTEXT.md) or debounced (per code)

**Todo:** `resolve-normalization-contract`  
**Status:** pending
**Type:** architecture (decision required)
**Files:** `packages/layout/src/models/Layout.ts` (~lines 36–57), `packages/layout/src/models/Split.ts`, `packages/layout/CONTEXT.md` (Normalization entry)

CONTEXT.md states normalization is **synchronous** ("the tree is well-formed when each public model method returns") and runs "inside a re-entrancy guard." The implementation is neither: `Layout.childMutated` debounces, `normalize()` runs *after* `dispatchMutation` in `dispatchMutationDebounced`, and no guard exists. Observers — including renderers — see un-normalized trees (empty panels, single-child splits) for a debounce window.

**Preferred fix:** Make the doc true. Call `normalize()` synchronously at the end of each public structural mutator (`Layout.moveTab`, and via `Layout` after `Panel.removeTab` empties a panel), wrapped in a simple `_normalizing` re-entrancy flag. Keep render scheduling debounced separately (as CONTEXT.md already says). Also reorder `dispatchMutationDebounced` so `normalize()` runs **before** `dispatchMutation()`.

**Fallback:** If synchronous normalization is deliberately deferred work, update CONTEXT.md to describe the debounced reality so readers don't build on invariants that don't hold.

**Test:** After `moveTab` that empties the source panel, assert synchronously (no timer flush) that no empty panel remains in the tree.

---

### 12. Reconcile the `MinSize` concept: implement it or remove it from CONTEXT.md

**Todo:** `reconcile-min-size-concept`  
**Status:** pending
**Type:** architecture (doc drift)
**Files:** `packages/layout/CONTEXT.md` (MinSize entry), `packages/layout/src/utils/layoutSize.ts`, `packages/layout/src/models/Split.ts`, `packages/layout/src/models/Panel.ts`

CONTEXT.md documents a per-child `MinSize` ("pixel length or percentage, default `240px`, decoupled from `size`") used for drawer-collapse decisions. No such property exists; `DEFAULT_AUTO_BUDGET_PX = 240` in `layoutSize.ts` does double duty (auto-size budget *and* collapse threshold via `parseSizeBudgetPx`).

**Decision:** Either add a `minSize` property to `Split`/`Panel` (with JSON round-trip) and use it in `IoSplit.calculateCollapsedDrawers`, or rewrite the CONTEXT.md entry to describe the actual budget mechanism. Mark as roadmap if intentional.

---

### 13. Reconcile the tab-overflow hamburger menu: implement or mark as roadmap

**Todo:** `reconcile-tab-overflow-menu`  
**Status:** pending
**Type:** architecture (doc drift)
**Files:** `packages/layout/CONTEXT.md` (Overflow entry), `packages/layout/src/elements/IoTabs.ts`

CONTEXT.md describes an `IoTabs` overflow state that hides tabs behind a hamburger menu listing them vertically. `IoTabs` has no such behavior (only per-tab label ellipsis via `IoTab.overflow`). Implement it, or annotate the CONTEXT.md entry as planned-not-implemented. Same review applies to the "shared drag singleton" claim in the Drag scope entry (the code creates one ghost per `IoLayout` instance).

---

### 14. Fix `NodeArray.withInternalOperation` re-entrancy and dispatch semantics (core)

**Todo:** `fix-nodearray-internal-op`  
**Status:** pending
**Type:** architecture (core package)
**Files:** `packages/core/src/core/NodeArray.ts` (~lines 120–148), `packages/layout/src/models/Split.ts` (`normalize`, `consolidateChildAt`)

Two problems that `Split.normalize` currently masks:

1. **Not re-entrant:** `consolidateChildAt` opens a nested `withInternalOperation` on the same array inside `normalize`'s outer one; the inner `finally` clears `_isInternalOperation` while the outer operation is still running. Fix: save and restore the previous flag value.
2. **Method-level mutators ignore the flag:** `splice`/`push`/etc. call `this.dispatchMutation()` unconditionally, so the outer wrapper in `Split.normalize` suppresses nothing — each splice dispatches anyway. Decide the contract: either `dispatchMutation` respects `_isInternalOperation` (single dispatch after the batch — then `withInternalOperation` callers must dispatch once at the end), or document that `withInternalOperation` only suppresses proxy-trap dispatch and remove the misleading wrappers in `Split.normalize`.

**Test:** Core-level unit test for nested `withInternalOperation` preserving suppression; layout-level test counting `io-mutation` dispatches during a multi-step `normalize()`.

---

### 15. Unify the duplicate `SplitDirection` types

**Todo:** `unify-split-direction-types`  
**Status:** pending
**Type:** cleanup
**Files:** `packages/layout/src/types/SplitDirection.ts`, `packages/layout/src/models/Layout.ts` (~line 23), `packages/layout/src/elements/IoTabDragGhost.ts` (~lines 73–74), `packages/layout/src/index.ts`

Two definitions exist: `types/SplitDirection.ts` includes `'none'`; `models/Layout.ts` exports one without it. `IoTabDragGhost` imports the Layout version but initializes the reflected property to `'none'` — a value outside its declared type (unchecked because `@Property` values aren't type-checked). Keep a single definition (in `types/`, including `'none'` if the ghost genuinely needs an idle state — otherwise use `'center'` as idle and drop `'none'`), export it from `index.ts`, and delete the duplicate.

---

### 16. Cache drop-target hit-testing data for the duration of a drag

**Todo:** `cache-drop-target-hit-testing`  
**Status:** pending
**Type:** performance
**Files:** `packages/layout/src/elements/IoLayout.ts` (`getDropTarget`, `onTabDrag`)

`getDropTarget` runs `querySelectorAll('io-panel')` plus `getBoundingClientRect()` on every panel and every tab **per pointermove**. It also iterates all panels letting the last hit win, including panels inside collapsed drawers.

**Fix:** On drag `start`, snapshot visible panels and their rects (skipping panels inside collapsed `io-drawer`s); reuse the snapshot during `move`; invalidate on scroll/resize or model mutation. Early-exit the panel loop on first hit.

---

### 17. Extract drop-zone geometry into a pure, tested utility

**Todo:** `extract-drop-zone-utility`  
**Status:** pending
**Type:** improvement (testability)
**Files:** new `packages/layout/src/utils/dropZone.ts` (+ `dropZone.test.ts`), `packages/layout/src/elements/IoLayout.ts` (~lines 111–175)

The NDC math and `0.8` edge thresholds in `getDropTarget` are the least-tested, most magic-numbered logic in the package, and currently untestable behind DOM queries. Extract a pure function `resolveDropZone(pointer, panelRect, tabRects, spacing): {dropIndex, splitDirection}` and name the threshold constants. Include the zero-tabs guard from todo 8. Unit-test all five directions, the tab-strip band, the self-single-tab case, and boundary values.

---

### 18. Normalize import style in `IoTabDragGhost`

**Todo:** `normalize-io-tab-drag-ghost-imports`  
**Status:** pending
**Type:** cleanup
**Files:** `packages/layout/src/elements/IoTabDragGhost.ts` (~lines 2–5)

Imports omit the `.js` extension (`'./IoTab'`, `'../models/Tab'`, `'./IoPanel'`, `'../models/Layout'`) while every other file in the package uses explicit `.js`. Harmless under `moduleResolution: "bundler"`, but inconsistent and fragile if resolution ever changes. Add the extensions.

---

### 19. Clear `_targetPanelModel` when the add-tab menu closes

**Todo:** `clear-target-panel-on-menu-close`  
**Status:** pending
**Type:** improvement (lifecycle)
**Files:** `packages/layout/src/elements/IoLayout.ts` (~lines 47, 63–81)

`_targetPanelModel` is set on `io-add-tab-request` and never cleared, holding a reference to a panel that normalization may have removed; a stale menu action could add a tab to a detached panel. Clear it after `addTab` runs and when `$addMenu` collapses without a selection (listen for the menu's collapse/expanded-change).

---

### 20. Call `normalize()` synchronously at the end of `Layout.moveTab`

**Todo:** `normalize-after-move-tab`  
**Status:** pending
**Type:** improvement (depends on todo 11 decision)
**Files:** `packages/layout/src/models/Layout.ts` (`moveTab`)

`moveTab` is the mutator most likely to leave transient empty panels — every cross-panel move strips the source panel's last tab. If todo 11 lands the synchronous-normalization contract this is part of it; if not, add the single synchronous `normalize()` here anyway to close the most visible window of un-normalized state.

**Test:** Move the sole tab out of a panel; assert synchronously that the empty source panel is gone and single-child splits are consolidated.

---

### 21. Unify model type guards: duck typing vs `instanceof`

**Todo:** `unify-model-type-guards`  
**Status:** pending
**Type:** cleanup
**Files:** `packages/layout/src/models/Layout.ts` (`isPanelNode`/`isSplitNode`), `packages/layout/src/elements/IoLayout.ts`, `packages/layout/src/elements/IoSplit.ts`, `packages/layout/src/elements/IoDrawer.ts`

Models use duck typing (`(node as Panel).tabs !== undefined`) while elements use `instanceof Split` / `instanceof Panel`. Both sides already import the classes, so standardize on `instanceof` inside the guard functions and use the guards everywhere for one source of truth.

---

## Verification

- `npx vitest run packages/layout` — full suite plus the new regression tests above.
- Core change (todo 14): `npx vitest run packages/core`.
- Manual: run the demo (`IoLayoutDemo`) and exercise — edge drops on all four sides at various split depths, splitting a lone root panel, closing selected/unselected tabs, drag-cancel (Esc/touch interrupt) followed by plain clicks, divider resize, drawer collapse/expand.