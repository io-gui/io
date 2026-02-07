# Working Memory - Circuits App

## Architecture

### File Structure

```
src/
  CircuitsApp.ts     — root, Storage routing ($page hash, $level local), score persistence
  CircuitsLevels.ts  — 96 level buttons, completed state display
  CircuitsGame.ts    — toolbar + board + bottombar, owns Game instance
  CircuitsBoard.ts   — 4 layered canvases, Scene, pointer/plotter logic, ResizeObserver
  CircuitsEditor.ts  — canvas tool/color picker modal overlay
  game/
    game.ts          — pure state machine, callbacks for save/complete
    scene.ts         — accepts canvas refs via init(), no DOM queries
    score.ts         — pure data container, toJSON/fromJSON
    pad.ts           — unchanged from reference (renamed from pin)
    line.ts          — unchanged from reference
    color.ts         — unchanged, moved from app/
```

### Key Patterns

- Page switching via CSS `:host[page="levels"]` / `:host[page="game"]` attribute selectors
- Storage bindings: `$page` (hash) for routing, `$level` (local) for current level
- Game class uses `onSave`/`onComplete` callbacks (not on IoElement, so no auto-bind conflict)
- CircuitsGame uses `saveFn`/`completeFn` (avoids io-gui `on[A-Z]` auto-bind on element)
- PointerEvents with `setPointerCapture` replace touch/mouse abstraction
- `onResized()` on CircuitsBoard triggers canvas re-init (io-gui built-in ResizeObserver)
- Editor canvas init deferred to first `active=true` via `requestAnimationFrame`

### What Was Removed (absorbed into IoElements)

- `app/bindings.ts` → Listeners + @event handlers in VDOM
- `app/navigation.ts` → Storage hash routing
- `app/touches.ts` → PointerEvents
- `app/local.ts` → Storage + direct localStorage
- `app/resize.ts` → CSS flex + onResized
- `game/plotter.ts` → CircuitsBoard pointer handlers

### io-gui Gotchas Discovered

- Methods named `on[A-Z]*` are auto-bound by ProtoChain — don't use for callback properties on IoElements
- `render()` with same VDOM structure efficiently diffs (no canvas recreation)
- `static get Listeners()` return type should be `Record<string, string>`
- `dispatch(type, detail, bubbles)` — set `bubbles=true` for events that cross element boundaries
