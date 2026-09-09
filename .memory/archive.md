# Archive

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

