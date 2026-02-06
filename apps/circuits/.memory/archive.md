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
