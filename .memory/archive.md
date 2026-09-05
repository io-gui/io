# Archive

## 2026-09-05 eslint disable ToolBase

- Added file-level `/* eslint-disable @typescript-eslint/no-unused-vars */` to `packages/three/src/nodes/ToolBase.ts`

## 2026-07-08 CONSTANT_CONDITION fixes

- IoPropertyEditor: label expr `id + ': ' + name || String(value)` → parens so fallback applies to constructor name not whole concat
- IoBuildGeometry: removed redundant `geometry &&` after early return on !geometry

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

## 2026-07-09 IoOption ghost click

- Touch tap leaf option collapses menu via onClick→collapseRoot before browser synthesizes click
- stopPropagation on touch does NOT suppress click synthesis; need preventDefault on touchend
- Hit-test for synthetic click uses coords after overlay gone → element underneath
- Same class of bug as react-spectrum #7026 / Chrome 1150073

## 2026-07-09 Binding hub-spoke mid-push race

- Symptom (polygone): AssetInfoView `this.guid` empty in download URL while `assetInfo.guid` set. PageModel binds same hub guid to model + view.
- Root: `Binding.onSourceChanged` loops targets and `setProperty`s one-by-one. First spoke's sync `guidChanged` → load/mutate → view `modelMutated` re-renders before second spoke updated.
- Final `view.guid` catches up after loop; mutation-time derived state stays wrong (`/archives//_….zip`).
- Breaking tests added in `packages/core/src/core/Binding.test.ts` (PageModel-shaped + mid-push observation). Fix deferred; polygone stash drops duplicate guid bind as workaround.

## 2026-07-09 Binding onSourceChanged batch fix

- Fix: debounce all spoke `setProperty(..., true)` then `dispatchQueue()` per dirty target
- Same batching idea as setProperties — values settle before any *-changed / mutation
- Binding.test.ts 11/11 pass

## 2026-07-09 Binding network race investigation

- Single-hub batch fix does not cover multi-hub cascades
- Binding.network.test.ts: 5 fail / 2 pass
- Fail modes: sibling cascade leaves, diamond half-join (`X+` then `X+X`), nested-hub side spoke empty during Mid.vChanged, ladder/bridge when side leaf attached before child hub
- Pass modes: ladder/bridge when child hub attached before side leaf (Set insertion order luck)
- Pattern: hub values settle in batch; leaf push is deferred to each hub's dispatchQueue — sequential hub dispatch leaves sibling/deeper leaves stale mid-wave

## 2026-07-09 Binding graph-write sync

- Arch: forward sync is transitive graph write, not event cascade
- `pushBindingValue(binding, value, dirty, visited)` walks hub→spoke via target._bindings.get(prop), debounce-writes, then flush dirty dispatchQueue
- Visited Set breaks cycles (circular binds)
- Nested hub onSourceChanged re-entry no-ops (values already equal)
- Binding.test + Binding.network + ReactiveNode/Element binding paths: 64 pass

## 2026-07-09 Binding docs

- CONTEXT.md Binding: forward sync = transitive graph write then flush
- deep-dive: data-flow bullet, Core Systems Binding line, Data Binding section rewritten (hub→leaf graph write vs leaf→hub setProperty)

## 2026-07-09 Parallel binding networks race (failing test)

- Two independent networks: source.a→midA→sink.a and source.b→midB→sink.b
- source.setProperties({a,b}) writes both hubs then dispatches; each hub's onSourceChanged settles+flushes its own network alone
- Mid-wave io-mutation / mutated sees `A1|` then `A1|B1`
- Final sink state coherent; race is mid-wave only
- Test: Binding.network.test.ts parallel-network case — fix deferred

## 2026-07-09 BindingWave epoch

- New BindingWave.ts: enter/leave/noteBindingDirty — shared dirty set, flush on outermost leave
- ChangeQueue.dispatch opens wave around #dispatchQueuedChanges only (closes before source mutated)
- Binding.onSourceChanged enters nested wave, pushBindingValue notes dirty, leave flushes only at outermost
- Parallel networks in one setProperties batch settle together → no mid-wave A1|
- ReactiveElement event-order expectation updated (one TestNode:changed for batched prop0+prop1)
- Docs: CONTEXT + deep-dive BindingWave
- 111 related tests pass

