# Archive

## 2026-07-03 Layout size reflector

- Replaced domain `flex` string with `size` (default auto) + `minSize` (default 240px)
- `sizeToFlex`: auto→1 1 auto, Npx/N%→0 1 Npx/N%
- Drawer collapse uses minSize not flex basis
- hasVisibleFlexGrow→hasVisibleAutoSize
- Grow weights dropped; divider end sets size px for all children
- Breaking: no flex in applyJSON

## 2026-07-04 Build fix post-migration

- Stray `,` lines in 6 three examples (flex removal artifact)
- Unused `Split` import IoLayoutDemo
- 3 examples used `minSize` but domain only has `size` — mapped to `'Npx auto'`
- `pnpm build` passes

## 2026-07-04 Layout element model property rename

- View elements hold domain node on `model` not type-named prop (layout/panel/split/tab/child)
- Change handlers: `modelMutated`, `modelChanged`
- IoTabs keeps `tabs` (NodeArray, not single model)
- IoPanel `get layout()` unchanged — reads ancestor IoLayout.model

## 2026-07-05 Split consolidate size transplant

- Bug: `consolidateChildAt` forced hoisted panel to `auto`, losing parent split size (350px demo case)
- Fix: `soleChild.size = childSplit.size`
- Test: Split.test.ts normalize — IoLayoutDemo-shaped tree, empty one panel, expect 350px on promoted panel

## 2026-07-05 IoDrawerHandle extraction

- Extracted `div.io-drawer-handle` → `io-drawer-handle` custom element
- Handle owns styles, orientation/direction/expanded icon logic, click dispatches `io-drawer-toggle`
- IoDrawer listens `io-drawer-toggle`, passes props to handle via vdom
- `ready()` → `mutated()` needed — default props skip ChangeQueue mutated call

## 2026-07-05 Safari loading spinner phantom :after

- Bug: WebKit applies `:host[loading]:after` to elements without `[loading]` until attr toggled
- Known WebKit quirk: attribute selector + pseudo-element needs non-pseudo `[attr]` rule + explicit `:not([attr]):after` reset
- Fix in IoSelector + IoMarkdown: `--io-loading: 1` on `:host[loading]`, `content:none;display:none` on `:host:not([loading]):after`

## 2026-07-05 Layout test/doc drift

- IoPanel.test: removed calls to deleted element methods `selectTab`/`moveTab`; use `panel.setSelected` + `io-tab-action` events
- README rewritten: `model` not `layout`, actual event payloads, no IoTabDragIcon/hamburger/hydrateLayout fiction, drag noted as not wired
- vitest packages/layout: 257/257 green

## 2026-07-06 Layout drag refactor tests restored

- Brought back IoTab.test.ts + IoSplit.integration.test.ts (deleted .pending)
- Old singleton tests (IoTabDragIconSingleton, IoTabDropRectSingleton) → IoLayout.$tabDragGhost + io-tab-drag events
- Action payload: `{model, action}` not `{tab, key}`; Panel.selectedID not getSelectedID()
- selected attr: hasAttribute not getAttribute string values
- setDropTarget doesn't sync dropIndex property — test marker DOM instead
- packages/layout: 321/321 green

## 2026-07-07 Stale _parents after layout normalize

- Bug: consolidateChildAt + Layout root collapse hoisted nodes via splice without unlinking from intermediate split; findParentSplit returned first stale split in _parents
- Fix Split.consolidateChildAt: clear childSplit.children before hoist; detachChildParents(soleChild) on spread branch
- Fix Layout.normalize: clear rootSplit.children before promoting sole child to layout.child
- Added 3 Layout.test.ts tests (inner consolidation, spread hoist, root collapse)
- Core hardening deferred: NodeArray removal detachChildParents + disconnectPropertyValue would help but spread-hoist still needs layout cleanup
- packages/layout: 324/324 green

## 2026-07-07 Layout improvements plan todos

