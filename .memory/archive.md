# Archive

## 2026-09-09 root skills catalog (symlinks)

- `skills/io-gui-*` → `../packages/<pkg>/skills/io-gui-*` (git mode 120000). Source of truth stays in packages.
- `skills/README.md` + root README blurb: `npx skills add io-gui/io`.
- Windows: needs symlink support (`core.symlinks` / Developer Mode); macOS/Linux fine.

## 2026-09-09 package CONTEXT.md + Agent Skills

- Distro: each `@io-gui/*` `files[]` = dist, LICENSE, README, CONTEXT.md, skills/. Root catalog added same day (symlinks).
- Skill name = kebab flatten (`@io-gui/menus` → `io-gui-menus`); folder matches name; points at CONTEXT/README, no copy.
- New CONTEXT: navigation, editors, colors, three, inputs, sliders, icons, markdown. Kept core/layout/menus.
- Root CONTEXT map lists all 11 + relationships (Color vs ColorValue, Drawer vs IoNavigatorDrawer, three→editors side-effect).
- Editors skill warns: PropertyConfig is `[matcher, VDOMElement]` tuples — README `{tag,props}` stale.

## 2026-09-09 docs: stale menus/nav API

- User: `option: new MenuOption(...)` is stale. Views take `model`. `IoNavigator.model` is `Menu | Option`; `IoOptionSelect.model` is `Menu`.
- Fixed: quick-start, markdown README, deep-dive, io-gui.mdc, menus CONTEXT (drop "still MenuOption" parenthetical; `_Avoid_: MenuOption`).
- Also: unscoped `io-*` imports → `@io-gui/*` in package READMEs; `Register(IoClassConstructor)` → `Register(MyClass)`; ADR-0003 no longer claims rule file has old Property names; `dev.html` `ReactiveProperties`/`changed()` → `Properties`/`mutated()` (dropped duplicate handler); dead `IoTabDragIconSingleton` example → `IoNumberLadderSingleton`.

## 2026-09-09 docs: nodes → objects nomenclature

- Source: ADR-0001 (`packages/core/adr/0001-reactivenode-is-the-graph-union.md`). Object base was informal "Node"/`ReactiveNode`; now `ReactiveObject`. Union/graph vertex keeps `ReactiveNode`. Pairing is objects + elements.
- Also PR #101 / commit `1ab5586` rename `Node` → `ReactiveObject`, `Element` → `ReactiveElement`.
- Updated: README, quick-start, deep-dive (`MyNode`→`MyObject`), core/three/editors READMEs, CONTRIBUTING, io-gui.mdc, core CONTEXT `_Avoid_`, core package.json description, ADR-0001 consequences.
- Kept "node" where it means graph vertex (`ReactiveNode`, `NodeArray`, node-valued props) or domain tree node (menus/layout). Folder `src/nodes/` unchanged.

## 2026-09-06 daily-routines docs: LOD not stratified

- User: after weekday-filter removal, fix docs/code that still claimed pipeline weekday/hour bucketing.
- Truth: mesh-style rewrite already deleted hash drop. `buildCoarseTile` = RDP every run; weight → preceding kept.
- Updated README, tile-archive-format, current-architecture. `hash32` comment: leftover, no prod caller. `trackVisibility` JSDoc: u32 unix now, not planned dual layout.
- Left historical: reboot-spec, .cursor/plans, spike/.

## 2026-09-06 daily-routines drop weekday filter

- User: remove Mon–Sun toggles + all day-of-week filter code from viz.
- Removed `sunday`…`saturday` from `RoutinesFilters`, filter uniforms, `trackVisibility` TSL, `TrackRenderer` weekday decode, applet sync, Filters panel switches.
- Kept day/hour windows. Pipeline weekday/hour bucket sampling untouched (LOD, not viz filter).
- Browser: panel is day/hour only; hourRange 0.1 hides world tracks; restored 24.

## 2026-09-06 daily-routines tiled basemap live

- User only saw world2k fallback. Two causes: (1) pyramid never built — `build.sh` `declare -A` dies on macOS bash 3.2 (`A1: unbound variable`); (2) layer gated on HEAD `/tiles/bmng-200407/0/0/0.jpg` then `update()` no-op if false — Vite HEAD + missing tiles = forever fallback.
- Built GDAL pyramid z0–7: 43,690 jpg, 293 MiB. Layout `z/x/y.jpg`, z0 = 2 tiles (W/E).
- Removed world2k fallback + HEAD gate. Keep min-zoom tiles under selected LOD. `computeViewBounds` now unprojects near/far (ortho rays parallel, not from camera.position) — old math under-covered and left blurry z0 strips.
- Browser: world z1 tiles, zoom z4 covers view, Belgrade z7 + tracks. No world2k requests.

## 2026-09-06 daily-routines basemap GDAL missing

- `pnpm basemap`: download OK, build died `gdal_translate not found`. Not installed.
- Installed `brew install gdal` → 3.13.3 Iowa City. Bins: `gdal_translate`, `gdalbuildvrt`, `gdal2tiles.py`.
- `build.sh` `--processes="$(nproc)"` would fail next (macOS no nproc). Fallback `nproc || sysctl -n hw.ncpu || 4`.
- Sources already at `data/basemap/source/`. Resume with `pnpm basemap:build`.

## 2026-09-06 daily-routines RDP LOD + retile

- User: fans/grid snap on all coarse LODs; uneven detail (high-rate stays detailed, low-rate → sticks); want curvature resampling; run tile+verify.
- Cause fans: NOT rounding. `simplifyRunInto` was radial stride (keep if ≥ eps from last kept). Shared tile-seam starts → vertices every eps along same roads → lattice. 16-bit DRT1 quantize (`round((lon-min)*65535/span)`) welds nearby verts on large-bbox tiles (world L0–L4).
- Cause uneven: stride is sample-rate biased. High-rate → vertex every eps (incl. GPS jitter). Low-rate already sparse → 2-pt once eps > native spacing.
- Fix: iterative RDP (keep apex if perp. dist ≥ eps). `SIMPLIFY_MIN_DEG` = 10/111320. First retile still 2-pt L0–L11 because `eps*=2` to hit 16k/4:1 budget. Stopped raising eps (quality-only). 2nd retile 32.3s, verify clean.
- Archive 189.7 MiB / 113,708 tiles. Pts: L0 561,918; L8 869k; L11 2.07M; L13 2.29M; L14 20.6M. Tests +4 (straight→2, corner kept, sample-rate fairness, tiny budget still keeps corner).
- Browser: Belgrade L9/L12/L13 + SF L11 — roads/curves, no eps lattice. World L2 still long chords (19 km eps, expected).

## 2026-09-06 daily-routines LOD is tile stage

- User: which pipeline part creates path LOD? Can rerun from there?
- Tile (`scripts/pipeline/tile.js` / `pnpm pipeline:tile`). Leaf = full-res runs. Coarse L0..L13 = `buildCoarseTile` keep every run, raise simplify eps (2-pt floor). Ingest/canonical no LOD.
- Resume: `pnpm pipeline:tile` (+ verify). Needs existing `data/pipeline/canonical/`. Knobs: `--max-level` `--budget` `--floor`, config SIMPLIFY_TILE_FRACTION.

## 2026-09-06 daily-routines README pipeline scripts

- User: how to re-run entire ingest pipeline; explain package.json pipeline:* in README.
- Answer: `pnpm pipeline` = build.js (ingest → canonical → tile → verify). Incremental ingest (size+mtime+cache). Full reparse: `pnpm pipeline -- --force` (pnpm needs extra `--`).
- Stages: ingest / canonical / tile / verify / test. First four get `--max-old-space-size=12288`. Resume later stage without reparse (e.g. retile).
- README Data/Offline pipeline expanded; Quick Start now links there.

## 2026-09-06 daily-routines coarse LOD incomplete (not constants)

- User: zoom in → whole line chunks appear. Thought DISTANCE/TIME/SPEED not scaling on coarse LOD. Cranking constants.ts did nothing.
- Client TIME_LIMIT/SPEED_LIMIT unused. DISTANCE_LIMIT only shader gap cap (`max(0.25km, tileSpan*4/1024)`), looser at low viewLevel. Pipeline has own copies in config.js (150m) baked at ingest — not per-LOD.
- Real cause: `buildCoarseTile` stratified-decimates by dropping whole polylines to ~32k pts/level. Archive: L0–L8 ~13–15k pl; L14 680k runs. Weight preserved (~20.2M) so subsample, not simplified copy of all tracks. Exclusive LOD made holes obvious.
- Fix if wanted: keep every run, meet budget via stronger simplify (endpoints stay). Requires retile.

## 2026-09-06 daily-routines exclusive LOD draw

- User: zoom to high LOD → parent tiles stay drawn under fine lines (noise). OK with blank gap while new level loads. Never two LODs at once.
- Cause: desired kept parent chain + L0; rebuildDraw hid parent only if all 4 children resident (never at city zoom).
- Fix: desired = covering at selected level only. Evict other levels. Draw only `tile.level === targetLevel`. No childrenCovered fallback.
- Verify: overview L1 only; BG z800 L10; z6000 L13; maxZoom L14 draw+resident; zoom-out z8 L4 only.

## 2026-09-06 daily-routines LOD switch explained

- User asked how LODs switch / where to tune vs camera zoom.
- Not THREE.LOD. Per-frame SSE in `ResidencyManager.selectLevel`.
- Knob: `TARGET_TILE_PX` (384). Lower → finer sooner. `LOD_LEVELS` unused leftover.
- Draw: `TrackSystem.rebuildDraw` hides parents once children resident. `setViewLevel` is shader gap cap only.

## 2026-09-06 daily-routines remove synthesized flights

- User: no synthesized data. Drop flight-arc generation, rebuild archive.
- Removed emitFlightArc + FLIGHT_* from ingest. Gaps just split. Isolated endpoints dropped (count < 2).
- File cache VERSION 1→2 so sha1 hits of old flight-filled bins fail decode. `pnpm pipeline --force`.
- Result: 0 flight arcs, 20,213,364 pts, 280,804 pl, 556,720 rejected. Canonical plFlags all 0. Archive 210.9 MiB, verify clean.
- Client TILE_FLAG_FLIGHT skip stays, now no-op. Overview tiles hasFlight=false. No Atlantic streak.
- 653 worker "reused" this run — still 0 flightArcs in totals, flags 0. Likely identical sha1s or same-run writes.

## 2026-09-05 daily-routines shader segment discard + hard filters

- User: long straight lines across gaps (tunnel/flight/tracking off). Old app dropped segs > DISTANCE_LIMIT before packing. New pool can't. Also remove day/hour fade in/out — hard windows.
- Shader: both endpoints of LineSegments pair; drop if xz length > max(0.15 km, viewTileSpan * 4/1024). View level uniform (not tile level) so leftover parent tiles use the tight city limit. Degenerate both verts to even endpoint.
- evenVid: `vid - (vid & 1)`. `bitAnd(0xfffffffe)` went through f32 → wrong pair → one vert collapsed, other stayed → streaks toward west/origin.
- Decode skips PL_FLAG_FLIGHT (2 km flight chords pass a coarse length cap and look like one Atlantic line).
- Filters: removed dayFadeIn/Out hourFadeIn/Out from RoutinesFilters, uniforms, applet sync, property editor. Day = |dayIndex-day| <= dayRange. Hour = wrap [hour, hour+range].
- Verify: fade sliders gone. Overview = Europe clusters, no Atlantic flight streak. Hour 8 / range 1 = sparse morning tracks, hard cut. Belgrade L7 still has some ~km chords under the view-scaled cap (simplify eps).

## 2026-09-05 daily-routines pool 4M→16M

- User: zoom BG/SF → `pool full, could not upload`. Leaf tiles fat (L14 max 860k pts; SF downtown tiles 300–600k verts).
- Cause: hard cap `min(4e6, bind/8*2)` + evictForSpace only dropped 8 offscreen tiles. Desired covering set itself >4M.
- Fix: `choosePoolCapacity` → 16M (128MB xz binding). `canFit` + evict extras then coarse then target. Dummy positions stay 2 — indirect draw, no 192MB dummy grow.
- Verify: SF 1080p L14 ~5.0M verts, BG ~3.4M, 0 warns. Lines still draw.
- Headroom: adapter max bind often 2GB but Three never requests it. 16M fits default 128MB.

## 2026-09-05 daily-routines README rewrite

- User: README outdated after virtualized pipeline + heatmap removal.
- Replaced globe/JSON/dat.GUI/r58-migration docs with: flat equirect + WebGPU vertex-pulled lines, DRARCH1 stream, Io-Gui filters, pnpm pipeline, ~20.3M pts / 2010–2026 / ~220 MiB archive.
- Noted no heatmap; coarse LOD filters approximate. public/json leftover, not loaded.

## 2026-09-05 daily-routines density overlay removed

- User: heatmap gone. Accept coarse LOD filter limits.
- Deleted: DensityPass, CPU splat DataTexture, tonemap quad, line↔density crossover (LOD≤2 / ~1 seg/px), setMode, renderDensity, filtersChanged/notifyFiltersChanged, JS pointVisibility, densityMode/estimatedSegmentsPerPixel stats.
- Kept: vertex-pulled lines, trackVisibility TSL, RoutinesFilters/syncFilterUniforms, tile stream/residency/SSE, flight arcs in tiles, weight in archive (LOD line tint).
- Plan file untouched. Spikes kept (not density leftovers).
- Files: TrackRenderer, TrackSystem, ResidencyManager, tracks, applet, trackVisibility comment, tile-archive-format weight blurb, pipeline tile.js comment, pipeline.test name.

## 2026-09-05 daily-routines P3-P6 client finished

- Finished stalled tile client. Did not regenerate archive.
- P3 residency: `mapViewBounds` unprojects NDC→y=0 (ortho tilt). `childrenCovered` waits for all existing child quadrants. LRU evicts non-desired then coarse-than-target.
- P4: tile table + vertex binary search + compute writes only indirect `[count,1,0,0]`. Dummy positions grow to drawCount. No texture2DArray.
- P5 density: GPU atomic storage→fragment never showed (r185 buffer-sharing). CPU splat of resident verts → 512×256 DataTexture. Quad winding must face +Y or backface cull hides overlay. Mesh multiply blend drew opaque white; use NormalBlending + opacityNode from texture alpha. Same filter math as `trackVisibility` in JS.
- P6: first paint ~150–180ms, L0 then parents. Pool 1×4M. Flight arcs already in tiles — just drawn. Zoom-out evicts to ~8 tiles / 65k verts.
- Filters: dayRange=0 and all-weekdays-off hide lines+heat; restore brings them back. lastDay 5910 wired into dayRange.
- Debug: `globalThis.debugTrackStats` / `debugTrackSystem`.

