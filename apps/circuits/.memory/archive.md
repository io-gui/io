# Archive - Circuits App

## 2026-02-06 — Initial Port Complete

### [decision] Architecture choices
- IoStorage for hash routing + localStorage (replacing local.ts and navigation.ts)
- PointerEvents replacing touch/mouse abstraction in touches.ts
- Game directory stays mostly unchanged — minimal conversion
- Editor stays canvas-based, wrapped in IoElement shell
- Styles follow io-gui :host syntax
- Page switching via CSS attribute selectors on :host (not IoSelector)

### [pattern] io-gui auto-binding conflict
Methods starting with `on[A-Z]` on IoElement subclasses are auto-bound by ProtoChain.
Cannot use `onSave`/`onComplete` as callback function properties on IoElements.
Renamed to `saveFn`/`completeFn` on CircuitsGame to avoid conflict.
Game class (plain object) keeps `onSave`/`onComplete` — no conflict there.

### [pattern] Canvas in io-gui VDOM
`canvas` VDOM factory from @io-gui/core works. Canvases with same id survive VDOM diffing.
Scene.init() takes canvas refs directly — called after render ensures elements exist.

### [pattern] Level data
50 level JSON files exist (not 96). Reference HTML had 96 buttons.
Level IDs: lvl_SSLL format (SS=set 01-04, LL=level 01-24).
Missing levels will fail fetch with console warning — acceptable behavior.

### [implementation] Files created
11 source files, 0 TypeScript diagnostics. Updated index.html.

### [cleanup] Reference files deleted, wired into main app
- Deleted all `_reference` vanilla TS source (~1,769 lines): `src_reference/`, `index_reference.html`, `style_reference.css`
- `index.html` now uses `<circuits-app>` with fullscreen body styles + viewport meta
- Added `@io-gui/inputs`, `@io-gui/layout`, `@io-gui/navigation` as workspace deps
- Registered in root `index.html` via `iframe()` helper + nav entry

## 2026-02-11 — Terminal model removed

### [decision] Remove terminal entity
- Deleted `src/game/items/terminal.ts`.
- Terminal behavior now represented by `Pad` with `isTerminal: true`.
- Runtime JSON handling in `game.ts` now expects only `pads` + `lines` (no legacy `terminals` array).

### [implementation] Refactor touchpoints
- Updated `game.ts`, `plotter.ts`, `line.ts`, `CircuitsBoard.ts`, `threeScene.ts`, `grid.ts`, `index.ts`.
- Plotter connection limits now use `pad.isTerminal` (1 for terminal pads, 2 for regular pads).
- Grid visibility logic now derives terminal behavior from terminal pads.

### [implementation] Level migration script
- Added `tools/migrate-levels-to-terminal-pads.js`.
- Script migrates `lvl_*.json`:
  - merges `terminals[]` into `pads[]`
  - normalizes `ID` -> `id`
  - writes `isTerminal` + normalized `color`
  - normalizes `lines[].ID` -> `lines[].id`
- Script run completed for all 35 level files.

## 2026-02-11 — renderColor propagation

### [decision] Separate source color from propagated color
- `Pad.color` remains static terminal source color (undefined for non-terminal pads).
- `Pad.renderColor` is mutable runtime color used for propagation and rendering.

### [implementation] Propagation/render refactor
- `game.ts` propagation now reads/writes `pad.renderColor` only.
- `plotter.ts` line start + color compatibility now use `point.renderColor`.
- `threeScene.ts` pad and terminal mesh colors now bind to `renderColor`.
- Non-terminal pad JSON remains colorless; no persistence of propagated color.

## 2026-02-12 — Grid width/height line-count semantics

### [decision] Canonical dimensions represent line counts
- In circuits runtime and level JSON, `width`/`height` now represent grid line counts (pad columns/rows), not segment counts.
- Segment extents are derived as `width - 1` / `height - 1` in geometry/camera code.

### [implementation] Runtime migration
- `game.ts`: default grid moved from `(4, 5)` to `(5, 6)` and dimension normalization helper added.
- `pads.ts`: storage changed from `(width + 1) * (height + 1)` to `width * height`; bounds changed to `< width`/`< height`.
- `plotter.ts`: bounds changed to `< width`/`< height`.
- `grid.ts`: segment formulas/loops updated to use derived segment extents from line counts.
- `threeScene.ts`: camera framing/drag scale updated to keep previous visual behavior using segment extents.