- Reviewed `.cursor/plans/layout_imrovements.plan.md` — solid plan, 21 items, good priority order
- Added YAML frontmatter todos (was empty) + Todo id links in each body section
- Clusters: moveTab bugs (1-2), drag lifecycle (4-5-7), model bugs (3,6,9,10), arch/doc drift (11-14), cleanup/perf (15-21)
- Soft deps noted: 11 before 20, 17 makes 8 testable

## 2026-07-07 fix-edge-drop-left-top

- Bug: Layout.moveTab perpendicular branch used `newIndex === -1` to decide panel order in convertToSplit — only true for left/top on index-0 panel; other indices placed new panel after target (wrong side)
- Fix: gate on `['left','top'].includes(direction)` instead
- Tests: vertical split left-drop on panel B; horizontal split top-drop on panel B — assert new panel first in perpendicular split
- packages/layout: 329/329 green

## 2026-07-07 support-lone-root-edge-drop

- Bug: moveTab returned early when findParentSplit null — lone root Panel could never edge-split
- Fix: when targetPanel === this.child, wrap root in new Split with direction-ordered panels; same degenerate guard as perpendicular branch (single tab same panel)
- Tests: lone root [a,b] moveTab right → horizontal split tab b second; top → vertical split tab b first
- packages/layout: all green

## 2026-07-07 findParentSplit instanceof fix

- Runtime: moveTab crashed `parentSplit.children.indexOf is not a function` after lone-root split in browser
- Cause: findParentSplit used isSplitNode duck check; IoPanel (HTMLElement) has `.children` HTMLCollection — no indexOf, matched before model Split
- Fix: findParentSplit uses `parent instanceof Split`
- Test: dom-like parent in _parents before real Split — still returns model Split

## 2026-07-07 fix-remove-tab-selection + dispose-tab-drag-ghost

- Panel.removeTab always called selectByIndex after splice — closing unselected tab re-selected wrong tab (e.g. remove C from [A*,B,C] selected B)
- Fix: only selectByIndex when removed tab was selected OR no tab remains selected
- IoLayout.dispose removed $addMenu but not $tabDragGhost — overlay leak each mount/unmount
- Fix: mirror addMenu teardown for tabDragGhost
- Tests: Panel.removeTab selection regression x3; IoLayout.test.ts dispose ghost from overlay
- packages/layout: all green

## 2026-07-07 clear-drop-marker-on-leave

- Bug: IoLayout onTabDrag move only called setDropTarget when getDropTarget non-null — pointer leaving all panels left stale marker
- Fix: always call setDropTarget(this._dropTarget) in move branch (null clears marker)
- Test: IoSplit.integration — drag over panel then move to (-100,-100), assert marker reset

## 2026-07-07 inherit-size-on-convert-to-split

- Bug: convertToSplit created new Split with default auto size — 300px panel jumped to flex-grow on edge drop
- Fix: newSplit.size = panel.size; panel.size = DEFAULT_SIZE (ensureOneChildHasAutoSize keeps invariant)
- Test: Layout.test.ts edge-drop onto 300px panel asserts split inherits size, panel resets to auto

## 2026-07-07 fix-drag-cancel-lifecycle

- Bug: IoTab dispatched end/cancel unconditionally; IoLayout ignored cancel phase — stale _dropTarget caused moveTab on later plain click
- Fix IoTab: only dispatch move/end/cancel when _dragging; reset _dragging on end/cancel
- Fix IoLayout: cancel branch + endDrag() helper (teardown without moveTab)
- Tests: IoTab.test.ts — plain click no end, cancel collapses ghost, canceled drag + plain click no tab reorder
- packages/layout 343 tests pass

## 2026-07-07 fix-consolidate-orientation-flip

- Bug: consolidateChildAt always inlined sole-child Split + adopted its orientation — horizontal [A, S] with vertical S2 became vertical [A, B, C]
- Fix: replace redundant split with sole child when orientations differ and parent has siblings; inline only when orientations match or parent has one child
- Test: Split.test.ts horizontal [A, splitS→splitS2 vertical [B,C]] normalize keeps horizontal + splitS2
- CONTEXT.md Consolidation entry updated
- packages/layout 339 tests pass