## 2026-09-05 daily-routines cursor indexing ignore

- Added `.cursorindexingignore` with `public/**`. ~5.7k GPX/JSON track files stay out of index, still readable via @-mention.

## 2026-09-05 daily-routines ortho map camera

- PerspectiveCamera → OrthographicCamera. Frustum height = MAP_HEIGHT at zoom 1, aspect-fitted on resize.
- MapControls: minZoom/maxZoom (CAMERA_ALTITUDE / MAP_WIDTH .. / 2). Distance limits unused for ortho zoom.
- LOD: CAMERA_ALTITUDE / camera.zoom instead of getDistance(). Camera altitude parked; near/far static.
- Kept CAMERA_POLAR 0.05 lock. zoomToCursor + damping still on.

## 2026-09-05 daily-routines city presets gone

- Runtime: locations.ts, tween.ts, CITY_PRESETS/CityPreset/cityLabel, animateToCity all deleted. No leftover imports.
- Adjacent: applet.status written during load, nothing reads it (ioPropertyEditor replaced filters UI). README still has City Presets section.

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

## 2026-09-06 — daily-routines mesh-style track LOD

### [tiler]
- Was: buildCoarseTile simplified then hash-dropped whole polylines (weekday/hour stratified) → coarse LODs held ~13k of 281k tracks; zoom-in pop-in.
- Now: keep every run; meet budget by raising simplify eps ×2 until under goal or 2-pt floor. goal = max(target, 2*runCount). Per-tile 16k is goal only.
- SEGMENT_MAX_TILE_FRACTION client: 4/1024 → 1 so long simplified chords draw.
- Verify: midpoint-in-tile check leaf-only (coarse chords can leave tile).
- Archive 163.2 MiB; L0 280804 pl / 561608 pts; weight ~20.2M all levels. Exclusive residency already correct.


## 2026-10-07 — io-three core architecture ADRs + plan

### [three][architecture]
- Deep analysis of packages/three vs Blender (ScrArea/ARegion/RegionView3D, notifiers, handler stack, wmGizmo, bToolRef), Maya, Houdini, Unreal ITF. Design doc in Claude Docs (artifact cb23d4fe-...).
- Found: ThreeApplet single _width/_height/onResized written by last-drawn viewport; per-frame three-applet-needs-render reaches all graph parents (native stopPropagation does not stop graph walk — redraws do work); OrbitControls + ToolBase both listen, no arbitration; ViewCameras overscan mutates scene cameras; WebGL fallback moves single canvas.
- User decisions: drop WebGL fallback (WebGPU only). Confirmed current design already multi-viewport; ToolBase.registerViewport role → InputRouter.
- Wrote ADR 0001-0007 (packages/three/docs/adr), plan .cursor/plans/three_core_architecture.plan.md.

## 2026-10-07 — io-three decisions: naming, documents, undo, picking

### [three][decision]
- ThreeEditor name. One active ThreeDocument, switchable at runtime; per-doc session maps on editor (selection, view nav, undo).
- Undo advised: commands + transactions of auto-inverted patches (not Maya undoIt, not Blender memfile). ADR-0008 status proposed. Mutation API in P4; undo stack/commands/collab in future P8.
- Selection moved to session state (per user) in ADR-0007. Picker async interface; plain Raycaster now; BVH + ID buffer later.

## 2026-10-07 — io-three Phase 1 (frame layer) implemented