### [implementation] Data + tests
- Migrated 35 level files in `public/levels/lvl_*.json` by incrementing `width` and `height`.
- Updated `tools/migrate-levels-to-terminal-pads.js` to emit incremented dimensions during migration.
- Updated `pads.test.ts` constructor/fromJSON dimensions to line-count semantics and verified passing.

### [verification]
- `pnpm exec vitest run apps/circuits/src/game/pads.test.ts` passes.
- Running full `pnpm test -- apps/circuits/src/game/pads.test.ts` executes full repo suite and still shows unrelated existing failures in `packages/editors/src/elements/IoObject.test.ts`.

## 2026-02-13 — Grid debug pads texture plane

### [decision] Keep debug texture ownership inside `Grid`
- Added debug texture generation and debug plane setup to `apps/circuits/src/scene/grid.ts`, alongside existing line helper geometry update flow.
- Reused `Grid.update(width, height, ..., pads)` inputs so debug texture updates stay in lockstep with board state.

### [implementation] Pads/terminal texture encoding
- Added a `DataTexture` with nearest filtering and no mipmaps.
- Texture resolution is `width x height`, matching intersection count.
- All texels initialize black (RGBA = 0,0,0,0).
- For each pad:
  - RGB from `pad.renderColor`
  - A = `255` when `pad.isTerminal`
  - A = `0` for non-terminal pads

### [implementation] Debug plane alignment
- Added `debugPadsPlane` mesh as child of `Grid`.
- Plane scales to `(width, height)` and is centered at `((width - 1) / 2, (height - 1) / 2)`.
- This makes plane bounds extend by 0.5 cell on each edge so texel centers align with grid intersections.

### [verification]
- `ReadLints` reports no diagnostics for `apps/circuits/src/scene/grid.ts`.

## 2026-02-13 — Texture-driven instance colors (scene objects)

### [implementation]
- Added shared TSL material base `StateTextureMaterialBase` with:
  - three bound textures (`pads`, `layer0`, `layer1`)
  - one vec2 instance-rate input via `InstancedBufferAttribute`
  - texture index selection in shader
- Added object-specific materials:
  - `PadsStateMaterial`
  - `TerminalsStateMaterial`
  - `Layer0LinesStateMaterial`
  - `Layer1LinesStateMaterial`
- Refactored `ThreeScene`:
  - removed per-instance color writes (`setColorAt`, `instanceColor`)
  - split lines into `layer0Lines` and `layer1Lines` instanced meshes
  - each segment samples by first vertex UV
  - pads/terminals sample by their own cell UV
  - synchronized materials with current `Grid` textures every `updateGrid()`
- Added texture getters on `Grid` (`padsTexture`, `layer0Texture`, `layer1Texture`) for material wiring.

### [verification]
- `ReadLints` reports no diagnostics for edited scene/material files.
- `pnpm exec tsc -p apps/circuits/tsconfig.json --noEmit` still reports pre-existing unrelated errors in `apps/circuits/src/game/layer.test.ts` (`Layer.getAt` references).

## 2026-02-13 — Uniform UV lookup and mesh reuse fixes

### [implementation]
- Replaced per-instance `instanceGridUV` attribute approach with per-mesh UV lookup `DataTexture` uniforms.
- `StateTextureMaterialBase` now samples lookup UV by `instanceIndex`, then samples state textures (`pads/layer0/layer1`) at that UV.
- Forced opaque output in state materials (`vec4(rgb, 1)`) to avoid accidental transparency from debug texture alpha.
- Refactored `ThreeScene` updates to mutate existing instanced meshes instead of recreating every update; mesh recreation now only happens when capacity must grow.
- Added per-mesh lookup texture capacity management (`pads`, `terminals`, `layer0`, `layer1`) and update paths.
- Adjusted texture V mapping in scene sampling to align object lookup with current texture orientation.

### [verification]
- `ReadLints` reports no diagnostics for touched scene/material files.
- Typecheck still only shows unrelated existing `layer.test.ts` errors.

## 2026-02-13 — Per-instance vec2 via instanceColor

### [implementation]
- Removed lookup texture indirection for instance UV lookup.
- `StateTextureMaterialBase` now reads instance UV directly from instanced attribute via `instancedBufferAttribute(...).xy`.
- Wired per-instance UV updates in `ThreeScene` through `setColorAt(i, Color(u, v, 0))` and `instanceColor.needsUpdate = true`.
- Bound each mesh `instanceColor` attribute to its material via `setInstanceUVAttribute(...)`.
- Kept mesh reuse path; no per-frame mesh recreation.