## 2026-07-07 fix-add-tab-index-after-dedup

- Bug: Panel.addTab removed duplicate by id then inserted at caller index computed pre-removal — tab landed one slot too far right when duplicate was before insertion point
- Fix: decrement index when existingIndex < index after splice remove
- Test: Panel.test.ts [X,A,B] addTab(X,2) → [A,X,B]
- packages/layout 340 tests pass

## 2026-07-07 unify-split-direction-types + normalize-io-tab-drag-ghost-imports

- SplitDirection: single def in types/SplitDirection.ts (includes 'none' for ghost idle)
- Removed duplicate export from Layout.ts; Layout imports from types
- IoLayout, IoTabDragGhost import from types/SplitDirection.js
- index.ts re-exports SplitDirection
- IoTabDragGhost imports normalized to .js extensions
- packages/layout tests pass

## 2026-07-07 guard-zero-tab-drop-target

- Bug: getDropTarget read tabRects[0] without checking tabs.length — empty panel crashed during drag hit-test
- Fix: short-circuit when tabRects.length === 0 — skip tab-strip test, use NDC edge logic on whole panel; ndcTabHeight = 0 when no tabs
- Test: IoLayout.test.ts zero-tab panel getDropTarget does not throw
- packages/layout IoLayout.test.ts 2 tests pass

## 2026-07-07 guard-zero-tab-drop-target

- Bug: getDropTarget read tabRects[0] without checking tabs.length — empty panel crashed during drag hit-test
- Fix: short-circuit when tabRects.length === 0 — skip tab-strip test, use NDC edge logic on whole panel; ndcTabHeight = 0 when no tabs
- Test: IoLayout.test.ts zero-tab panel getDropTarget does not throw
- packages/layout IoLayout.test.ts 2 tests pass

## 2026-07-07 extract-drop-zone-utility

- New `packages/layout/src/utils/dropZone.ts`: `resolveDropZone()` pure fn + `EDGE_ZONE_THRESHOLD`/`EDGE_ZONE_OUTER_BOUND` constants
- IoLayout.getDropTarget delegates geometry to resolveDropZone; DOM hit-test loop stays in element
- dropZone.test.ts: zero tabs, 5 directions, tab strip band, spacing hit box, self-single-tab, boundary values, dragged-tab matching
- 356 layout tests pass

## 2026-07-07 layout CONTEXT.md arch alignment (doc drift)

- User chose update CONTEXT to match code, not implement missing features
- Normalization: doc now says debounced (2 frames), dispatchMutation before normalize(), brief un-normalized window; sync+re-entrancy guard marked planned
- MinSize → Size budget: derived from `size` via parseSizeBudgetPx; DEFAULT_AUTO_BUDGET_PX 240, DEFAULT_MIN_SIZE_PX 24 for drawer handle; per-child minSize property marked planned
- Overflow: split into tab-label (IoTab.overflow ellipsis, implemented) vs tab-bar hamburger (planned, not implemented)
- Drag scope: each IoLayout owns IoTabDragGhost; shared singleton marked planned

## 2026-07-07 NodeArray.withInternalOperation fix [core/arch]
- Problem: not re-entrant (inner finally cleared flag); method mutators dispatched despite outer batch wrapper
- Fix: save/restore `_isInternalOperation`; `dispatchMutation` defers via `_pendingDispatch`; outermost `withInternalOperation` flushes once
- Proxy traps route through `dispatchMutation` for coalescing
- dispose uses manual flag (no flush) to stay silent
- Tests: NodeArray.test withInternalOperation suite; Split.test normalize coalesce dispatch

## 2026-07-08 — restore layout ADRs
- User asked restore packages/layout/docs/adr from git
- Deleted in b094b89a "Finished 3 adrs"; restored from parent ebca04dc via git checkout
- 3 files staged: 0001–0003 layout ADRs