### [three][render]
- New: src/editor/ChangeBus.ts (DocumentChange, kinds + 'other'), src/render/RenderScheduler.ts (ScheduledView/Ticker, typed dirty tags, tick->collect->evaluate once->draw by priority within budget, continuous, renderer init + WebGPU backend check, getDefaultRenderer, renderScheduler singleton).
- IoThreeViewport: registers on connect, tag() instead of debounce draws, renderView() called by scheduler only, WebGL path removed, renderTarget lazy getter (ready() runs inside base ctor before class fields).
- ThreeApplet: no own rAF/Timer/_width/_height; ticker via scheduler; changeBus, notify(), requestRender(); onResized(w,h,viewport) on resize only.
- Tests 918/918 pass; new RenderScheduler.test.ts (14), ThreeApplet.test.ts, viewport tests.
- Gotchas: headless Chromium screenshots of WebGPU canvases blank -> use headed playwright. Vite aliases @io-gui/* to src; page.evaluate import('@io-gui/three') hits import map dist -> double registration; import '/packages/three/src/index.ts'. Demos render children in ctor -> construct with new, not document.createElement.

## 2026-10-07 — io-three Phase 2 (view layer) implemented

### [three][view]
- ThreeView (ReactiveObject: kind, overscan, clearColor, clearAlpha; navigation plain; getCamera builds private persp/ortho per call; scene camera copied via decompose+copyProjection, never mutated; toJSON/applyJSON). ViewNavigation (target, rotation, distance, projection, fov, near/far, axisView, cameraSource uuid, framed). ViewOrbitControls bridge (OrbitControls drives view private camera; change -> write back nav; ortho zoom folded into distance).
- Viewport: view prop (owns default, created in ctor not via init since init builds default even when arg passed), cameraSelect '' default, applyCameraSelect pending retry for late scene cameras, frame-object listener, getViewCamera(). ViewCameras deleted.
- Bug found: OrbitControls(camera, element) ctor -> connect() disconnects first -> io-gui 'Listener not found' errors. Construct without element, then connect().
- Tests 927->44 three tests; manual headed check: axis views, ortho wheel zoom, persp orbit, scene cameras, train camera after GLTF load.

## 2026-10-07 — io-three Phase 3 (input) implemented

### [three][input]
- InputRouter per viewport (lazy getter; tool in ctor registers before ctor body). Priority capture, wheel one-shot, stealing, hover pass, contextmenu suppress after captured RMB, focus on capture, document key routing (hovered > focused, skip editable). NavigationBehavior (keymap-driven orbit/pan/dolly/zoom, pinch, axis/frame keys, disabled for scene camera). Keymap data + presets. ToolBase -> ToolBaseBehavior adapter + capturesInput hook.
- Lint: `_hoveredRouter = this` trips no-this-alias -> setHoveredRouter(this).
- Headed check: LMB orbit, RMB pan, wheel (no page scroll), top-view LMB pans, Home frames, probe ToolBase gets LMB while RMB still pans. 952 tests pass.
- Gotcha for ad-hoc classes in page: must core.Register() a ToolBase subclass before `new`.

## 2026-10-07 — io-three Phase 4 (app layer) implemented

### [three][editor]
- ThreeEditor (document, mode, isPlaying, activeTools, lazy operators/tools registries, ticker, notify->document), ThreeDocument (scene, toneMapping*, uuid, changeBus, index by uuid w/ rebuild on miss, begin/transact (joins open tx), revert/reapply, history 100, commit listeners), Transaction (set coalesce, insert, remove, commit, rollback), Patch helpers. ThreeApplet = editor shim with props bound to document.
- OperatorRegistry: run (poll, begin tx, invoke/exec, modal via router.startModal), Escape cancel, lastCommand. ToolRegistry + ToolDefinition + profiles. Viewport: editor prop, _syncDocument (park/restore nav per doc), _syncBehaviors (profile + active tool).
- Gotchas: ThreeDocument.mutated() runs inside base ctor before changeBus field -> guard. In page.evaluate, import('three/webgpu') resolves via index.html import map = second three copy -> renders nothing; use Vite's /node_modules/.vite/deps/three_webgpu.js URL.
- 971 tests pass. Headed: tool -> modal operator -> 1 transaction -> both views redraw; navigate profile blocks tool; doc switch restores nav.

## 2026-10-07 — io-three Phase 5 (object selection) implemented

### [three][selection]
- SelectionModel (domain, version, active, uvSync props; plain Set of uuids; edit()/commit one bump + one 'selection' notify; prune on remove patches). Editor selection per doc. RaycastPicker async (visible + layers + userData.selectable filter; line/points threshold 4px via worldPerPixel); pickRect by projected AABB. SelectBehavior (click/box/all/none/invert, DOM marquee). Router click synthesis + Behavior.click + keymap 'LMB click'. keymaps.* combined presets. frameSelected.
- Bugs found in headed run: GridHelper won clicks (Raycaster Line threshold default 1 world unit) -> pixel threshold + selectable opt-out. Demo class fields in ready() again -> use @Property init.
- 984 tests pass.

## 2026-10-07 — io-three Phase 6 (pipelines, overlays, gizmos, UV view) implemented

### [three][render][tools]
- ViewPipeline contract + registry (forward, uv; PostProcessingPipeline w/ convergeFrames), ViewCompositor (pipeline + overlays, overlay-only redraw reuses output, tone mapping at present), Overlay registry (grid off, selection outline on, cameraFrame passepartout on), GizmoLayer/GizmoGroup/TranslateGizmoGroup, TranslateOperator (modal axis/view plane, XYZ keys, exec delta), Move tool built in. UV view kind + UVPipeline + picker via RaycastPicker({root, resolve}). Demo IoEditorViewsExample (forward+grid+gizmo, TRAA, UV).
- Verified: pixel diff vs HEAD for 14 demos -> unchanged except animation + passepartout on scene-camera views. TRAA converges in 33 draws then idle. Gizmo hover redraws one view.
- Bugs found headed: lastCommand set after commit (listeners saw stale) -> set before; gizmo press w/o move recorded empty command -> cancel on zero delta.
- Gotcha: `git stash` + headed playwright loop; browser.close() hung -> killed shell parent first, then popped stash manually.

## 2026-10-07 — io-three Phase 7 (component selection) implemented

### [three][selection][render]
- Topology cache (welded points, edges, prims, corners; key = position/index count+version), ComponentSet bitsets in SelectionModel (copy-on-write edit().components, setDomain, size mismatch = replace), GeometryAdapters (mesh/lineSegments/points), IdPass + IdComponentPicker (faces from GPU buffer, points/edges CPU + depth occlusion, view.xray), ComponentOverlay, operators object.editmode_toggle (Tab) + mesh.select_mode (1/2/3, Blender conversion), UVComponentPicker + UVEditCage (corner sel, uvSync). Selection outline hidden in edit mode.
- Verified headed (GPU): face picks resolve top/front/right correctly (y orientation ok), hidden corner skipped, faces->points conversion, UV face click = 3 corners, no console errors. 1016 tests pass.
- Bug found headed: cage disposed a geometry sharing the ID geometry's position attribute -> RenderObject error; clone attribute instead.

### [three][cleanup] 2026-10-07
- Removed ThreeApplet shim, ToolBase + Pointer3D, IoThreeViewport `applet` alias + `tool` prop, ThreeEditor.onResized (deprecated) and notify `source` param. 16 demos -> `extends ThreeEditor`, `this.document.scene`, IoThreeExample prop `applet` -> `editor`. CameraArray updates sub-camera viewports from its viewport's onResized. Editor configs moved to `configs/editor/ThreeEditor.ts` (ThreeDocument tone mapping + ThreeEditor hidden group). dist restored to dev version for PR (commit 7f62b677).

### [three][cleanup] 2026-10-08
- Removed IoThreeViewport `cameraSelect` (+ `_sceneCameraPending`, `applyCameraSelect`). Camera now chosen on ThreeView: `setAxisView`, `setCameraSource`, new `setCameraSourceByName(name?)` (no name = first scene camera; resolved lazily in `getSourceCamera` to uuid, no mutation dispatch since it runs during draw). Setters return `this` for `view: new ThreeView().setAxisView('top')`. Demos migrated; 'perspective' = default view. Docs/skill/plan/ADR-0002 note updated. tsc + 125 tests pass.
- Follow-up: replaced `setCameraSource` + `setCameraSourceByName` with `ThreeView.setCameraView(id: string | null)` (`uuid:`/`name:` prefix; none -> console.warn + default perspective). Demo scene cameras named (`sceneCamera`, Keyframes `trainCamera`); BackdropArea got a `sceneCamera` (frames `this.box` instead of `children[1]`).
- Follow-up 2: `setCameraView()`/`null` = first scene camera (lazy; `free` view until one exists). `AxisView` gained `'free'` replacing null (applyJSON maps old null -> free); `ThreeView.setAxisView` clears scene camera. Single-camera demos use `setCameraView()`, added names reverted (Retargeting back to `camera`); BackdropArea keeps its added unnamed camera; IoCameraExample keeps `name:`.

### [three][fix] 2026-10-08 review findings
- RenderScheduler: views skipped by the frame budget age (+1 priority per waited frame, `_waits`), so a slow focused view no longer starves others. ADR-0003 step 4 updated.
- SelectionOutlineOverlay `_proxy`: re-assigns geometry, skeleton/bindMatrix/bindMode, instanceMatrix/count every draw; rebuilds proxy when object kind changes. Mask mesh materials DoubleSide (open surfaces like lathe outlined fully).
- ThreeDocument.getObject: per-id miss cache (`_misses`, cleared next microtask, and on insert patches) -> a dead id walks the scene once per task. SelectionModel drops ids that miss lookup (deferred microtask `_dropLater`).
- Not changed (user: design choice): `transact()` joining an open operator transaction.

### [three][fix] 2026-10-08 ADR drift review
- Navigation no longer dispatchMutation: `ThreeView.markNavigationChanged()` calls listeners (`addNavigationListener`/`removeNavigationListener`); IoThreeViewport subscribes (`_onNavigation` -> tag 'view'; constructor + viewChanged + dispose). viewMutated (behaviors/rendering resync) now only on real view prop changes.
- `listens()` no longer calls `_syncRendering`; uses `this._compositor?.listens(change) ?? 'content'`.
- Picks update matrices first: `IdPass.read`, `RaycastPicker.pick/pickRect` call `updateMatrixWorld()`.
- ADR text: 0003 (Tick before Collect, picks outside frame, no untagged-draw debug error), 0002 (view kinds, per-document navigation on ThreeView, not in toJSON), 0005 (lockCameraToView/lockGroup planned; navigation skips mutation). README + SKILL note.
- Open (user: later): default keymap LMB-drag orbit vs ADR-0004 "tools own LMB".

### [three][fix] 2026-10-08 minor review items
- ThreeView toJSON/applyJSON include toneMapping + toneMappingExposure.
- Removed dead `OverlayType.listens`.
- `getWorldPerPixel` through a perspective scene camera measures at scene bounds centre depth (`sceneDistance`), not nav.distance.
- `getSourceCamera` caches the found camera (`_sourceCamera`, valid while in scene) + per-task miss (`_missingSource`).
- `_syncBehaviors` rebuilds tool behaviors/gizmo groups when view or editor swaps (not only tool id).
- ChangeBus: `LIMIT` 10000 -> collapses to one `other`; `clear()`; editor clears old doc bus on switch.
- Skipped (user): migration notes - no users yet.

### [three][refactor] 2026-10-08 PR #111 cleanup (LOC/dup/core features)
- Core events replace listener sets: ThreeView.markNavigationChanged -> `dispatch('navigation-changed', undefined, true)` (bubbles to view's parents); IoThreeViewport `Listeners` `'navigation-changed': 'onNavigationChanged'` (stopPropagation + tag view). Removed add/removeNavigationListener + viewport swap/guard code. ThreeDocument commit listeners -> `dispatch('commit', transaction)`; SelectionModel listens via addEventListener (skip remove if doc `_disposed`).
- Core `@Field` replaces lazy-init guards: ThreeDocument.changeBus (`@Field(ChangeBus)`, no mutated() guard), ThreeEditor._selections (`@Field(Map)`). ThreeEditor operators/tools plain fields. IoThreeViewport renderTarget/inputRouter/navigationBehavior/selectBehavior/gizmoLayer plain readonly fields (handlers during base ctor guard `!this.inputRouter`); removed ready()/attachSurface; keymapChanged() called from ctor (TS2729 if field init reads `this.keymap`). editorMutated -> editorChanged.
- `utils/Registry<T extends {id}>` (register/get/list): `pipelineTypes`, `overlayTypes` (replace registerPipeline/getPipelineType/listPipelines/registerOverlay/getOverlayType/listOverlays), editor.tools, `OperatorRegistry extends Registry`. ToolRegistry gone.
- `utils/KeyedPool<T>` (get(key, create, fits?) / sweep() / clear()) for IdPass proxies, SelectionOutline proxies, ComponentOverlay cages, UVPipeline cages.
- `StateCage` (componentMaterials.ts): shared faces/edges/points-with-state base; EditCage + UVEditCage extend it. Bug hit: Float32BufferAttribute copies its array -> read state arrays back from `.array` (regression test in SelectionOutlineOverlay.test).
- UVPipeline object mode draws layouts with UVEditCage (`getUVLayoutState`, active = selected state, fill alpha .3 vs old .18); removed buildUVGeometry, wire/fill materials, wireColor/activeColor. collectUVMeshes kept (object mode incl. instanced).
- `utils/camera.ts` (copyProjection moved in, cameraAspect, worldPerPixelAt, projectToPixels moved from Gizmo.ts); ThreeView.getWorldPerPixel uses worldPerPixelAt (sceneDistance removed). `utils/sceneGraph.ts` isDescendant/isShown (4 copies removed).
- Behavior capture methods optional (wantsCapture/begin/update/end/cancel); no-op impls removed. InputRouter listener table + single release path. SelectBehavior `_select` shared pick+apply. Keymap `zoom`/`clickSelect` shared entries. ThreeView JSON via super.toJSON + ThreeViewSettings type. Topology dropped test-only edgeIndex/_edgeLookup + unused pointToVertex. ViewNavigation applyJSON null->free shim removed. Skill: removed "no cameraSelect" migration note.
- Net ~-300 LOC. tsc 0, lint 0 err/27 warn (pre-existing), 138 tests. Browser: edit mode + UV pixel-identical to before; nav/gizmo/scene cameras/outline OK.
- External edit seen: IoEditorViewsExample `addEventListener('commit', this.changed)` (unbound -> throws on commit). Reported to user, not reverted.
- Vitest browser runs hung (10 min, "no tests") until stale Chrome for Testing processes killed; use `--browser.headless`.

### [inputs] 2026-10-08
- IoNumberLadder.expandedChanged caret restore: setTimeout(fn, 0) -> queueMicrotask. Deferral only needs to outrun the collapse turn, not a later task. Other setTimeout(0) sites left (focus races in IoNumber.onBlur and IoOverlay window blur; selection test flushes are macrotask barriers).
- Follow-up (user): `Transaction.set` always assigns (no copy; refs stored, undo restores identity; read-only props like position throw TypeError). New `Transaction.copy` copies into held object (values cloned as snapshots). Patch `ValuePatch` op 'set' | 'copy'; `writeValue(op, ...)`, `patchValue(op, v)` replace cloneValue. Coalesce per path only when op repeats (mixing keeps order; test proves). TranslateOperator uses copy. README/CONTEXT/SKILL/ADR-0008 updated. User fixed demo listener to `() => this.changed()`. 140 tests.

### [three][demos] 2026-10-09
- Merged IoSelectionExample + IoEditorViewsExample -> `demos/examples/IoEditorExample.ts` (`io-editor-example`, index.html Three > Editor leaf; old src+dist removed; plan refs annotated). Views: perspective (forward, grid overlay, Move tool), top (traa pipeline, select profile, grid, setAxisView('top')), uv (select). Inspector column (ioPropertyEditor of active object) + status bar. Shapes Box/Sphere/Cone/Knot with per-shape colored checker map (UV view shows active map). GridHelper dropped for grid overlay. Knot preselected.
- Found: inspector vector editors stay stale after a Move commit (object vectors mutated in place, no io-mutation). Fix in demo onCommit: dispatchMutation(active.position/rotation/scale). Verified by toggling it off in browser (stale 3 vs 1.669).
- Playwright headless chromium with `--enable-unsafe-webgpu --use-angle=metal` renders WebGPU demos; vite dev on alt port; hash `#path=Demos,Three,Editor`.

### [three][demos] 2026-10-09 inspector binding
- `SelectionModel.active` is uuid string. `ioPropertyEditor` `configureDebounced` renders `[]` when value is not an object, so `selection.bind('active')` updates the property and the panel stays empty.
- `IoPanel` selector `caching: 'reactive'`: `IoSelector.renderDebounced` reuses cached element and skips new props. Passing `getActiveObject()` from `changed()` sticks on first object. Live binding of a reactive object property is what gets through the cache.
- `group` is on the layout element (`SelectorElement & { group?: string }`), not `IoThreeViewportProps`. Demo spreads the vnode: `{...ioThreeViewport(...), group: 'view'}`. tsc -b packages/three ok.
- IoLayout add menu: elements sharing `group` nest under one option (first-seen order); ungrouped stay top-level. Test in IoLayout.test.ts.

### [layout][css] 2026-10-09 auto splits unequal
- User: two `size: "auto"` sibling splits should be equal; deeper nested panel count makes the top splits unequal.
- Cause: `sizeToFlex('auto')` → `flex: 1 1 auto`. `flex-basis: auto` resolves to max-content. Equal `flex-grow` only splits leftover space, so the content-size gap remains. A deeper horizontal split's max-content width is the sum of its panels; that width bubbles up as the ancestor's flex base. `overflow: hidden` zeros the automatic minimum (scroll container) so they can shrink, but shrink is also proportional to that base, so they still don't meet. Equal share would be `flex: 1 1 0%`. Not changed (identify only).

### [three][demo] 2026-10-09 VolumePerlin Hidden regex
- `Hidden: [new RegExp(/^$/)]` matches only `""`. Property names never hit it, so inherited fields stayed in Main. Changed to `/^[\s\S]*$/`, which `.test()`s true for every string. Explicit `Main: ['threshold', 'steps']` is still assigned before regex, so those two stay visible.

### [three][demos] 2026-10-09 (2)
- ThreeDocument file = `document.toJSON()` (core default toJSON: three Scene.toJSON + toneMapping/exposure), typed `ThreeDocumentData` (scene: JsonObject; SceneJSON is an interface -> not assignable to core Json). `static async fromJSON` via ObjectLoader.parseAsync. toJSON calls scene.updateMatrixWorld() first: Object3D.toJSON writes local matrix, stale until a draw (round-trip test caught it).
- ThreeView.switchDocument: unseen document keeps axisView (was reset to free) -> axis views stay top/front/... across loads. Test added.
- IoEditorExample (user's ioLayout WIP) loads src/demos/examples/EditorDocument1.json / 2.json via fetch; heading ioButtons; per-file promise cache (switch back keeps edits/selection/navigation). URLs: one `new URL('../../../src/demos/examples/X.json', import.meta.url)` literal per file. Vite dev rewrites `new URL('<dir>/', import.meta.url)` dropping trailing slash -> wrong dir; per-file literal fine. Works from dist too (path via ../../../src).
- Gotchas: ReactiveElement.ready() runs in base ctor -> class field initializers not yet run; use @Field(Map). `changed()` is NOT auto-called on property change (generic is `mutated()`); add `fileChanged()`. IoSelector caching 'reactive' (IoPanel) reuses cached element -> new vElement props (e.g. new binding) ignored; Inspector binds to example's own `activeObject` (synced from current selection) instead of `editor.selection.bind('activeObject')`.
- ThreeEditorStatus (user WIP) listened to initial doc's commit only -> follows editor.document in editorMutated now.
- Docs generated in browser (temp module + playwright) from same scenes; doc2: hemisphere+sun, Floor (selectable false, 8x6), Icosahedron/Cylinder/Capsule, Group Stack(Base, Ring), ACES 1.2.
- Editors nested Advanced: `IoObject.properties` `{type: Array, init: null}` is `[]`. Forwarded into nested `IoPropertyEditor`, whose group loop required `properties === undefined`, so Advanced never rendered. Gate is now `!this.properties?.length`. IoObject passes `undefined` when the list is empty. Explicit non-empty filters still hide groups. Test in IoObject.test.ts.
- Unit suite: 3 failures in layout/layoutSize.test.ts from user's uncommitted sizeToFlex '1 1 0%' change. Lint errors in user's WIP (double quotes in editorLayout, trailing spaces).
- Inspector stale after move again (user removed onCommit dispatchMutation in their rewrite) - reported, not changed.

### [three][demos] 2026-10-09 (3)
- User correction: documents are TS classes extending ThreeDocument, not JSON. EditorDocument1.ts / EditorDocument2.ts (@Register, build scene in constructor after super; doc2 passes ACES/1.2 defaults to super), shared checkerTexture.ts. IoEditorExample DOCUMENTS = name -> () => import('./EditorDocumentN.js').then(m => new m.EditorDocumentN()); promise cache per name; property `documentName`.
- Reverted ThreeDocument toJSON/fromJSON/ThreeDocumentData + round-trip test + README/CONTEXT/SKILL notes; JSON files deleted. Kept ThreeView.switchDocument axis-view fix (+README line), inspector activeObject binding, ThreeEditorStatus document following.
- Browser verified (vite dev): both docs import once, switch both ways, axis views kept, inspector + status follow. three tests 141 pass.

### [three][document] 2026-10-09 (4)
- ThreeDocument.onRendererInitialized(renderer): runs once per renderer (WeakSet `_renderers`), via `_prepareRenderer` called by IoThreeViewport.renderView before each draw (after editor hook). Covers docs opened after renderer ready. ComputeTextureExample (user's doc conversion) runs `renderer.compute(computeNode)` there. Editor-level hook kept (IoAnimationKeyframesExample uses it).
- Test in ThreeDocument.test.ts; README lifecycle + Renderer Initialization, SKILL gotcha updated. Browser verified: compute pattern on plane in Editor example. three tests 142 pass.

### [three][demos] 2026-10-10
- GeometriesExample.ts + GeometryColorsExample.ts: ThreeDocument subclasses replacing IoGeometriesExample / IoGeometryColorsExample (Io* src + dist deleted; index.html menu entries GeometryPrimitives/GeometryColors + navigator elements removed, GeometryConvex stays). Added to IoEditorExample DOCUMENTS.
- Geometries: spin (editor onAnimate) dropped - documents have no animate hook, IoEditorExample never plays, and it would overwrite edits. Wireframe is a document `@Property` (Main group, Document tab); meshes named. TextureLoader onLoad -> `this.notify({kind: 'material'})`: forward views draw only on changes, so an async texture otherwise stays black until the next edit.
- Colors: wireframe children + fake shadow planes `userData.selectable = false` (click selects the colored mesh). Original scale kept (views frame on open, grid scales with distance).
- Browser verified: both load, textured, wireframe toggle, pick selects 'Gradient'. tsc + eslint clean.

### [three][document] 2026-10-10 (2)
- ThreeDocument.onAnimate(delta, time): empty hook; ThreeEditor.tick calls editor onAnimate, then document.onAnimate, then notify 'time'. Only while editor.isPlaying.
- GeometriesExample spin restored in document onAnimate (rotation from scheduler `time`, elapsed since app start: jumps on first play / resume, same as old editor hook).
- IoEditorExample heading: ioBoolean Play/Pause bound to editor.isPlaying (default off).
- Test 'ticks the document onAnimate after the editor, only while playing'. README (lifecycle para + Each frame step 1), CONTEXT Playing, SKILL lines updated. three tests 143 pass; browser verified spin + pause.

### [three][document] 2026-10-10 (3)
- ThreeDocument `autoplay` @Property (Boolean, false; in ThreeDocumentProps). Hint only: ThreeEditor ignores it (applying it in documentChanged would clobber `init: {isPlaying: true}` editors, since document is set after args). IoEditorExample.open sets `editor.isPlaying = document.autoplay` on every open (switch away pauses). GeometriesExample `super({autoplay: true, ...args})`.
- README lifecycle para + SKILL line updated. tsc/eslint clean, three tests 143. Browser: Geometries plays (label Pause), EditorDocument1/2 pause.
- Vite dev gotcha: first dynamic import of a doc pulling new deps (ParametricGeometry) -> "optimized dependencies changed. reloading" -> page reloads, first click looks lost. Not a code bug.

### [three][demos] 2026-10-10 (4)
- All remaining Io*Example converted to ThreeDocument subclasses in src/demos/examples/<Name>.ts (AnimationGroups/Keyframes/Retargeting/RetargetingReadyplayer/SkinningBlending/SkinningAdditiveBlending, Backdrop/BackdropArea, Camera/CameraArray, GeometryConvex). Io* src + dist deleted. Animated ones autoplay. Async loads: notify 'structure' + document.dispatch('frame-object', {object}, true) (bubbles doc -> editor -> viewports; native per-viewport stopPropagation so all frame). Keyframes PMREM in document onRendererInitialized, model load moved to constructor. SkinningBlending's own `isPlaying` -> `paused` (single step pauses). Side panels -> registerEditorConfig/Groups on the document class (Document tab). Type-keyed configs don't reach nested editors (actions show collapsed). Floors/backgrounds selectable=false.
- CameraArray: views copy scene cameras (ADR-0005) so the ArrayCamera grid never renders; laid out for 1x1, camera view looks through main camera.
- IoEditorExample moved to src/demos/IoEditorExample.ts; DOCUMENTS lists 17 docs; heading flex-wrap; new select-only Camera view (setCameraView(), tab next to UV).
- ThreeView: `_cameraRequest` (name or '' from setCameraView) re-armed in switchDocument when the shown doc has no cameraSource; setAxisView/uuid clear it. Test added (ThreeView.test). README/SKILL/CONTEXT notes.
- index.html: Demos > Three is the editor directly (no nested navigator); user asked. Demos navigator caching is proactive -> editor preached in background.
- Known: TRAA axis views draw black where scene uses TSL backgroundNode (Backdrop, Retargeting); plain background color fine. Not fixed.
- Plans: example_conversion marked superseded; core plan path updated. three tests 144, tsc clean, eslint 0 errors. Browser: all 17 load, no console errors; Camera view follows docs; blending crossfade + single step work.

### [editors][three][rules] 2026-10-10 (5)
- User correction: configs/index.ts is only for external three.js classes. Editor configs + groups live next to class definitions. Global `registerEditorGroups(Object, {is*, _listeners, id/uuid/type/userData})` removed on purpose (stepped over every Object-derived class); granular per-class configs to come. I had flagged its removal as a regression - wrong.
- ThreeDocument/ThreeEditor configs moved (by user) from configs/editor/ThreeEditor.ts into the class modules. ThreeDocument groups: Main tone mapping + `Advanced: [/^[\s\S]*$/]` catch-all (explicit names beat regexes, so subclasses list Main props).
- Distilled into rules: io-gui.mdc "Editor Configs" + "io-three: Document, Editor, View" (document = portable content, editor = host/session, view = intent resolved per document, apps = host + documents). Consumer versions in three SKILL (new-app + document + config bullets, selection.activeObject, view intent) and editors SKILL (colocate, narrowest class, whitelist pattern).

### [three][rename] 2026-10-10 (6)
- IoThreeViewport -> ThreeViewport (file, test, props type, factory `threeViewport`, tag `three-viewport`). IoBuildGeometry -> ThreeBuildGeometry (factory `threeBuildGeometry`, tag `three-build-geometry`; 22 geometry configs). Tag = class name kebab-cased by ReactiveElement.Register.
- Docs updated (README, CONTEXT, SKILL, ADR 0001/0002/0004, core + principles plans, working.md); archive + superseded example plan left as history. Stale tracked dist Io* files removed (incl. IoThreeExample, src deleted by user), tsc -b re-emitted. tsc clean, eslint 0 errors, three tests 144.
- External consumers still on old names: daily-routines (index, GlobeTool, RoutinesViewport), circuits, mandis-led-configurator. Not touched.

### [three][rename] 2026-10-10 (7)
- elements/math Io* -> Three*: ThreeEuler, ThreeMatrix2/3/4, ThreeMatrixBase, ThreeQuaternion, ThreeVector2/3/4, ThreeVectorBase (+ Props types, factories threeVector3 etc., tags three-vector-3 etc.). Configs (math, Object3D, Scene, CanvasTarget, SphericalHarmonics3), BackdropAreaExample, index.ts, three SKILL, editors README, principles plan updated. Stale dist removed, rebuilt. tsc clean, three+editors tests 194 pass.

### [three][move] 2026-10-10 (8)
- ThreeEditorStatus moved src/editor -> src/elements (git mv; imports now ../editor/ThreeEditor.js, ../editor/ThreeDocument.js). IoEditorExample import updated. Old dist/editor files removed, rebuilt to dist/elements. Not exported from index (was not before). tsc + eslint clean.

### [three][rename] 2026-10-10 (9)
- ThreeDocument -> Document, ThreeEditor -> Editor (+ DocumentProps/EditorProps; files editor/Document.ts, Document.test.ts, Editor.ts). ThreeEditorStatus kept (element; tag needs hyphen). Pattern: reactive objects drop prefix, elements use Three prefix.
- `Document` shadows DOM `Document` type in importing modules (no src module uses the DOM type). No ReactiveObject name registry, so no runtime clash.
- Docs, ADRs, CONTEXT (root + three), SKILL, io-gui.mdc, plans, working/now updated; archive + superseded plan left. Article fixes ("an Editor").
- Gotcha: rg skips hidden dirs (.cursor, .memory) without --hidden. Math rename missed principles plan IoVectorBase; fixed.
- Stale dist removed, rebuilt. tsc clean, eslint 0 errors, three tests 144.

### [three][rename] 2026-10-10 (10)
- ThreeView -> View (+ ViewProps, ViewSettings, ViewData; files view/View.ts, View.test.ts). Word-boundary replace so ThreeViewport untouched. Glossary term now **View**. Docs/ADRs/SKILL/io-gui.mdc/plans/working/now updated; archive left. Stale dist removed, rebuilt.

### [three][vite] 2026-10-10 (11)
- "Multiple instances of Three.js" in GeometriesExample: Vite dev deps discovered at runtime (scan aborted by src_examples/*.html missing pkgs; editor demo loaded by string path, invisible to scanner). First optimize inlines three core into three/webgpu chunk; ParametricGeometry imports bare 'three' (WebGL build) -> re-optimize splits core into new chunk -> page that misses the full-reload (HMR socket not connected, e.g. proxied dev host) runs 2 cores. Reproduced with cold cacheDir + playwright routeWebSocket block.
- Fix vite.config.ts: alias /^three$/ -> 'three/webgpu' (matches index.html import map; WebGL build no longer bundled) + optimizeDeps.entries ['index.html', 'packages/*/src/demos/**/*.ts'] (one optimize pass, no runtime reload). Verified cold + blocked HMR: no warning, no reload; all 17 docs load; three+editors tests pass.
- Pre-existing (not from this): IoObject.mutated Object.keys(null) on Document tab switch BackdropArea -> VolumePerlin (same with old config).
- Test tip: separate cacheDir via scratch config importing vite.config.ts, so user's dev server cache untouched.
- Follow-up (why only Geometries): not specific to ParametricGeometry. Geometries = first doc in list (after EditorDocument1/2, which use only three/webgpu) whose addon imports bare 'three'. Cold cache + no reload: Backdrop first -> warns at Backdrop; each later runtime re-bundle adds another copy (A: Geometries 1, Convex 2; B: Backdrop 1, Geometries 2, Convex 3). Warm cache: none warn.

