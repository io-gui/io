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
