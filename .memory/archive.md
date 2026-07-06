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
