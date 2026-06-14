# Archive - Complete Memory Log

> Commit aggressively. This log serves as proxy for memory access frequency.
> Later analysis of patterns here informs working memory pruning.

## Log Format

```
## YYYY-MM-DD
### [category] Title
Content...
```

---

## 2026-02-02

### [meta] Memory system initialized

Created three-tier memory architecture for io-gui development:

- `now.md` - hot context, aggressive pruning, current focus only
- `working.md` - persistent curated memory
- `archive.md` - complete log for access pattern analysis

### [meta] Memory strategy derived from Moltbook experiments

Key patterns adapted from agent memory research (Moltbook Memory Canon):

- Three-tier architecture (hot/curated/archive)
- Aggressive pruning of hot context
- Archive as proxy for access frequency analysis
- "Memory without structure becomes noise"
- Write immediately, don't rely on mental notes
- Checkpoint decisions (reasoning), not just state (conclusions)

### [architecture] Considered but rejected: tiered storage in io-gui runtime

Initially confused project memory with framework runtime patterns.
StorageNode handles runtime persistence (localStorage/hash).
Memory architecture is for development context, not app state.

### [meta] Memory commit guidelines clarified

- Archive: extremely aggressive, after every response, never ask permission
- Now: aggressive, updated frequently, pruned often
- Working: conservative, only what feels important and persistent
- Archive never loaded into context unless explicitly asked
- Working memory pruning based on archive patterns is future work

### [meta] Created io-gui memory system

memory patterns to io-gui development context.
Three files: now.md, working.md, archive.md
Added to .gitignore (can be tracked later if desired)

## 2026-02-07

### [pattern] Io events: bubbling + Listeners, not listener wrangling

User refactored Game event consumer code: use `dispatch(..., true)` from source node; consumers declare `static get Listeners()` mapping event names to handler methods. Avoid manual addEventListener in ready(), \_gameForListeners, \_wireGameCallbacks, and add/remove when game instance changes. Promoted to working memory.

## 2026-02-14

### [fix] Core synthetic bubbling dedupe for shared ancestors

Patched `packages/core/src/core/EventDispatcher.ts` to prevent duplicate event delivery when one bubbling dispatch reaches the same ancestor through multiple parent branches (diamond graph / cross-tree links). Added a per-dispatch `visited` set in `dispatchEvent()` and skipped recursion to parents already visited. Added regression test in `packages/core/src/core/EventDispatcher.test.ts` that asserts a shared root only receives one bubbling event hit.

### [fix] Core dedupe for synthetic+DOM overlap on EventTarget boundary

Extended `EventDispatcher` dedupe so a synthetic dispatch converted to native `CustomEvent` on an `IoElement` does not re-hit ancestors already reached via the synthetic graph in the same dispatch. Added `hasVisitedDomAncestor()` and set native event `bubbles` to false when a visited DOM ancestor exists. Added regression test covering overlap case (`ReactiveNode` bubbling via direct parent + child `IoElement` DOM bubble) to ensure one delivery.

## 2026-03-29

### [fix] io-three ToolBase hover pointer bookkeeping

Updated `packages/three/src/nodes/ToolBase.ts` so hover pointers accumulate by `pointerId` and `on3DPointerHover()` receives the full hover set instead of a single pointer. Pressed pointers now move from `_hoverPointers` to `_activePointers` on `pointerdown`, and hover state is cleaned up through `pointerleave`, `pointerout`, `pointercancel`, `pointerup`, and `lostpointercapture`.

Build verification: `pnpm build` in `packages/three` passed. Targeted tests via `pnpm test:three` reported no matching test files in that package.

### [fix] io-three ToolBase pointer state isolated per viewport

Refined `packages/three/src/nodes/ToolBase.ts` so hover and active pointer records are no longer global to the tool instance. They now live in viewport-keyed `WeakMap`s and each pointer event resolves its source viewport from `event.currentTarget`, which keeps hover/move/down/up payloads isolated to the viewport that emitted the event.

## 2026-06-12 [technical] Roadmap C2: VDOM keyed diffing + render allocation reduction
- Split `IoElement.traverse` into `_reconcileKeyedChildren` / `_reconcilePositionalChildren` + shared `_updateElementProps`; common second pass ($ ids, children recursion) unchanged.
- Keyed path: map existing children by `_vdomKey`, match by key+tag, `insertBefore` to move; unkeyed children in keyed lists fall back to positional tag match guarded by `getElementKey(candidate) === undefined`; leftovers guaranteed past vChildren.length, removed+disposed at end.
- Decision on roadmap open question: minimal `key` opt-in (per-child, props.key), not full keyed reconciliation by default — zero behavior change for existing templates.
- `key` skipped in both `applyProperties` and `applyNativeElementProps` so it never leaks as expando/attribute; stored in `constructElement` via defineProperty.
- Allocation reduction: `filterVDOMElements` returns same array if no nulls; `this.$` cleared in place (delete loop) instead of `this.$ = {}`.
- 9 new tests in VDOM.test.ts (reorder reuse native+IoElement, mid-list insert/remove, mixed keyed/unkeyed, tag change recreate, $ map across keyed renders, null children, filter identity). Full suite 773 pass; core build + lint clean.
- Gotcha: `tsc` caught test type errors vitest didn't (vitest uses esbuild, no typecheck) — always build after adding typed tests.

## 2026-06-14 [technical] A4 leak/cleanup fixes (leak-fixes)

- Parent graph: `_children` inverse index on ReactiveNode/IoElement; `addParent`/`removeParent` maintain both sides; `detachChildParents` on dispose clears stale child `_parents` refs.
- Queue: `clearNodeQueue(node)` removes pending queue entries + `keysByNode`/`throttleNextFrame` WeakMap entries on dispose.
- VDOM: `releaseEventDispatcher`, `releaseSubtreeEventDispatchers`, `clearNativeElementChildren` — native VDOM subtrees cleared via `textContent`/flatten no longer orphan EventDispatchers.
- IoContextMenu: `_listenerParent` + `releasePointerListeners` for disconnect mid-gesture; IoColorPicker: `removePanelListeners` + disconnectedCallback; IoMenuOptions: collapse on disconnect.
- Tests: ReactiveNode dispose parent detach, VDOM EventDispatcher release, EventDispatcher test updated for cleaned `_parents`.

## 2026-06-14 [packaging-builds] D3+D4 packaging metadata + incremental builds

- **exports**: all packages now resolve to `dist/index.js` + `dist/index.d.ts` (was inconsistent src/dist)
- **sideEffects**: narrowed from `true` to elements/nodes/configs globs for tree-shaking
- **incremental**: `composite: true` per package, root `tsc -b` with project references, `build:watch` script
- **clean**: removes `tsconfig.tsbuildinfo` alongside dist (stale buildinfo caused false "up to date")
- **bundle externals**: markdown keeps marked/dompurify external (moved to dependencies); three externalizes all `three/*`
- **type fixes exposed by composite**: exported `Json` from ReactiveNode; MenuOption `override toJSON(): Json`; IoMarkdown uses `$ThemeID.value` not `ThemeSingleton.themeID`
- **three**: added missing `@io-gui/inputs` dev+peer dep and tsconfig reference

## 2026-06-14 [build] noImplicitOverride fix

- **cause**: `noImplicitOverride: true` in root tsconfig triggered 261 TS4114 errors across all packages
- **fix**: added `override` to static getters (Style, Listeners, GlUtils, etc.), lifecycle methods (changed, ready, dispose, connectedCallback), and event handlers (onPointerdown, onKeydown, etc.)
- **build**: `pnpm build` passes cleanly
