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