### [verification]
- `ReadLints` reports no diagnostics for updated scene/material files.
- `pnpm exec tsc -p apps/circuits/tsconfig.json --noEmit` still only shows unrelated pre-existing `layer.test.ts` errors.

## 2026-02-13 — Custom TSL debug material

### [implementation] New material class for debug texture prototyping
- Added `apps/circuits/src/scene/materials/DebugStateMaterial.ts`.
- Material extends `MeshBasicNodeMaterial` and binds 3 textures (`pads`, `layer0`, `layer1`) at once.
- Uses a uniform `textureIndex` to pick output texture in `colorNode`.

### [implementation] Grid integration
- `Grid` now uses `DebugStateMaterial` for `debugPadsPlane`.
- Replaced map swapping logic with shader-uniform selection via `setTextureIndex(0 | 1 | 2)`.
- Added `setTextures(...)` sync call during updates so texture recreation (resize) updates the shader inputs.

### [verification]
- `ReadLints` reports no diagnostics for:
  - `apps/circuits/src/scene/grid.ts`
  - `apps/circuits/src/scene/materials/DebugStateMaterial.ts`

## 2026-02-13 — Numeric debug mode

### [implementation]
- Updated `Grid.debugTextureMode` to be numeric instead of string-based mode IDs.
- `_updateDebugTextureMap()` now rounds/clamps numeric mode to `0|1|2` before forwarding to `DebugStateMaterial`.

### [verification]
- `ReadLints` reports no diagnostics for `apps/circuits/src/scene/grid.ts`.

## 2026-02-13 — Added layer debug textures + mode switching

### [implementation] Three debug textures on one plane
- Extended `Grid` debug texture pipeline with:
  - `pads` texture (existing behavior)
  - `layer0` lines texture
  - `layer1` lines texture
- Added `debugTextureMode` and `setDebugTextureMode(mode)` to switch the shared debug plane map between `pads`, `layer0`, `layer1`.

### [implementation] Line texture encoding
- For each layer texture, resolution is `width x height` (grid intersections).
- Per-cell RGB is set from `line.renderColor` when at least one line in that layer touches the cell.
- Per-cell alpha encodes number of distinct layer lines touching that cell:
  - `0` lines -> `0`
  - `1` line -> `128` (`0.5`)
  - `2+` lines -> `255` (`1.0`)
- Per-line touched cells are deduplicated before counting, then cell counts are clamped at 2.

### [verification]
- `ReadLints` reports no diagnostics for `apps/circuits/src/scene/grid.ts`.

## 2026-02-13 — Generic capacity helpers in ThreeScene

### [implementation]
- Refactored `threeScene.ts` capacity growth logic to shared helpers:
  - `_ensureMeshCapacity(...)` replaces duplicated pad/terminal/layer mesh growth paths.
  - `_ensureLookupStateCapacity(...)` replaces duplicated lookup texture/data reassignment wrappers.
- Updated `updatePads`, `updateTerminals`, and `_updateLayerLines` to call these generic helpers directly.

### [verification]
- Ran `pnpm exec eslint apps/circuits/src/scene/threeScene.ts`.
- Confirmed no new lint errors from this refactor; only pre-existing file issues remain:
  - unused `_instanceUVColor`
  - trailing space around line 116

## 2026-02-13 — UV data leaking as visible color

### [diagnosis]
- In `threeScene.ts`, UV lookup coordinates are packed via `setColorAt(...)` into `mesh.instanceColor`.
- `StateTextureMaterialBase` samples state textures from that attribute, but instance color is also still applied as visible color/tint by the material pipeline.
- Result: rendered pads/terminals/lines look like UV gradients/UV-encoded tint instead of pure state-texture color.

### [next-step]
- Use a dedicated custom instanced attribute for UV lookup data (not `instanceColor`) and bind that to `StateTextureMaterialBase`.

## 2026-02-13 — Keep instanceColor for lookup only

### [implementation]
- In `StateTextureMaterialBase`, set `vertexColors = false` in constructor.
- This preserves reading `instanceColor.xy` via `instancedBufferAttribute(...)` for UV lookup while preventing implicit vertex/instance color tint in final shading.