## 2026-07-09 IoOption non-overlay pointerup click

- Bug: onPointerup always called onOverlayPointeup then this.onClick — overlay path ok via hovered; non-overlay options never got click when hovered unset
- Fix: `if (!this.inoverlay) this.onClick()`
- Test: IoOption.test.ts pointerdown→pointerup on leaf not in overlay → io-option-clicked once

## 2026-07-09 Removed dispatchTiming leftover imports

- User removed dispatchTiming; build failed on unused imports (lint errors)
- Fixed: ReactiveElement.ts dropped Property import; EditorConfig.ts dropped ReactiveElement + ReactiveObject
- Build: 0 errors

## 2026-07-09 Layout top-edge drop bug

- Demo: drop Editors on top edge of 2nd panel in vertical left split → inserts above Inputs, not above Getting Started
- Cause: `Layout.moveTab` same-orient top/left uses `index - 1` → splice at 0 for target index 1
- Added failing tests in Layout.test.ts (vertical top + horizontal left); both fail as expected
- Fix not implemented yet

## 2026-07-09 Layout top-edge drop fix

- `moveTab` same-orient: `left`/`top` splice at `index` (before target), not `index - 1`
- Was causing drop on 2nd panel to land at start of split
- Layout.test.ts 15/15 pass
## 2026-07-09 ViewCameras framing / morph AABB

- Bug: `Box3.setFromObject` default `precise=false` unions morph-target extremes into AABB → origin inflation on absolute morph GLTFs
- Fix: `setFromObject(object, true)`; perspective `lookAt(center)`; near/far via corner depths along forward; `orbitControls.update()`; empty-box center → origin
- Tests: unused morph extremes ignored; off-center mesh optical axis + clip planes
- ModelViewer: no production change (debug already gone)
- Deleted TEMP-framing-aabb-fix.md handoff

## 2026-07-09 extract camera utils

- clipPlanesFromBox → packages/three/src/utils/clipPlanesFromBox.ts (takes box arg)
- copyProjection → packages/three/src/utils/copyProjection.ts
- ViewCameras imports both; tests still 6/6

## 2026-07-26 — Theme applyJSON silent for color-only switches

### [bug]
- Theme ID change → applyJSON → Color.applyJSON in-place, no io-mutation
- Light↔dark shares numeric props so ChangeQueue never fires

### [fix]
- Theme.applyJSON: after super, mutated() + dispatchMutation()
- Circuits materials: io-object-mutation → io-mutation

## 2026-07-27 — ToolBase activePointers Record→Array

### [refactor]
- WeakMap values: Record<number, Pointer3D> → Pointer3D[]
- Keying via pointer.event.pointerId; Object.values() no longer needed for handlers

## 2026-07-31 — Ortho setOverscan preserves frustum center

### [fix]
- Ortho `setOverscan` rebuilt L/R/T/B symmetric around 0, discarding off-center projections.
- Now keeps `(left+right)/2`, `(top+bottom)/2` while aspect-contain + overscan scale.

### [why]
- Circuits board camera pans/zooms via frustum bounds (not camera.zoom/position).

## 2026-08-27 — daily-routines io-gui port

### [app]
- Filters: ioPropertyEditor + sliders/switches bound to RoutinesApplet
- Locations: city buttons → cubicInOut 250ms fly (no tween.js)
- GlobeTool extends ToolBase: drag orbit, wheel zoom, double-tap
- ThreeApplet + IoThreeViewport cameraSelect scene
- Track shader GLSL → TSL LineBasicNodeMaterial (WebGPU)
- Removed dat.gui, @tweenjs/tween.js

## 2026-08-27 — IoThreeViewport null renderer crash

### [fix]
- Custom-renderer lazy-init created a local `WebGPURenderer` and never stored it. `@Property({value: _renderer})` was `null` snapshot at class def.
- `getDefaultRenderer()` singleton; pass `args.renderer ?? getDefaultRenderer()` into `super()`. Custom renderer still wins.
- Crash: `this.renderer.backend` / `.initialized` on null. Camera demo + viewport tests green.

## 2026-08-27 — daily-routines single-line imports

### [style]
- Ban multiline named imports: `@stylistic/object-curly-newline` `{ ImportDeclaration: "never" }`
- Collapsed scene.ts + tracks.ts import lists
- README Style Guide: one-line imports, max-len 320