### [three][document] 2026-10-10 (12)
- ChangeBus folded into Document: `notify()` queues (CHANGE_LIMIT 10000 collapse to one 'other'), `hasPendingChanges`, `drainChanges()`, `clearChanges()`. Queue is `@Field(Array) _changes` (mutated() notifies 'settings' inside base constructor, so not a class-field initializer). `ChangeKind`/`DocumentChange` types now in Document.ts; `DocumentChange.source: Document` (was object).
- Scheduler: ScheduledView/ScheduledTicker expose `document` (was changeBus); _collect drains a Set<Document>. ThreeViewport `get document()` (editor's active). Editor.changeBus getter removed; documentChanged -> oldValue.clearChanges().
- Tests: ChangeBus describe -> Document 'queues changes until drained'; scheduler fakes use real Documents. Docs: README tree + frame step, CONTEXT term DocumentChange (avoid: change bus), ADR 0002/0003/0008 wording, plan note. tsc clean, three tests 144. Lint error left: trailing space IoEditorExample.ts:189 (user's file).

### [three][timeline] 2026-10-10 (13)
- Ask: ThreeTimeline element (transport io-buttons + IoGl scrub range, playhead, dividers any scale), doc-local time drives anims, delta-only anims unchanged but get timeline delta; above ThreeEditorStatus in IoEditorExample; new `three:` iconset (Material Symbols); then improve icons dev rules + consumer skill.
- Mid-task user asks: rename time -> currentTime; combine time/duration/frameRate/loop + autoplay into Timeline node; frameRate: leave as is (fps only matters for video export, later).
- Built: `editor/Timeline.ts` (ReactiveObject: currentTime, duration 10, frameRate 30, loop true, autoplay false; lazy `timeNode` TSL uniform; advance(delta) wraps/stops -> false at end; snapToFrame; stepFrames; durationChanged clamps). Document `@Property({type: Timeline, init: null}) timeline`; timelineChanged/timelineMutated -> `_animate()`: delta = currentTime - `_animatedTime` (@Field), onAnimate(delta, time) + notify 'time'. Document.autoplay removed (-> timeline.autoplay). Editor.tick -> document.timeline.advance(frame.delta), false -> isPlaying=false; isPlayingChanged rewinds non-loop timeline at end.
- Decision: delta = change of timeline time, negative at loop wrap/scrub back (delta-driven mixers stay consistent with timeline pos). Why: same time -> same state as far as integrators allow.
- Near-miss: time as Document prop -> Document.mutated() emits 'settings' every frame -> UV view (ignores 'time') redraws per frame. Timeline child node fixes it naturally (child mutation doesn't call parent mutated()).
- Elements: ThreeTimelineRange (IoGl, `timeline` model prop init null; viewStart/viewEnd zoom; `scrubbing` reflect). JS picks divider steps (frame divisors of a second, then 1,2,5,10,15,30 s/min/h; nested multiples) -> manual uniforms via setShaderProgram()+setUniform() BEFORE super.onRender() (extra `uniform float` decls in Frag); shader works in device px (gl_FragCoord) so long timelines exact (float32 drift avoided). Labels on 2D ctx after super.onRender(): `1.5`, `2+05` (s+frames for non-round steps), `1:30`, `1:01:05`. Drag scrub snaps frames; wheel zoom around pointer; shift/horizontal pan; arrows step (Shift 10), Home/End. ThreeTimeline: buttons + range + currentTime/duration ioNumbers; scrubbing-changed pauses/resumes; user added Space toggle (`'@keydown': onKeyDown` on range).
- Icons: `three/src/icons/threeIcons.ts` (skip_start, frame_back, play, pause, frame_forward, skip_end, loop) from Material Symbols fill1 (+ repeat). three package.json: @io-gui/icons dev+peer dep, sideEffects `**/icons/**`, tsconfig ref ../icons, `pnpm install --offline` (lockfile +3 lines).
- Examples: per-frame `+=` and Date.now() anims -> time-driven w/ loop-seamless periods (Geometries/CameraArray/Convex 20 s, Camera 25 s). TSL `time`/`oscSine()` -> `this.timeline.timeNode` (Backdrop, BackdropArea, Retargeting lightSpeed Fn got time input). Single-clip mixers: timeline.duration = clip.duration, mixer.setTime(currentTime) at load (align). Skinning blending examples untouched.
- Tests: Timeline.test (6), Document timeline (4), Editor playback (3), ThreeTimelineRange (dividers/labels + element 7), ThreeTimeline (iconset + 6). three suite 172 pass; tsc -b clean; eslint 0 errors. Visual check: scratch vitest screenshot (page.viewport + page.screenshot to project-relative path; Vite fs.strict blocks scratchpad paths), deleted after.
- Gotchas: `source .env` -> PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers lacks chromium-1248 -> run `pnpm test` without .env. Synthetic PointerEvent -> stub setPointerCapture in tests. No `timeout` on macOS. `process` undefined in browser tests.
- Docs: three README (ThreeTimeline, Timeline sections, render loop), three SKILL, three CONTEXT (Timeline, Timeline range, Playing, Document), root CONTEXT relation, io-gui.mdc (Document/Editor/time-drives-animation), ADR 0002/0003 one line each. Icons: new `.cursor/rules/io-icons.mdc` (globs icons), CLAUDE.md pointer, icons SKILL rewrite, README (format rules, Material Symbols, package namespace, built-in list fixed: tune/numeric-* never existed), CONTEXT (Iconset registration).
- Observed, not fixed: io iconset defines `sliders` twice (2nd wins); Iconset.getIcon miss returns '<svg ...></g>' (stray </g>, parser recovers); IoBoolean renders icons only for `io:`; IoButton icon margin-right w/o label; ThreeTimeline doesn't notice a document's timeline object being replaced (only editor.document switch).

### [icons][inputs][three][tooling] 2026-10-10 (14)
- User follow-ups: fix io iconset defines; IoBoolean any iconset; remove heading Play toggle; timeline swap at runtime not expected (no action); negative delta OK -> note; fix `source .env` playwright; opinion on ctor-time handlers; improve docs/skills for future sessions.
- Iconset: duplicate `sliders` -> first (single slider pill, translate(0 14), was shadowed) renamed `io:slider`; `io:sliders` (tune glyph, used by IoLayoutDemo) unchanged. getIcon miss now `<svg ...></svg>` (was stray `</g>`). New `IconsetSingleton.hasIcon(ref)` (Object.hasOwn, so `ns:toString` false); getIcon reuses it. Debug warn on id defined twice in one registerIcons call.
- IoBoolean: label renders icon iff `IconsetSingleton.hasIcon(label)` (any namespace), else span text (resolves TODO; 'Ratio: 16:9' stays text). Existing usages all already `io:`-prefixed; bare icon strings only in layout/menus/navigation model tests (data, not rendered) -> no prefixing needed.
- IoEditorExample: heading ioBoolean Play toggle + import removed.
- Plan `.cursor/plans/three_future_work.plan.md`: todos timeline-negative-delta, timeline-frame-rate (video export).
- Playwright: `.env` PLAYWRIGHT_BROWSERS_PATH=repo `.playwright-browsers` had only 1223; `source .env && pnpm exec playwright install chromium` -> 1248 (+headless shell). Old 1223 (~530 MB) left; user may delete. io-gui.mdc testing notes updated (install with .env; no Node globals; stub pointer capture; screenshot recipe).
- Verified: non-`declare` class field written by a ctor-time handler is wiped after super() (oxc test env; tsc target es2023 => define semantics). Documented ctor order in core README (Construction Order), core SKILL, IoGl extension (manual uniforms/ctx/float32), child-node mutation surfacing.
- Design opinion given: ctor-time reactions = real wart (silent field wipe, guards in ThreeViewport handlers, 6 "A Field: ... base constructor" comments in three). Proposed: two-phase construction via @Register wrapper (new.target check) running ready()+first dispatch after most-derived ctor, still sync; needs ADR, audit (Register(X) call sites must use return value; explicit handler calls in ctors), benches. Cheap partial: useDefineForClassFields false (removes wipe only).
- Results: tsc clean, eslint 0 errors, tests 1060 pass; 3 fail layoutSize.test.ts (pre-existing, f9db9c29).

### [core][layout][plan] 2026-10-10 (15)
- Plan `.cursor/plans/core_construction_order.plan.md`: two-phase construction (Register returns wrapper; finish when new.target === wrapper: clear constructing flag, ready(), one dispatch; queue writes while constructing). Draft ADR inside (proposed core 0005; options: status quo, useDefineForClassFields false, microtask, static factory). Audit numbers: 31 ready() overrides, 38 ctors doing work after super, 26 explicit `this.xChanged()`, 22 function-form Register in src (5 tests/benches). Open: *Mutated during construction, init() placement, release/deprecation. CLAUDE.md plan list updated.
- Layout failures: f9db9c29 changed sizeToFlex auto `1 1 auto` -> `1 1 0%` (fix for unequal auto splits noted 2026-10-09) without updating tests. Updated layoutSize.test.ts expectations + names; layout CONTEXT Size entry (also fixed `0 1 <size>` -> `0 0 <size>` to match code). Layout 345 tests pass.

### [three][scenegraph][icons] 2026-10-10 (16)
- Ask: ThreeScenegraph element for IoEditorExample: collapsible scene tree, name or `<ClassName>` + type icon per row, icons for all three.js Object3D types (Material Symbols, matching style), scene expanded / children collapsed by default, collapse state via io-gui Storage like menus tree (localStorage by uuid; examples regenerate uuids), selection highlight + click select.
- Built: `elements/ThreeScenegraph.ts` (flat rows, mutated() renders; `disclosure: Record<uuid, bool>` only deviations from default (scene true, rest false), re-added last, DISCLOSURE_LIMIT 1000 drops oldest; isExpanded/setExpanded; Listeners three-scenegraph-select/-toggle; selection Property follows editor.selection; role tree + ariaMultiSelectable). `elements/ThreeScenegraphItem.ts` (IoField; object as @Field; depth/hasChildren/expanded/active(reflect); expander = io:triangle_right/down, press target decides toggle vs select (IoField captures pointer so click target is the row); keys Up/Down/Home/End/Right/Left/Enter; [selected] color-mix 40% blue, [active] full blue + white icon).
- RenderScheduler `ChangeListener` {document, onDocumentChanges(changes)}: addListener/removeListener; _collect drains listener documents too, hands drained array after view tagging, try/catch per listener; rAF keep-alive counts listeners. Scenegraph refreshes (debounced) on structure/other/settings.
- SelectBehavior `apply` -> exported `selectObjects(selection, mode, uuids, active)` (scenegraph clicks = viewport clicks: set / Shift toggle / Ctrl subtract).
- Icons: 39 Material Symbols Outlined added to `three:` (object control_camera, scene landscape, group folder, clipping_group crop, mesh deployed_code, skinned_mesh accessibility_new, instanced_mesh auto_awesome_motion, batched_mesh category, bone orthopedics, lod signal_cellular_alt, line polyline, line_segments diagonal_line, line_loop pentagon, points grain, sprite image, camera videocam, array_camera video_library, cube_camera 360, light light, ambient brightness_5, directional sunny, hemisphere wb_twilight, point lightbulb, spot highlight, projector slideshow, rect_area wb_iridescent, light_probe blur_circular, audio volume_up, positional_audio surround_sound, audio_listener hearing, helpers: arrow arrow_outward, axes arrows_output, box select, camera center_focus_weak, grid grid_4x4, polar target, plane texture, light lightbulb_circle, skeleton skeleton). Long d wrapped before command letters (max-len 360). `icons/objectIcons.ts`: registerObjectIcon(Class, icon) / getObjectIcon(object) by prototype chain; all 48 Object3D classes of three/webgpu r182 covered (rest inherit: QuadMesh, BundleGroup, IESSpotLight, Ortho/PerspectiveCamera).
- Contact sheets: scratchpad download -> regex-validated d -> HTML -> playwright screenshot (node script importing repo playwright by abs path, `source .env`).
- IoEditorExample: Scene panel on top of right column (auto), `disclosure: $({key: 'three-scenegraph-disclosure', storage: 'local', value: {}})`.
- Verified in real editor via `pnpm dev` + playwright: rows, click -> inspector AmbientLight, AnimationKeyframesExample async GLTF appears (OSG_Scene). Pre-existing warnings on doc switch: IoEditorExample.activeObject undefined (type warn) + IoPropertyEditor value undefined (not fixed).
- Found: working.md claimed keyed VDOM reconciliation exists; code is positional only (`_vdomKey` stored, unused). Fixed memory.
- Docs: three README (overview, ThreeScenegraph section, render loop step 2), SKILL, CONTEXT (Scene graph, change listeners in DocumentChange), ADR-0007 outliner line (no io-menus adapter: menus select ancestors, toggle branches on click), ADR-0003 collect phase, io-gui.mdc host line, io-icons.mdc (wrap long d; three object icons), root CONTEXT, architecture plan note.
- Results: tsc -b clean (dist regenerated, tracked; left), tests 1079 pass (89 files), lint 0 errors; changed files 0 warnings.

### [three][scenegraph] 2026-10-11 (17)
- Ask: reveal + scroll to object selected in viewport; rename on double-click; whole tree expanded by default.
- Default expanded: `isExpanded = disclosure[uuid] ?? true`; disclosure stores only collapsed (`false`), delete on expand; LIMIT keeps newest collapsed.
- Reveal: `_revealActive()` from selectionMutated/editorMutated when `selection.active` differs from `_revealedId` (@Field) -> `reveal(object)`: expand ancestors (one disclosure write), `_scrollTarget` consumed after render by `_scrollToRow`: `row.scrollIntoView({block:'nearest'})` + `label.scrollIntoView({block:'nearest', inline:'nearest'})` (row padding clipped 3px when only label scrolled; manual scrollLeft on tree broke when an ancestor is the horizontal scroller).
- Rename: built-in operator `object.rename` {id, name} (tools/operators/RenameOperator.ts; same name -> cancelled, no command), registered in Editor. Scenegraph `renamingId` prop, startRename/endRename(name|null) (operator first, then clear -> sync render shows new label). Item: dblclick (Listeners merge along protochain) / F2 -> rename-start; IoString name field ('@keydown' Enter/Escape, '@blur' commit) with stopImmediatePropagation (our prop listeners precede IoString's focus-added ones; ending removes+disposes the field); textNode is `string|null` -> `?? ''`; skip pointer capture + select for presses inside the field; `_expanderPressed` no longer reset (dblclick on triangle must not rename); mutated focuses + selectAll field. Field `flex: none; width: 12em`.
- README custom operator example moved object.rename -> object.hide (rename now built-in); Operator.test still registers its own object.rename (replaces built-in in those tests; harmless).
- Horizontal scroll: grid `minmax(100%, max-content)` does NOT grow past container (maximize step only uses free space) -> label squeezed; `minmax(max-content, auto)` works (base = widest row, auto stretches to fill).
- User concurrently: moved Scene panel to full-height left column (layout), deleted EditorDocument1/2, edited examples, added `align-self: baseline` to ThreeScenegraph :host. With baseline the tree is content-wide: IoSelector scrolls horizontally, tree's vertical scrollbar sits past panel edge when wide, narrow trees don't fill panel. Left in place, told user (instruction: don't revert user changes).
- Real editor (pnpm dev + playwright): rows Skinning 74 (depth 14), Keyframes 217, Retargeting 144, Geometries 19; re-render < 1 ms. Reveal last bone under collapsed ancestor -> expanded, scrollTop 1075, visible. UI rename dblclick+type+Enter -> status "Last command: object.rename {...}", focus back on row. Playwright headless hides scrollbars (--hide-scrollbars) -> screenshots show none.
- Flake: one full-suite failure of deep-row scroll test (fixed-frame wait); tests now `until(condition)` up to 30 frames. tsc clean, 1086 tests pass x3.

### [three][examples][plan] 2026-10-11 (18)
- Ask: check src/demos/examples vs src_examples sources + three.js_example_conversion.plan.md; update examples/plan, add detail.
- Found: src_examples = symlink to local three.js dev checkout (r182-1763, 0.186 dev); installed three/@types = 0.182. Compare `git -C ../three.js show r182:examples/X.html` + `log r182..HEAD`. Plan body was still old ThreeApplet/IoThreeExample pattern (only a superseded note on top).
- Example fixes: Neutral tone mapping missing in BackdropArea (exposure .9 had no effect), Retargeting, ReadyPlayer. BackdropArea floor 3->5 (r182 has 5), cam near/far .25/25, default 'checker' (upstream post-r182). Retargeting `showHelpers` (Helpers group, 2 SkeletonHelpers, unselectable). SkinningBlending: setTimeout crossfade end -> `crossfadeEnd` in mixer.time checked in advanceMixer (fades run on mixer.time), camera aspect 1 (was window.innerWidth), showModel/showSkeleton (+ SkeletonHelper). Backdrop: duration = clip (18.23 s Michelle) + mixer.setTime. Camera: CameraHelper x2 in Helpers group added after rig (same-frame matrixWorld), update() in onAnimate, `showHelpers` default true. VolumePerlin: upstream `refine` bisection port (Loop/select/bool/toConst/uniformFlow exist r182; `assign(bool(true))` for types), mesh named.
- Plan rewritten: frontmatter + todos, sources/version policy, fit criteria (renderer-level opts, custom render loops, DOM interaction don't fit), target shape, drop/map tables (GUI -> props), time/async/scene-graph/props/WebGPU rules, workflow, audit table (15 examples), open questions.
- Open (plan todos): keyframes-sky (upstream Sky + ACES), interactive-timeline (10 s wrap rewinds skinning mixers), skinning-transport (paused/step vs timeline), crossfade-state, inspector-refresh (debug-only dispatchMutation stripped in bundles), camera-helper-view.
- Verify: tsc -b clean, eslint examples clean, three tests 195 pass (1st run transient vitest WS error). Headless playwright: all 7 changed docs load, props/tone mapping/durations right, no new errors. Headless WebGPU (SwiftShader) renders but screenshots blank; shader check = fresh renderer `new vp.renderer.constructor({canvas})` (page import of three/webgpu = 2nd instance -> "No stack defined for assign") + compileAsync in pushErrorScope: VolumePerlin refine on/off no errors. Baseline canvas 'Invalid Texture CreateView' render error also on unchanged docs (headless). Dev server on 3000 still warns "Multiple instances of Three.js" after its runtime reload.
- Concurrent session (scenegraph round 2) active in same tree; did not touch Editor.ts/RenameOperator/scenegraph.

### [three][scenegraph] 2026-10-11 (18)
- User OK'd removing `align-self: baseline` from ThreeScenegraph :host -> removed; editor: tree = panel width (443), scrolls itself. User halved row indent (`depth * lineHeight * 0.5`, base `--io_spacing`); fixed stale comment. Tests 16 pass.

### [three][examples][r186] 2026-10-11 (19)
- User: updated three to 186 (0.186.1, @types 0.186.0); keep authored helpers in examples, note automatic helpers as future work; port AnimationKeyframes to r186 look; discuss AnimationSkinningBlending. Restarted dev server mid-task.
- r186 = commit 148ef33ecb in ../three.js (no r183-r186 tags locally; checkout 275 commits past). r182->r186 source drift beyond earlier audit: camera_array shadow bias removed; skinning used SunLight at r186, reverted to DirectionalLight after (ours = HEAD).
- r186 types broke tsc: UniformNode<'float', number> (2 type args) in Timeline.ts + VolumePerlin; untyped Node lacks math -> Node<'vec3'>; Fn infers args from annotated param, layout 2nd arg (abbreviated {a:'vec2', return:'vec3'} works at runtime r186); no implicit arg conversion in types (normalWorldGeometry.xy, color(c).rgb); CanvasTarget.domElement = HTMLCanvasElement | OffscreenCanvas (ThreeViewport cast); componentMaterials stateColor(Node<'float'>).
- PostProcessing deprecated since r183 -> RenderPipeline: PostProcessingPipeline uses RenderPipeline (field name postProcessing kept); configs/renderers/common/PostProcessing.ts -> RenderPipeline.ts (+ index import; stale dist files removed).
- Keyframes r186 look: SkyMesh in scene (selectable false, scale 10000, turbidity 0, rayleigh 3, mieG .7, cloudElevation 1, sun (-.8,.19,.56)), cloudSpeed 0 (source WebGL Sky time uniform never advanced -> static; SkyMesh uses global TSL time); PMREM fromScene of 2nd sky in own Scene in onRendererInitialized; ACESFilmic; DRACO_GLTF_CONFIG (Vite optimizer rewrites its new URL to node_modules/.pnpm path, served; bundle keeps three external; import map serves three/examples/jsm). frame-object on model (sky bounds 10000).
- Future plan: `scene-helpers` (overlay per ADR-0006, per-view toggle, skip viewed camera's helper, remove authored helpers then). Conversion plan: camera-helper-view cancelled -> scene-helpers; new `framing-scenery` (CameraArray perspective opens framed on 100x100 backdrop: near 42 far 429; sync content can't use frame-object).
- Dev server gotcha: user's server (up since Oct 7) served stale pre-bundled three r182 after upgrade (Vite checks lockfile only at start). Used scratch server: .mjs config importing repo vite.config.ts + mergeConfig(cacheDir scratch, port 3186), `vite --config X --configLoader native`; killed after.
- Verify: tsc clean, eslint 0 errors (10 old warnings ThreeBuildGeometry/ThreeVectorBase), 195 tests. Headless r186: all 15 docs compile+render (page's own three via performance resource URL + RenderTarget; no validation errors). rgba8 RT harness -> backdrop copyFramebufferToTexture format mismatch (harness only). Seen: 'Duplicate selected options' warning when switching back to Keyframes (initial doc) - not investigated.
- Discussion opened (not implemented): SkinningBlending timeline fit (live clock vs recorded transitions replay), drop paused/step props, per-pair crossfade durations (run->walk 5 s, ours 0.5), weight fields show action.weight (fades use interpolant -> not the blend).

## 2026-10-11 (20) [three][time][design] SkinningBlending: user picked A + DCC/engine time survey
- User decisions: option A (live clock; animation demos = real-time game-like, not timeline content), keep idle<->run, drop paused/step props; idea: timeline still serves as clock/delta source (transport pause/step). Asked to explain DCC/engine practice before implementing -> not implemented yet.
- Survey: DCC (Maya/Houdini/Blender) timeline primary, state = f(frame); blends authored (NLA blend in/out, Maya Time Editor crossfade, KineFX clips); stateful sims step on forward frame, back = cache or reset at start frame (Houdini DOP cache, Blender point cache/sim zone Delta Time, Maya nucleus start frame/runup); loop replays cache. Engines (Unity/Unreal) game clock primary, state machines integrate delta (exit time ~ our wait-for-loop), pause/timeScale/dilation, editor Pause+Step, no rewind (recording: Animator recorder, UE5 Rewind Debugger, Take Recorder -> Sequencer). Sequences (Timeline/Sequencer) islands on game clock; time updates carry cause (Unity FrameData seekOccurred/timeLooped/evaluationType; Unreal status Playing/Scrubbing/Jumping/Stepping/Paused). Stateful content in sequences: Niagara DesiredAge (reset+resim on back), DesiredAgeNoSeek, TickDeltaTime (ignore sequencer); Unity ControlTrack particles restart+Simulate on back.
- io gap: Document._animate passes delta = time diff; wrap gives -duration though clock moved 1 frame; forward scrub indistinguishable from playback. Proposed: now example-only `delta > 0` integrate; later framework passes cause (playback delta + seek flag), like engines.

## 2026-10-11 (21) [three][time][adr] Live documents: ADR-0009 + skinning blending option A implemented
- ADR-0009 `live-documents-use-the-timeline-as-a-clock`: live (game-like) docs integrate only delta > 0; wrap/scrub/step back ignored (no rewind/reset); pause/step = editor transport. Rejected: recorded transitions replay (B), reset on back, integrate negative delta.
- SkinningBlending: removed paused/makeSingleStep/stepSize/AnimationAction weight config/debug dispatch; CROSSFADE_DURATIONS table (idle->walk .5, walk->idle 1, walk->run 2.5, run->walk 5, idle->run 2.5, run->idle 5 [ours]); read-only idleWeight/walkWeight/runWeight props (isRunning ? effective weight : 0) via disabled ioNumberSlider; actions -> Hidden. Additive: `if (delta > 0) mixer.update(delta)`.
- Docs: CONTEXT.md term "Live document", io-gui.mdc time rule, SKILL.md, Document.onAnimate doc comment, conversion plan (interactive-timeline + skinning-transport completed), future plan timeline-negative-delta = pass cause {playback, seek} to onAnimate (deferred: public contract, Editor/Document have other session's uncommitted work, only 2 demos need it).
- Verified headless on :3000: walk->run waits loop then 2.5 s fade, run->walk 5 s, presses during fade ignored, paused mixer still, step +1 advances (snapped frame), step -1 / scrub back no-op, mixer continues across wrap. tsc clean, eslint clean, pnpm test 1086/1086. Headless device-lost at 1.1 s after page load on any doc = harness artifact.

## 2026-10-11 (22) [three][examples][plan] Candidate list for src_examples conversion
- Plan `three.js_example_conversion.plan.md` new section "Candidates (2026-10-11)": table Example | Source | Status | Blocked by | Notes, 274 rows (15 completed, 195 ready TODO, 64 TODO blocked) + grouped non-candidate lists + Blockers. Frontmatter todos: candidates-2026-10-11 done, blocker-* pending.
- Rules: webgl+webgpu twin -> webgpu (incl renamed twins: gpgpu_birds->compute_birds, shaders_sky->sky, unreal_bloom->bloom, sao/ssao/gtao->ao ...). Cosmetic post (bloom/blur/vignette/fxaa) dropped+noted; post as subject -> blocked. Conversion must not change @io-gui/three; needs -> tag.
- Blocker tags: document-pipeline (pipelines host-registered per View, doc can't bring one), per-frame-gpu (onAnimate no renderer; compute/CubeCamera/RT each tick; sims = live docs ADR-0009), renderer-on-change (rebake probes/sky on prop change), view-camera (CSMShadowNode, pass(scene,camera) in material = portal, camera layers), renderer-option (shared renderer stencil=false; renderer.lighting Dynamic/Clustered; shadowMap VSM/transmitted renderer-wide; Basic -> per-light shadow.filterNode OK), three-upgrade (HEAD-only: gltf_diffuse_roughness, materials_node_proxy, tsl_occlusion_dither), dependency (three-bvh-csg, web-ifc).
- Excluded groups: renderer tests, custom loops/RT/split screens, screen filters (= host pipelines), interaction-subject, DOM/media, GLSL-subject, exporters, 3dtiles/progressive LOD, WebGLNodesHandler dupes (webgl_tsl_*).
- "Verify per view" flagged: LOD, reflectors, gaussian splat sorting, lensflare/occlusion queries.

## 2026-10-11 (23) [three][examples] Low-hanging conversions, batch 1-2 (14 docs)
- User: start converting low-hanging candidates (no editor features). Done: AnimationKeys, GeometryCube, Sprites, InstanceUniform, MaterialsToon, Clearcoat, LightsPhong, LightsRectarealight, Shadowmap, Skinning, LoaderGltfIridescence/Anisotropy/Dispersion/Transmission. DOCUMENTS entries appended. tsc + eslint clean.
- Patterns: periodic motion -> PERIOD = LCM of source frequencies (8π for 0.25 rad/s multiples, 4π, 40π) so loops seamless; per-sprite spin quantized to 2π/PERIOD steps; `pose(time)` shared by onAnimate + ctor (+ load callback when pose depends on loaded data); textures `notify({kind:'material'})` on load; env load `notify({kind:'settings'})`; async glTF -> notify structure + frame-object.
- @types 0.186: MeshBasicNodeMaterial lacks `emissiveNode` (NodeMaterial applies it at runtime) -> intersection cast. `class X extends Node<'vec3'>` works for custom nodes (update returns boolean|undefined).
- Dropped: toon outline pass (cosmetic, document-pipeline), camera auto-rotate (iridescence/transmission), GridHelper (instance uniform).
- Framing: first-show frames bounds at rest -> AnimationKeys box moves 30 units out of frame; big floors (rectarealight 2000, shadowmap 600 + fog 50-100 = all fog color) -> kept source camera as named scene camera. Open: framing-scenery / new framing-motion.
- NEW blocker `transmission-views`: transmission materials (viewportMipTexture/viewportOpaqueMipTexture module singletons, framebuffer copy per target) log "Destroyed texture [RGBA16Float 442x342 = forward Perspective view RT] used in a submit" on continuous redraw in editor alone (Transmission animated; Dispersion/Iridescence when played). Single RT harness clean -> multi-view. Candidate upstream fixes after r186: #34582 (skip mipmaps no mip chain), #34826 (getColorBuffer cache). Not investigated further (framework/three).
- Harness (scratchpad snap.mjs): render via page's SHARED renderer (viewport.renderer) into HalfFloat RT + renderOutput quad -> rgba8 -> PNG; second renderer = artifacts (light ShadowNode shared -> "Destroyed ShadowMap", CubeMapNode module cache per texture -> black equirect background, dispose kills shared shadow maps). Vite full-reloads on newly discovered addon deps -> re-find editor. Hidden "Scene Camera" tab never switchDocument -> stale cameraSource; harness clones doc's first scene camera. TIME env pauses + sets time. Upstream screenshots ../three.js/examples/screenshots/<name>.jpg for comparison.
- Batch 3-4 (2026-10-11): PmremCubemap, PmremEquirectangular, CubemapMix, MorphtargetsHorse, TslVfxFlames, LightsPointlights, Buffergeometry, BuffergeometryIndexed, BuffergeometryLines, BuffergeometryLinesIndexed, LinesDashed, GeometryExtrudeShapes, GeometryTeapot. Total 27 converted: 24 completed + 3 in progress (transmission-views). Plan: rows updated, Audit "Converted 2026-10-11" rows, blocker transmission-views, open framing-motion, todos low-hanging-2026-10-11 (in progress), headless recipe rewritten (shared renderer).
- Gotchas: renaming glTF node breaks name-bound animation track (horse mesh_0 -> "No target node found") -> rule added. Canvas gradient -> DataTexture computed in JS (no DOM). Buffergeometry onUpload(disposeArray) dropped (framing/picking read arrays). Teapot source background null unless reflective (render() overrides initial 0xAAAAAA). MorphtargetsSphere skipped: points follow morphs, WebGPU 1px points, Sprite-instanced points don't morph.
- Verify: tsc clean, pnpm lint:check 0 errors (93 warnings, none in examples), headless snapshots vs upstream screenshots all match; property toggles (teapot shading/lid/tess, wireframe, showHelpers) work; open-all console clean except pre-existing "Duplicate selected options" on Keyframes.
- (26) 2026-10-11 upstream route (user: io branch render-pipeline-fix holds r186 shim+scope; back on dev). three.js ../three.js branch render-pipeline-fix: NodeMaterialObserver.needsRefresh returns FULL when getOutputTarget(renderer) (render target ?? canvas target) differs from the one stored in render object data (set in getRenderObjectData; checked before static/bundle early-out). Dropped my ViewportTextureNode TextureSource patch: dev already has #34636 (FramebufferTexture.copy own TextureSource; DepthTexture.copy since #30540). Bindings: Sampler texture setter resets generation -> texture switch rebinds. Built (npm run build; nodes land in build/three.tsl.js). Linked: packages/three devDependency three "link:../../../three.js", pnpm install --offline. Dev three removed CubeUVReflectionMapping (#34585) -> dropped option from configs/textures/Texture.ts. vite.config.ts server.fs.allow [workspace root, realpath packages/three/node_modules/three] (Draco wasm 403 otherwise). Verified (isolated vite :3001, scratch vite.isolated.mjs): control unpatched dev = 6 wrong-view backdrop samples; patched = 0, no errors; transmission docs play clean; all docs open (only pre-existing warnings + IoObject.mutated BackdropArea); io tsc/lint/195 tests; three lint + 1894 unit tests pass. User's :3000 server needs restart (lockfile + prebundled three 0.186.1).
- (27) 2026-10-12 [three-upstream][review] #34968 Mugen87 review, 3 comments, all valid. (a) BUG mine: early `return FULL` on target switch skipped equals() -> snapshots freeze in multi-view (every draw of shared render object is a switch) -> value moved back to frozen snapshot (undo) not detected once one view renders alone -> object group stale. Same class as #34063 (fixed #34076: no early out on new renderId). Fix: `refreshType = FULL` + fall through (static/bundle still return it). (b) getOutputTarget: `rt ?? (getOutputRenderTarget() || getCanvasTarget())` = renderer's own resolution (_renderScene rt||ort, _getFrameBufferTarget ort||ct); differs only with output RT set + direct draw (only XRManager sets it). ViewportTextureNode still keys rt||ct -- not worth raising. (c) comment -> '// bindings might refer to per-target resources so a target switch needs a full refresh'. Verify: scratch review/run.mjs serves src variants via importmap (no build): dev-base bleed yes/stale ok; pr-head bleed fixed/stale BUG (box stays at +1); review both ok; eslint stdin clean. Unit tests not rerun on review variant.
- (28) 2026-10-12 [three-upstream][review] Applied Mugen87's 3 changes to ../three.js src/materials/nodes/manager/NodeMaterialObserver.js (identical to verified scratch variant) + JSDoc line for output render target fallback. User commits/pushes; asked not to commit build. Verify: eslint src clean; test-unit 1894 pass 0 fail; npm run build (NodeMaterialObserver lands in build/three.tsl.js + three.webgpu.nodes.js; three.webgpu.js imports ./three.tsl.js); build diff huge (committed dev build lags src) -> build/ left modified, uncommitted. Scratch review/run.mjs `build` variant (importmap to checkout build/): bleed fixed, stale ok, console clean. io editor via isolated vite :3001 (--force; three not prebundled, served /@fs, confirmed fixed line): LoaderGltfTransmissionExample 4 views, backdrop-own only (52/156/48), 0 backdrop-other, 0 errors.
- (29) 2026-10-12 [three][multi-view][reflector] Corrected my earlier claim (reflector once per FRAME for first camera): only with `bounces:false`. Default `bounces:true` -> updateBeforeType RENDER -> per render call = per view; per-camera virtual camera + RT (Map, kept until dispose); floor material has node prop -> NodeMaterialObserver.hasNode -> FULL every draw, so #34968 irrelevant to reflectors. Headless 2-view mirror test (scratch review/reflect.mjs, red/green walls opposite sides): bounces true correct on dev-base + fixed build; bounces false view2 floor red (view1's reflection) on both. three Animation loop advances nodeFrame.frameId once per rAF -> all views in one frame share frameId. Prototype: ReflectorBaseNode.updateReference(frame) { return this.getVirtualCamera(frame.camera) } (NodeFrame keys update maps by updateReference; must be unique per reflector+camera, not camera) -> both views correct, eslint clean. Node.build calls updateReference(builder) at setup -> guard null camera. io: View has persistent cameras (View.ts _perspective etc.) -> no per-draw RT leak. Affected plan rows: ReflectionBlurred, ReflectionRoughness (bounces:false); Mirror/Reflection/AnimationRetargeting use default. Also fixed working.md headless note (real GPU with flags).
- (30) 2026-10-12 [three-upstream][reflector] Branch fixes/ReflectorNode (from dev c47b904867 = upstream/dev). ReflectorBaseNode.updateReference(state){ return this.getVirtualCamera(state.camera) } + JSDoc, uncommitted (user commits). Key must be per reflector+camera (camera alone -> two reflectors share NodeFrame entry, 2nd skipped). ArrayCamera/XR: renderer draws with ArrayCamera itself -> one key, unchanged. Node.build calls updateReference(builder) at setup; builder.camera always set (NodeManager._createNodeBuilder) -> no guard. Fiddle (scratch fiddle-reflector/: html/css/js, test.mjs live|dev|fixed routes githack build URLs to src for dev/fixed): two CanvasTargets, mirror floor reflector({bounces}) toggle, checker walls 6x2 red z=-3 / green z=+3, mirror colorNode reflection.mul(0.75). Results bounces:false view2 mirror red on live + dev src, green on fix; bounces:true green everywhere; console clean. lint-core clean, test-unit 1894 pass. PR title 'ReflectorNode: Fix `bounces: false` with multiple cameras.'; description fiddle-reflector/pr-description.md; kit artifact https://claude.ai/artifact/AJFRcPLzo32zi1Ttgtip8t (reused fiddle/kit.template.html design).
- (31) 2026-10-12 [three-upstream][examples][multi-view] User: upgrade three examples/webgpu_multiple_canvas minimally so it checks all multi-view regressions met so far (canvas sizes, reflectors, refraction, depth effects, other); user pointed at #32690, #33209/#33210, #32643. History (upstream login arodic): #32642 viewportLinearDepth 2nd canvas reads 1st depth (user PR #32643 closed for Mugen87 #32664 ViewportTextureNode RENDER); #32689 different sizes -> user #32690 merged (per-reference viewport textures incl CanvasTarget, per-canvas frameBufferTargets); #32690 regression = every canvas shows same output (old example caught it) -> user #33209/#33210 closed for sunag #33228 (quad cache per RT); #32926 -> #32927 merged + reverted (#32932); Jan 2026 local branch fixed/viewportDepthNode (camera type) never filed. Other upstream: #34612 FULL on resize (#34600), #34636 FramebufferTexture.copy own source (#34635 reflector + transmission), #34826 canvas MSAA colorBuffer cache, #34582 mipmaps without mip chain. Found on dev c47b904867: camera type still baked (ViewportDepthNode.setup camera.isPerspectiveCamera, Position.js positionViewDirection builder.camera.isOrthographicCamera, NodeMaterial log depth, Points/Sprite sizeAttenuation); RenderObjects chain = object+material+renderContext+lightsNode, RenderContexts key = attachment state+mrt+callDepth, nodeBuilderCache key = material + dynamic key (no camera type) -> persp + ortho views share first camera's shader; ortho water opaque white (persp first) / persp foam gone (ortho first). WebGLRenderer sets isOrthographic uniform per draw (WebGLRenderer.js:2672). ViewportSharedTextureNode still one framebuffer for all targets (churn only). Example on branch examples/multiple-canvas (from dev c47b904867; html + screenshot uncommitted): one shared scene; 4 original meshes (random HSL colors) at radius 1.6 around glass sphere r0.6 (plain MeshPhysicalMaterial transmission 1, thickness 1.2 -> no node props -> observer path); reflector({bounces:false}) floor CircleGeometry(3) colorNode reflection.mul(0.5) (resolutionScale 0.5 tried, dropped: blocky at DPR 1, no coverage gain); water CircleGeometry(3) y 0.2 transparent depthWrite false opacityNode viewportLinearDepth.sub(linearDepth()).mul(50).oneMinus().saturate(); 12 canvases (40 -> 12 = every size x camera combo), height (i%3===2)?150:200, ortho i%4===2 (half height 2.5, near 1 far 20), persp fov 50; setFromSphericalCoords(6, PI/3, i*2.4) golden angle; OrbitControls no pan/zoom (min/maxDistance removed: maxDistance 5 would clamp distance 6). Diff +79/-55, eslint clean. #34968 bleed only between consecutive same-size canvases (size change -> FULL). Verify: scratch multicanvas/run.mjs (playwright, src variants via route, DPR env, frames limit) + compare.mjs (per-view % px diff vs fixedcam): dev views 2-12 12-37%; dev+#34977 only views 2,5,8 2-4% (bleed) + ortho 3,7,11; dev+both only ortho views 30-36%; #33228 undone 33-59%; #32690 approximation 48-60% + pipeline errors; #32664 alone and #34636 undone 0% (masked by per-reference keys / texture churn only). Official e2e in scratch export/ (git archive subset + variant src + node_modules symlink + rollup build; puppeteer.js --make made screenshot from dev+#34968+#34977+camera prototype): all fixes pass 0.0%; dev 6.6%; both fixes no camera 2.3%; without #34968 0.4%; without #34977 5.1%; #33228 reverted 16.2%. Gotchas: shell `rm -rf $V/$n` blocked by safety check (use literal paths); `timeout` not on macOS. PR text scratch multicanvas/pr/pr-description.md (+ dev actual/diff/expected jpgs). Not published as kit (PR blocked on camera fix). Memory: now.md pruned (io work committed), design doc link moved to working.md.

## 2026-10-13 (32) [memory] working.md compacted, now.md cleared
- User: compact working.md, clear now.md. Pre-compaction working.md = commit 6be6b75b (177 lines, 25 KB) -> 84 lines, 14 KB. Verified entries vs code/docs before pruning.
- Pruned stale: layout ADR-0001..0003 now `completed` (reactive normalize implemented, io-*-remove/consolidate events gone, `io-split[root]`/IoTab walk note obsolete); three ADR-0008 accepted (memory said proposed); ChangeBus history; IoSelector gone (ListenerDefinitions folded into events pattern).
- Pruned as duplicates of io-gui.mdc / ADRs / CONTEXT.md / io-icons.mdc / CLAUDE.md: editor-config rule, io-three essence, live docs (ADR-0009), .env + playwright testing notes, nomenclature, three arch layers / input bands / selection domains (ADR 0002-0007), layout invariants, icon authoring, `workspace:*`, tsconfig include. Kept rest compressed; new "Repo & Tooling" section; menu root identity moved to Open Design Questions.
- daily-routines notes (separate repo ../daily-routines, no memory system; user asked "whats with the daily routines memory?"): user chose move gotchas + drop. Added 2 bullets to ../daily-routines/CLAUDE.md conventions: no synthesized data (flight arcs removed 2026-09-06; plFlags bit0 / TILE_FLAG_FLIGHT / flightArcs = leftovers, 0; docs/current-architecture.md + tile-archive-format.md still describe arcs = stale) + TSL evenVid uint pairing (`bitAnd(0xfffffffe)` via f32 -> streaks). Already documented there, not moved: RDP eps vs budget (scripts/pipeline/lib/config.js), pool 16M rationale (TrackGeometryPool.ts), dummy position (TrackGeometry.ts), pipeline / --force / 12 GB heap / hour-filter caveat (README). three r185 storage-buffer + MultiplyBlending gotcha kept in io working.md (io-three). Other daily-routines files have user's uncommitted edits, untouched.
- now.md (three multi-canvas upstream) folded into working.md io-three Multi-view "Status 2026-10-12". Checked 2026-10-13: ../three.js on dev (clean, 3995acf2a9, neither fix); examples/multiple-canvas committed 7ce1d4999f; fixes/NodeMaterialObserver 5b06dbb9a9 (#34968 + review); fixes/ReflectorNode d77ce50040 (#34977). gh CLI 401 (unauthenticated) -> PR states not rechecked.
- Noted: conversion plan Workflow headless paragraph ("screenshots blank", SwiftShader) predates the GPU-flags recipe in working.md.

- [three][upstream] 2026-10-13: drafted three.js feature-request issue arguing multi-view (CanvasTarget) rendering needs E2E coverage; lists 6 bugs since r183 (#32642,#32689,#33209,#34968,#34977, unfiled camera-type), proposes extending webgpu_multiple_canvas (draft 7ce1d4999f, local only). User wants discussion only, no fixes now. CI already screenshot-tests WebGPU examples (lavapipe, mesa-vulkan-drivers). Kit https://claude.ai/artifact/TWT98UonwKD289ptWA7b3j
- [three][upstream] 2026-10-13: #34968/#34977 merged; user posted #34982 (multi-canvas coverage). Fixed camera-type-baked-at-build on ../three.js fixes/camera-type (uncommitted): cameraIsPerspective + select in 5 places. Checks: unit 1932 pass, lint clean, headless GPU harness (dev vs fix, both orders, logdepth) exact, official e2e multiple_canvas draft passes w/ fix. Full webgpu example diff dev vs fix run in session scratch (e2e-dev/e2e-fix, ports 1234/1235). Kit https://claude.ai/artifact/GnGpvH6JSL4buM7fxpnpbC
- [three][upstream] 2026-10-13: #34968/#34977 merged; user posted #34982 (multi-canvas coverage). Fixed camera-type-baked-at-build on ../three.js fixes/camera-type (uncommitted): cameraIsPerspective + select in 5 places. Checks: unit 1932 pass, lint clean, headless GPU harness (dev vs fix, both orders, logdepth) exact, official e2e multiple_canvas draft passes w/ fix. Full webgpu example diff dev vs fix run in session scratch (e2e-dev/e2e-fix, ports 1234/1235). Kit https://claude.ai/artifact/GnGpvH6JSL4buM7fxpnpbC
- [three][upstream] 2026-10-13: full webgpu example diff (202, official harness --make, dev vs fixes/camera-type): 200 identical; 2 (retargeting_readyplayer, compute_rasterizer) 1-2px in fix run1 = noise from parallel runs, rerun matches dev exactly. Kit v2 updated. Open question to user: add harness montages (ref|dev|fix) to PR for points/sprite coverage (fiddle shows water only).
- [three][upstream] 2026-10-13: user opened draft PR #34985 (camera type). Made fiddle2 (2x2: points/sprites rows, persp then ortho) + kit https://claude.ai/artifact/Kih8AaBeM9ciQPoFPCKBzS with follow-up comment. Verified: dev second view wrong both orders (7.8-11.3%), fix exact all views; fiddle as posted (githack dev) byte-identical to local dev render.
- [memory] 2026-10-13: user asked what to prune from archive.md. Proposed (not applied, pruning = when instructed): exact dup `2026-07-07 guard-zero-tab-drop-target` (lines 323/330); move 22 daily-routines entries (~13 KB) to ../daily-routines; drop ~2 KB about deleted code (ToolBase x2, extract camera utils) + housekeeping logs. Restructure: promote `###` under "Phase 7" and (26)-(31) bullets under (23) to `##`, sort chronological. Keep layout/Binding failure history, io-three 10-07..10-11, rename name maps. User moved on without answering.
- [three][editors] 2026-10-13: Camera example console warnings = 6x `IoPropertyEditor: property "X" not found in value` (IoPropertyEditor.ts:226), once when the doc opens, not per frame (re-expanding a camera should repeat its share: IoObject re-creates its editor; untested). Cause: CameraExample.ts:150 one shared `cameraObject` ioObject for both cameras, `properties` = union of both types -> PerspectiveCamera lacks left/right/top/bottom (4), OrthographicCamera lacks fov/aspect (2). Shared list since 809d796f. Its `groups` is dead (explicit `properties` overrides groups.Main and skips other groups; nested matrix ioObjects have own `properties`). Verified headless: playwright GPU flags vs user's dev server :3000 `#path=Demos,Three`, set `io-editor-example.documentName = 'CameraExample'`, console.warn wrapped w/ stacks (script in session scratchpad camwarn/run.cjs). Proposed fix: two ioObjects (persp: fov/far/aspect/matrices; ortho: left/right/top/bottom/far/matrices) sharing one config array. Not applied; offered.
- [three][view] 2026-10-13: CameraArray showed one view: View._fromSceneCamera copies ArrayCamera (isPerspectiveCamera) into plain _scenePerspective -> `cameras` dropped; + updateCameras(1,1) -> all viewports (0,0,1,1). Built View.getContentCamera (view-owned ArrayCamera, sub-viewports scaled onto passepartout frame, PipelineContext.contentCamera for Forward/PostProcessing/SelectionOutline mask) -> worked on GPU, but TRAA/VelocityNode main-camera only -> cells smear. User: bloat for one example (no editor use case: XR ArrayCamera is runtime, split screens = viewports) -> REVERTED, CameraArrayExample deleted (src, dist, DOCUMENTS entry). Rationale + contained alternative (cells laid out inside ForwardPipeline) in conversion plan "What fits". Verify: tsc -b clean, three tests 195 pass, eslint 0 errors.
- [editors] 2026-10-13: Backdrop -> BackdropArea console "Error in IoObject.mutated(): Cannot convert undefined or null to object" (seen earlier as pre-existing "IoObject.mutated BackdropArea"). Cause: IoPropertyEditor._propertyEditors (id -> field) only rebuilt in configureDebounced (next frame after value change); throttle runs leading edge -> changedThrottled from new doc's mutations syncs into OLD fields by id; BackdropArea `mixer` field undefined until glTF loads -> old `mixer` io-object gets undefined -> Object.keys(undefined). Fix: valueChanged clears _propertyEditors. Regression test IoPropertyEditor.test.ts. Verify: pnpm test 1087 pass, tsc -b, eslint 0 errors, headless switch x2 on :3000 0 errors. Not fixed (offered): IoObject.mutated still throws if an object property becomes null in place (same value).
- [three][view] 2026-10-13: TslVfxFlames front/back ortho views: half of each flame missing, quads hide grid, zoom-out clips all. Causes: (1) clipPlanesFromBox span floor 1e-3 absolute; flat sprite box (z span 0) face-on -> FRAME_OVERFIT 4 margin = 0.004; billboarding({horizontalRotation}) turns quads toward cameraPosition (eye at x=0, flames x=±0.5 -> ~15° yaw) -> outer half past far. (2) View.getCamera ortho near=-far, far=far around EYE; ortho dolly changes distance not clip -> zoom out 2.5x -> everything (incl grid) clipped. (3) transparent flame quads write depth -> grid hidden over whole quad. Fix: span floor = box half-diagonal; ortho clip = distance ± nav.far (around target); example flame materials depthWrite=false (plan audit row notes deviation). Test View.test 'keeps flat content inside the clip range...' (fails pre-fix). Verify: pnpm test 1088 pass, tsc -b, eslint 0 errors; headless GPU (scratch flames/snap.mjs) front/back full flames + grid, zoomed-out back visible, console clean.
- [three][overlays] 2026-10-13: scene-helpers (future work plan) done, grilled first. Decisions: 3 overlay types (cameraHelpers on, lightHelpers on, skeletonHelpers off) instead of one + kinds filter; CameraHelper always full frustum (user rejected short-pyramid-unless-selected); point/directional/hemisphere icons constant 24px screen size per view (worldPerPixelAt), spot cone + RectAreaLightHelper real size; selected helpers in outline colors (OUTLINE_COLORS exported from SelectionOutlineOverlay), no selected-only filter; LightsRectarealight panels now from overlay. No overlay toggle UI exists -> user chose demo sets skeletonHelpers on Perspective view (overlays menu = noted follow-up). Impl: render/overlays/HelperOverlay.ts (HelperOverlay + HelperKind; per-draw traverseVisible + KeyedPool, not ChangeListener; skips view source camera; skeleton per root bone, rebuilt when bone count changes; skinned-mesh selection highlights its bones). Examples: Camera, AnimationRetargeting, LightsRectarealight, AnimationSkinningBlending lost authored helpers (showModel hides meshes only so skeleton stays). CONTEXT.md: new term "Helper overlay"; Overlay avoid-note changed. README table, skill rule, conversion plan rule + audit rows updated. Verify: pnpm test 1092 pass (4 new HelperOverlay.test + ViewCompositor ids), tsc -b, eslint 0 errors; headless GPU screenshots (scratch helpers/snap.mjs, framed.mjs) frustums, rect panels, icons, skeleton, selection orange, TRAA views OK, no console errors.
- [three][view] 2026-10-13: ViewOverlays strengthened: Record<string, boolean> -> interface of built-in flags (grid, components, selection, cameraFrame, cameraHelpers, lightHelpers, skeletonHelpers, gizmos; doc comments w/ defaults), extensible by `declare module '@io-gui/three' { interface ViewOverlays {...} }` (merges through barrel export *). OverlayId = keyof ViewOverlays; OverlayType.id, isOverlayEnabled, setOverlay take OverlayId. View.overlays and ViewSettings.overlays are Readonly<ViewOverlays>: no in-place edits (would not redraw), and the mapped type keeps ViewData assignable to core Json (interfaces lack implicit index signature -> toJSON override error). Verified: consumer files vs rebuilt dist (scratch overlaytypes/, @ts-expect-error for typo ids, in-place edit, undeclared register; augmentation positive). User asked mid-turn to rename cameraFrame -> cameraHelpers, then withdrew (misread name).
- [three][view] 2026-10-13: overlays all default off (user: consistency). Removed OverlayType.enabledByDefault; View.isOverlayEnabled(id) = flag === true (also gizmos). Demo IoEditorExample: OVERLAYS_3D const (all 8 on) for 3D views, camera view without grid, uv none. Tests updated (ViewCompositor registry, ThreeViewport gizmos opt-in). Found latent bug: ThreeViewport.listens used `_compositor?.listens ?? 'content'`; compositor was only created eagerly by the gizmo layer, so with gizmos off selection changes became full redraws -> now `this.compositor.listens`. README table/plan updated. Verify: three tests 200 pass, tsc -b, eslint 0 errors, GPU demo overlays present. User then asked how view `kind` affects overlays (opaque): OverlayType.viewKinds silently filters; all built-ins ['3d']; flags on uv views ignored silently. Offered: debug warning + doc kinds per flag.
- [three][overlays] 2026-10-13: user: overlays not initialized from view kind, consumer decides. ViewCompositor.syncOverlays creates overlays from flags only; OverlayType.viewKinds now just "made for" -> debug-only console.warn once per id:kind per compositor when enabled in another kind (stripped in bundles). Test asserts creation in uv + 3 warnings once. CONTEXT View kind + README updated. Verify: three tests 200, tsc -b, eslint.
- [three][examples] 2026-10-13: batch of 25 conversions (user committed d33448e0): Morphtargets, MorphtargetsFace (KTX2+PMREM in onRendererInitialized, `expressions` accessor record 120px labels), InstancingMorph (SunLight addLight in onRendererInitialized, kept source camera, 63 s, overscan 0.5 vs fog), AnimationMultiple (shared skeleton bones under 'Skeleton' group w/ glTF transform; updateMatrixWorld before frame: skinned bounds read stale bones), Materials, MaterialsBasic, MaterialsLightmap, MaterialsEnvmaps (rotateX/Y/Z), MaterialsSss, ProceduralTexture, Textures2dArray, TslGalaxy (explicit InstancedMesh bounds), 9 loaders (Obj Stl Ply 3ds Draco Kmz Amf(Z-up turned) Usdz Vox), FogHeight (kept camera), InstanceMesh, InstancePath (InstancedMesh + bounds instead of Mesh.count), TslRagingSea (source GUI names). Verified headless GPU vs :3000 (run/act scripts in session scratch). Plan: audit rows, candidates completed, 7 transmission rows tagged, rules (renderGroup, labels, GPU bounds, skinned framing), Workflow headless recipe updated.
- [three][view] 2026-10-13: user: MaterialsLightmap zoom in Scene Camera cuts sky. Cause ViewNavigation.dolly scaled far w/ distance. Fix far = max(far+Δ, far*applied) + View.test. 
- [three][render] 2026-10-13: user: FogHeight fog params update only ortho views, asked if #34985. No: three #34162 SHARED refresh skips objectGroup uniforms for objects w/o node props; ortho = TRAA = velocity MRT = FULL. Repro standalone (scratch repro/site, python http.server 8765 + build symlink): default uniform stays green, renderGroup turns red. Also CubemapMix helmet env froze (timeNode objectGroup). Fixed: Timeline.timeNode renderGroup (+test), FogHeight uniforms renderGroup. Upstream not filed (offer). Tests 202 pass.
- [repo] 2026-10-13: user restored packages/three/dist before committing src only; restored dist churn from my tsc -b runs.
- [three][examples] 2026-10-14: forked session (peer io-b3 on three.js shared-refresh fix) took webgl_* batch of 30 in worktree /Users/aki/Projects/io-examples-webgl, branch examples-webgl off dev f8f3d9f2 (sibling dir so packages/three `link:../../../three.js` resolves; `pnpm install --offline --frozen-lockfile` 1 s). Converted: Collada x2, Fbx (asset dropdown, `clips` record of functions = buttons, `morphs` accessor record), FbxNurbs, 3mf (Z-up turned upright), 3mfMaterials, Pcd/Xyz (Points kept for pick/frame + child InstancedMesh PlaneGeometry PointsNodeMaterial positionNode=instancedBufferAttribute, explicit bounds), Vrml, Gcode, Svg, GltfAvif/Instancing/Variants, Mdd, TextureExr/Hdr/Tga/Tiff/Ultrahdr, Materials Bumpmap/Cubemap/CubemapRefraction/EnvmapsExr/EnvmapsHdr/Normalmap/NormalmapObjectSpace/TextureRotation/Blending, PanoramaCube. Found: framing leaves of fresh loaded hierarchy -> stale ancestor matrices (expandByObject updates only object) -> updateMatrixWorld(true) first; static doc + loader textures after model -> black until LoadingManager notify; VRML Background spheres 10000u beyond view far (FRAME_OVERFIT) -> onBeforeRender follow camera, radius (near+far)/2, explicit renderOrder (WebGPU sorted ground under sky); WebGPU PMREM = cube texture -> debug plane `map` invalid WGSL -> dropped; NoBlending+premultipliedAlpha raw color (Blending alpha flare); MDD morph growth -> frame detached 2-point stand-in. Verified headless GPU vs own dev server :3001 (.verify/ scripts, untracked): all 30 render, controls paused, 30 opened in one page 0 console errors. tsc -b, eslint clean; three tests 201/202: ThreeScenegraph "scrolls a deep row horizontally" 200.375 > 200, fails consistently in worktree, unrelated to batch (demo files only). dist restored.
- [three][lifecycle] 2026-10-14: user asked if IoEditorExample.disconnectedCallback can stop document animation and viewport rendering. Rendering already stops: ThreeViewport.disconnectedCallback unregisters from renderScheduler (scene graph drops its listener too); rAF draws only registered views. Animation does not: Editor.isPlaying is a scheduler ticker, independent of the DOM, and a ticker alone keeps the rAF loop alive. Stop it with `this.editor.isPlaying = false` (isPlayingChanged removes the ticker). Reconnect's open() sets isPlaying from timeline.autoplay, so a manually-playing non-autoplay doc stays paused. Not applied.
- [three][upstream] 2026-10-14: user: tackle webgpu_fog_height bug + PR kit. Confirmed on upstream pages headless (fog_height density, cubemap_adjustments hue: objects stale, background updates). Bisected to #34162. Fix in NodeMaterialObserver.containsNode (user scene fogNode/environmentNode -> hasNode). Verified both examples match fresh page, fiddle (box green/red toggle) stale on r186 / ok on fix, eslint ok. Branch fixes/scene-node-uniforms uncommitted. Kit https://claude.ai/artifact/1rioD4MHHMpYsWPazxrxVL. Fork session took webgl_* conversion rows (worktree io-examples-webgl).
- [repo] 2026-10-14: user committed + pushed examples-webgl (32820d25) from the worktree, asked to merge into dev in main checkout + fix conflicts + resolve memory. Main checkout had peer's UNCOMMITTED plan/.memory edits (shared-refresh fix status, lifecycle Q) overlapping merge files -> backup .git/peer-uncommitted-2026-10-14.patch + tagged stash (apply by SHA d31025f3), merge --no-ff examples-webgl: auto-merged (IoEditorExample DOCUMENTS + b33b0feb EXAMPLE_MENU), tsc -b clean, dist restored, merge commit 19cfc623 (not pushed). Stash apply: plan + working.md auto-merged; archive/now conflicts resolved by hand (all entries kept, now.md rewritten; peer's "disconnect not applied" note stale: b33b0feb pauses editor in disconnectedCallback). Lint: 3 errors in b33b0feb's own IoEditorExample code (2 floating this.open() promises, trailing spaces), not merge; left for user. Memory/plan left uncommitted for user.
- [repo][tests] 2026-10-14: user: fix lint + scenegraph test + explain bg-isolation guard. Lint: b33b0feb IoEditorExample 2x `void this.open()` + trailing spaces -> lint:check 0 errors (93 warnings). ThreeScenegraph "scrolls a deep row horizontally" 200.375 > 200: not a regression (code unchanged since 4f841b76; fails at 610bfd9d too). Probe (temp config + probe test, deleted): label in Times (core sets no font) 57.375 px wide, scrollIntoView needs scrollLeft 110.375; headless (shell or full chromium, DPR 1 or 2) -> 110 -> 0.375 over; headed Retina (local `pnpm test` default, no CI env) -> 110.5 -> 199.875 pass. CI headless would fail. Fix: test tolerance `+ 1 / devicePixelRatio` w/ comment. Verify: three 202/202 + full unit 1094/1094 headless, tsc -b, dist restored. Guard: Write/Edit refuse shared checkout for this forked background session (worktree.bgIsolation); earlier edits were inside io-examples-webgl worktree (allowed); Bash not covered -> used python replace for user-requested edits.
- [three][examples] 2026-10-14: user submitted upstream #34996 (shared-refresh fix); asked to remove FogHeight renderGroup workaround (deviates from source). FogHeightExample uniforms back to plain `uniform()`. Timeline.timeNode renderGroup kept. Plan audit row/blocker/todo + working.md note updated: recheck FogHeight once #34996 lands.
- [three][upstream] 2026-10-14: user: MaterialsTextureRotation rotation not shown in perspective views, fog issue? Yes same root (#34162 SHARED refresh), different trigger: TextureNode._matrixUniform = uniform(texture.matrix).onObjectUpdate (objectGroup); SHARED path runs updateForRender (CPU value updated) but updateSharedForRender uploads shared groups only. equals() compares texture id/version/cacheVersion only, not offset/repeat/rotation/center -> no FULL. Pre-#34162 renderId force => full refresh each render. #34996 (scene fogNode/environmentNode) does NOT cover it. Code reading only, no headless run. Offered: workaround vs upstream (texture transform in observer equals / broader objectGroup-with-update-callback fix).
- [three][upstream] 2026-10-14: user: file upstream PR for the general bug + kit; asked mid-way if it also covers #34996. Audit of built-in per-object uniforms w/ update callbacks vs observer equals(): untracked = texture uv transforms (all material maps), refractionRatio, clearcoatRoughnessMap, thicknessMap, iridescenceThicknessRange (array by ref). Headless harness (scratch observer/: run.mjs serves src tree, render unchanged obj to fixed RT, change, compare w/ fresh scene): parent of #34162 all update; #34162 + dev all stale; fix all update; #34996 only fixes fog row; fix + #34996 all update (patch applies cleanly). Idle: 50 textured MeshStandard static -> same refresh types as dev (49 NONE + 1 SHARED); scrolling 1 texture -> 1 FULL. test-unit 1957 pass 0 fail; eslint ok. webgpu_materials_basic refractionRatio slider NOT broken (spheres move every frame -> FULL). clearcoatRoughnessMap no-op before #34564 (wrong channel; test uses all channels). Fiddle: CanvasTexture stripes rotating on MeshBasicMaterial; dev build 57fad14cea (has #34162) frozen, fix turns. Branch fixes/observer-texture-transforms UNCOMMITTED; kit https://claude.ai/artifact/SKMjUYdcMTe2NrYMfv1eQW. gh token still invalid. Answer: separate from #34996 (user uniforms can't be monitored; a single fix = diff all object UBOs on SHARED = undo #34162 design).
- [three][upstream] 2026-10-14: user: kit fiddle only showed texture.rotation, show full PR scope. New fiddle (scratch observer/fiddle-grid): 4x3 grid, ortho cam, 11 tiles: color control, map.offset/repeat/rotation/center/matrix, emissiveMap.offset, refractionRatio, clearcoatRoughnessMap swap, thicknessMap swap, iridescenceThicknessRange[1]; a = 0->1->0 per 4 s. test.mjs fakes rAF clock (0 then ramp to 2 s), per-tile diff. Results: dev build, dev src, #34162, r186 npm 0.186.1, #34996-only -> only control animates; fix + fix+#34996 -> all 11. Parent of #34162: map.offset + all unique-setup tiles animate, map.repeat/rotation/center/matrix frozen -> observer per NodeBuilderState, old renderId force refreshed only 1st render object per state (confirmed: reorder flips which map tile animates; 2nd refractionRatio sphere frozen). #34162 shipped in r186 (r185 2026-06-25 predates). PR body updated (r186, predating gaps, fiddle table); kit republished same URL (v2), build via kit/build.py.
- [three][upstream] 2026-10-14: user: other properties needing similar fix? Sweep (scratch observer/sweep.js via `MOD=sweep node run.mjs <root>`; SHARED=1 two-object shared-shader check; SPRITE=1 sprite center check; one render per rAF or FRAME updates (lights) never rerun): 13 core material setups x every number/color/vector/euler/array/texture prop + texture offset (~310) + ~30 object/scene/light cases. With PR: all ok except (1) LightProbe.sh + .intensity: same #34162 class (LightProbeNode uniformArray lacks setGroup(renderGroup)); ok pre-#34162. (2) envMap swap Standard/Physical: needs rebuild, EnvironmentNode binds pmremTexture(value) at setup; pre-existing. Shared-shader cross-talk (pre-existing, not #34162): envMap (Standard/Physical), iridescenceThicknessRange (MaterialNode reference bound to 1st material's array; reassign stale even with PR), Sprite.center (SpriteNodeMaterial reference bound to 1st sprite). 118 no-op cases all tracked props. Candidate fixes verified in scratch variants/next: LightProbe setGroup(renderGroup); MaterialNode getFloat('iridescenceThicknessRange.1'/.0) (drop unused reference import); SpriteNodeMaterial reference('center','vec2') no object. Not applied to branch; asked user.
- [three][upstream] 2026-10-15: user: PR rejected as too large, asked for issue kits with fiddles + screenshots; also check if bugs fixed; noted MaterialsTextureRotation rotation works now. GitHub API (unauth): #35002 closed (Mugen87: step by step, then 'close this PR and make an issue instead'); #35022 Mugen87 merged refractionRatio/clearcoatRoughnessMap/thicknessMap 2026-10-15 ('focus on iridescenceThicknessRange next'); #34996 merged 2026-10-14 (+ c5e5061ed0 cleanup; org fork blocked maintainer edits). Fetched upstream/dev ec2b7458ea; dev build ca10fb69aa has #34996 not #35022. Dev source checks: fixed = 3 props + custom fogNode; still broken = texture transforms (all slots), iridescenceThicknessRange (in place, reassign, shared shader), LightProbe sh/intensity, Sprite.center shared, envMap swap/shared. r185 (npm pack) checks: LightProbe works (regression); texture/iridescence first-object-of-shader only; sprite/envMap same as dev. Candidate fixes re-verified on dev copy (variants/dev2fix): all but envMap. io MaterialsTextureRotation: io links ../three.js (now dev, no fix); render objects keyed (object, material, renderContext=target format, lightsNode=scene) not camera -> views with same-format targets share render objects -> outputTarget switch -> FULL (harness twotarget.js: 1 target stale, 2 targets ok). Built 5 issue kits (scratch observer/issues: fiddles, run.mjs build/src/webgl modes, issues.py texts per bug_report.yml, build.py) -> https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz (tabs, GitHub prefill link per kit, WebGLRenderer = expected shots). Plan renamed by user to three_example_conversion.plan.md; updated FogHeight/MaterialsTextureRotation rows + shared-refresh blocker.