### [verification]
- `ReadLints` reports no diagnostics for:
  - `apps/circuits/src/scene/materials/StateTextureMaterialBase.ts`
  - `apps/circuits/src/scene/threeScene.ts`

## 2026-02-13 — Bypass implicit color graph multiply

### [diagnosis]
- `colorNode` path likely still passes through default material graph stages that can include per-instance color/tint behavior.

### [implementation]
- In `StateTextureMaterialBase._rebuildColorNode()`, switched final assignment from `colorNode` to `outputNode`:
  - from: `this.colorNode = vec4(stateColor.rgb, 1)`
  - to: `this.outputNode = vec4(stateColor.rgb, 1)`

### [verification]
- `ReadLints` reports no diagnostics for `apps/circuits/src/scene/materials/StateTextureMaterialBase.ts`.

## 2026-02-13 — Reload now re-inits scene after propagation

### [implementation]
- Updated `Game.reload()` to mirror `levelChanged()` flow:
  - clear stored state
  - await `initialize()`
  - dispatch `game-init-scene`
- Ensures reload path triggers scene re-init and texture refresh after initialization/color propagation is complete.

### [verification]
- `ReadLints` reports no diagnostics for `apps/circuits/src/game/game.ts`.

## 2026-02-13 — Resize fix for state-texture node material

### [diagnosis]
- Grid resize can recreate textures and/or instanced attributes (via mesh growth), but node-material graph changes were not explicitly forcing pipeline/material refresh.
- Symptom: grid geometry updates, but sampled state textures appear wrong/broken after size change.

### [implementation]
- In `StateTextureMaterialBase._rebuildColorNode()`, set `this.needsUpdate = true` after assigning `outputNode`.
- Ensures renderer recompiles/rebinds after texture source or instanced UV attribute changes.

### [verification]
- `ReadLints` reports no diagnostics for:
  - `apps/circuits/src/scene/materials/StateTextureMaterialBase.ts`
  - `apps/circuits/src/scene/threeScene.ts`

## 2026-02-13 — Debug plane stale texture on level-size switch

### [diagnosis]
- Debug plane uses `DebugStateMaterial`, which rebuilt texture nodes on `setTextures(...)` but did not force a material refresh.
- On grid-size change (new `DataTexture` objects), debug plane could keep sampling previous bindings.

### [implementation]
- Updated `DebugStateMaterial._rebuildColorNode()`:
  - switched `colorNode` assignment to `outputNode`
  - set `this.needsUpdate = true`

### [verification]
- `ReadLints` reports no diagnostics for `apps/circuits/src/scene/materials/DebugStateMaterial.ts`.

## 2026-02-14 — Debug preview planes extracted from Grid

### [decision] Separate texture generation from debug rendering
- Removed debug-plane mesh/material ownership from `apps/circuits/src/scene/grid.ts`.
- `Grid` now only updates and exposes state textures (`pads`, `layer0`, `layer1`).
- Moved preview rendering into new `apps/circuits/src/scene/debugPlanes.ts` object.

### [implementation] Three always-visible mini previews
- Added `DebugPlanes` group with three plane meshes using `DebugStateMaterial` and fixed texture indices `0|1|2`.
- Wired `ThreeScene` to own `debugPlanes`, add it to scene, and update it from `updateGrid(...)`.
- Removed obsolete debug mode switching API (`debugTextureMode`, `setDebugTextureMode`) from `Grid`.

### [implementation] Placement and proportion behavior
- Planes render in board top-left world-space with margins and vertical stacking.
- Each preview plane uses board aspect (`boardWidth / boardHeight`) so bug texture proportions stay consistent with game dimensions.
- Preview size is scaled down relative to board height with width clamped for very wide boards.

### [verification]
- `ReadLints` shows no diagnostics in edited scene files.
- `pnpm exec eslint apps/circuits/src/scene/grid.ts apps/circuits/src/scene/debugPlanes.ts apps/circuits/src/scene/threeScene.ts` passes.

## 2026-02-14 — Layer-0 line darkening

### [decision]
- Added material-level brightness control in shared state-texture material pipeline so selective darkening does not modify source textures.

### [implementation]
- Updated `apps/circuits/src/scene/materials/StateTextureMaterialBase.ts` with `brightness` uniform and applied it in `outputNode`.
- Set `apps/circuits/src/scene/materials/Layer0LinesStateMaterial.ts` brightness to `0.7`.

### [verification]
- `ReadLints` reports no diagnostics for edited material files.
