# Archive - Complete Memory Log

> Commit aggressively. This log serves as proxy for memory access frequency.
> Later analysis of patterns here informs working memory pruning.

## 2026-06-14 [colors] IoColorPicker panel ownership refactor

- **pattern**: IoNumberLadderSingleton `src` — panel owns picker reference, no addEventListener/removeEventListener between picker and panel
- **IoColorPanel**: `src` property, `expandedChanged` clears src, `onValueInput` calls `src.onPanelValueInput()`
- **IoColorPicker**: `expanded` = `Panel.src === this && Panel.expanded`; collapse/disconnect clear src synchronously
- **removed**: `_panelListening`, `removePanelListeners`, `onPanelExpandedChanged`, value reset to white on collapse

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

## 2026-06-14 [ongoing] D5-D7, E2/E4, F2/F3 roadmap items

### CI/lint/releases (D5-D7)
- CI split into parallel lint (`lint:check`), build (`build:ci`), test jobs; bundle only on main push
- Removed docs/** paths-ignore; aligned pnpm to 9.5.0 via packageManager + pnpm/action-setup
- bundle.js parallelized with Promise.all
- Changesets: config, release workflow, version-packages/release scripts
- ESLint: ban-ts-comment enabled (tests/demos exempt), no-explicit-any warn, no-unused-expressions warn

### Tests (E2/E4)
- Menus: IoMenuItem, IoContextMenu, IoMenuOptions, IoMenuTree tests
- Markdown: sanitize + theme tests
- Navigation: IoNavigatorDrawer tests
- Editors: IoPropertyLink, IoBreadcrumbs, IoContextEditorSingleton tests
- Layout: IoTabDragIcon singleton tests

### Docs (F2/F3)
- TSDoc on ReactiveNode, IoElement, StorageNode, Color
- TypeDoc config + docs:api script; docs/api-reference.md guide



## 2026-06-14 [benchmark] ChangeQueue Vitest bench harness

- Vitest projects: `unit` (browser tests) + `bench` (Node `*.bench.ts`)
- `pnpm bench` with `--compare`/`--outputJson` on `benchmarks/results.json` (CLI flags; project config alone did not write JSON)
- `ChangeQueue.bench.ts` + `bench-setup.ts` (rAF/ResizeObserver/HTMLElement polyfills for Node)
- All `test:*` scripts use `--project unit` to exclude bench files
- Commented CI bench job stub in ci.yml

- **C1**: IoGL caches `gl.getUniformLocation` per program via `uniformLocationsCache` WeakMap
- **C6**: ChangeQueue uses `#changeIndex` Map for O(1) property lookup instead of `findIndex`
- **D1**: `pnpm dev` runs `build:watch` (tsc -b -w) and `dev:server` (vite) in parallel
- **D2**: Removed machine-specific `three` pnpm override; added `three` devDependency to @io-gui/three; fixed index.html three import paths to node_modules
- **F1**: Updated CONTRIBUTING.md, io-gui.mdc, README.md (Vitest, ReactiveNode, dist/, @io-gui/core npm badge)

## 2026-06-14 [technical] layout tests fromJSON → applyJSON
- **Problem**: 26 tests failed with `fromJSON is not a function` in Tab/Panel/Split tests
- **Cause**: Serialization refactor renamed `fromJSON` to `applyJSON` on ReactiveNode subclasses; tests not updated
- **Fix**: Updated layout test files to call `applyJSON` instead of `fromJSON`

## 2026-06-14 [testing] Test safety net E3 + E1

- **E3**: Added `@vitest/coverage-v8`, dedicated `coverage` vitest project for core, `pnpm test:coverage` script with thresholds (lines 74%, statements 73%, functions 78%, branches 58%)
- **E1**: Added `@io-gui/three` smoke tests — ToolBase (viewport registration + pointerTo3D NDC math), ViewCameras (camera select, overscan, frameObject, scene cameras), IoThreeViewport (tool swap via change queue)
- Added `coverage/` to `.gitignore`

## 2026-06-14 [technical] Core refactors A2/A3/A5

- **A2**: Decomposed `setProperty` into `applyPropertyBinding`, `applyNodeArrayAssignment`, `disconnectPropertyValue`, `connectPropertyValue`, `debugPropertyType`
- **A3**: Consolidated object/NodeArray mutation listeners to node level (`ensureWindowMutationListener`, `ensureSelfMutationListener`); removed per-Observer window/self flags; cleanup in `dispose()`
- **A5**: `setProtoListeners` registers last-wins per event (subclass replaces parent); synthetic events expose `stopPropagation`/`stopImmediatePropagation`; bubbling uses shared `visited` Set and path push/pop
- Tests updated/added in EventDispatcher.test.ts and ReactiveNode.test.ts; all 185 core tests pass

## 2026-06-14 — A1 ReactiveNode/IoElement unification

- **category:technical** Created `ReactiveCore.ts` with `initReactiveOwnerInternals`, `isReactiveOwner`/`isIoValue`, shared parent graph (`addParent`, `removeParent`, `detachChildParents`)
- **category:technical** IoElement now initializes `_parents` and exposes `addParent`/`removeParent`; constructor internals deduplicated via `initReactiveOwnerInternals`
- **category:technical** Parent wiring uses `isIoValue` everywhere (setProperty connect/disconnect, initReactiveProperties, NodeArray, Storage) — IoElement children get `addParent()` like ReactiveNode
- **category:technical** ChangeQueue `#invokeMutation` now runs for all reactive owners (elements included)
- Tests added for IoElement parent graph; 186 core tests pass

## 2026-06-14 — Package layer plan decomposition

- **category:technical** Created `.cursor/plans/package_layer.plan.md` decomposing roadmap B1–B3, C4–C5 into 15 itemized todos with codebase context
- **category:technical** B1: IoTab imports IoContextEditorSingleton from editors — propose `io-context-editor-expand` event + app-level handler
- **category:technical** B2: 8+ elements duplicate pointer capture/move/up; clamp duplicated in IoSlider/IoSliderBase
- **category:technical** B3: IoSlider extends IoGl not IoSliderBase (~200 lines dup); IoSliderRange/2d already extend Base
- **category:technical** C4: IoNumberSlider/Split/TabDragIcon/PropertyEditor full re-render on changed()
- **category:technical** C5: IoTabDragIcon detectDropTargets querySelectorAll+getBoundingClientRect per pointermove

## 2026-06-14 — Core package docs/tests/bench plan

- **category:technical** Created `.cursor/plans/core_docs_tests_bench.plan.md` — 20 todos (one per class in packages/core)
- **category:technical** Audit: 23 classes, 16 test files ~177 cases, 1 bench (ChangeQueue)
- **category:technical** Principles: concise TSDoc (code is documentation), smoke+unit expansion, bench hot paths only
- **category:technical** Largest gaps: IoSpan (no tests), IoElement (6 tests), IoOverlay (1 test), Observer/RPI (indirect only)
- **category:technical** Bench targets: ReactiveNode, NodeArray, EventDispatcher, IoElement, Binding; optional VDOM module bench

## 2026-06-14 — Core docs/tests/bench implementation

- **category:technical** Implemented full core_docs_tests_bench plan: 225 tests (+48), 8 bench files
- **category:technical** Trimmed verbose TSDoc on ChangeQueue, Binding, ProtoChain, ReactiveProperty, Color, Theme, Storage
- **category:technical** New tests: IoSpan, demos smoke, Observer/RPI/ProtoProperty describes, IoElement render/traverse, expanded Binding/Overlay/Color/Storage
- **category:technical** bench-setup.ts expanded with window/document/customElements/self mocks for Node benchmarks
- **category:technical** Bench files use relative imports to avoid barrel side-effects (Theme/Storage init)
- **category:technical** Removed Theme.ts debug console.log; restored ThemeJSON export

## 2026-06-14 — Core tests/bench implementation

- **category:technical** Implemented remaining core plan tests/benches: 224 tests pass (`pnpm test:core`)
- **category:technical** New files: IoSpan.test.ts, demos.test.ts, 6 bench files (IoElement, EventDispatcher, Binding, NodeArray, VDOM)
- **category:technical** IoSyntheticEvent.path accumulates per bubble target — copy path in handlers (shared array popped after dispatch)
- **category:technical** Double Register on same class throws (Cannot redefine _protochain) — test uses fresh class instead
- **category:technical** IoElementInspectorDemo constructor fails in ready() — demo smoke uses class prototype check only
- **category:technical** 2026-06-14: build/build:ci now run lint:check before tsc; bundle simplified to build + bundle:packages
- **category:technical** ESLint ignores **/*.bench.ts and **/bench-setup.ts (match tsconfig exclude); fixed 3 unused-var errors in tests

## 2026-06-14 — Phase 1 no-explicit-any fixes

- **category:technical** Implemented reduce_explicit_any plan Phase 1: 14 files, 15 one-line type fixes
- **category:technical** Patterns: remove stray `as any`, `ListenerDefinitions` return types, `HTMLElement`/`IoOverlay`/`IoNumberLadderStep` casts, `Record<string, unknown>`, marked token shape
- **category:technical** Lint warnings 338→329; core/menus/inputs tests pass

- **category:technical** Implemented reduce_explicit_any plan Phase 2: Property, Queue, Binding helpers, IoGL, sliders, IoSwitch
- **category:technical** Patterns: `unknown` at boundaries; `CallbackFunction` wrapper for nextQueue; IoGL vec narrowing via `Record<string|number, number>`; slider `inputValue` typed to reactive value
- **category:technical** Lint warnings 329→315; core/inputs/sliders tests pass

## 2026-06-14 — Phase 3 MenuDOMUtils no-explicit-any

- **category:technical** Added `MenuDOMNode` interface (depth, disabled, expanded, $options, $parent) in MenuDOMUtils.ts
- **category:technical** Replaced all 18 `as any` casts; removed TODO; explicit undefined guard in depth sort; IoMenuElementType casts for querySelectorAll results
- **category:technical** menus tests pass (31)

## 2026-06-14 — Phase 4 component/editor no-explicit-any

- **category:technical** IoButton/IoField: `unknown` for value, action callback, inputValue, WithBinding
- **category:technical** IoPropertyLink: `NamedValue` interface for name/title/id lookup
- **category:technical** EditorConfig: `makeSelect` typed with `MenuOptionProps` wire array type
- **category:technical** NodeArray: `N[]` constructor args, `unknown` proxy set value, `Reflect.get/set`, `target.length = newLength`
- **category:technical** Storage: `unknown` for value/default/def; `Record<string, string>` for hashValues
- **category:technical** core (225), inputs (51), editors (49) tests pass

## 2026-06-14 — Phase 5 Binding/EventDispatcher no-explicit-any

- **category:technical** Binding: `Record<string, T>` for get/set/onTargetChanged/onSourceChanged; `Record<string, unknown>` for dispose deletes — zero `any` left in file
- **category:technical** EventDispatcher: `IoSyntheticEvent.detail: unknown`; no call-site changes needed (compile-clean)
- **category:technical** core tests pass (225)

## 2026-06-14

- **category:technical** Verified no-explicit-any pass: 338→259 warnings (−79); production 225→146 (−79); tests/demos unchanged (91/22)
- **category:technical** pnpm lint clean (0 errors, 265 total warnings incl 6 max-len); all targeted tests pass: core 225, menus 31, inputs 51, editors 49, sliders 25
- **category:technical** ESLint: `@typescript-eslint/no-explicit-any: off` for `**/*.test.ts`, `**/*.bench.ts`, `**/bench-setup.ts` — lint 265→174 total warnings
- **category:technical** ReactiveNode.ts: removed all `any`; added PropertyValues, DisposableInternals, constructType(); AnyConstructor → `new (...args: never[]) => object`; fixed copy() io-value branch; minimal ReactiveProperty/Storage updates for constructType
- **category:technical** Fixed ProtoChain TDZ runtime error from "Improved types" commit: ReactiveProperty importing constructType from ReactiveNode created circular module init (IoElement→ReactiveProperty→ReactiveNode→IoElement). Reverted to local constructor casts in ReactiveProperty; ReactiveCore DisposableInternals deps changed to import type only.
- **category:technical** Fixed duplicate io-object-mutation listener warnings: applyNodeArrayAssignment changed `value.constructor !== Array` to `Array.isArray(value)`, causing NodeArray→NodeArray assignments (e.g. IoTabs.tabs = panel.tabs) to copy via push inside withInternalOperation — length=0 skipped listener removal, push re-added itemMutated. Fix: skip copy path when `value instanceof NodeArray`, restore reference assignment via setProperty.
- **category:technical** IoElement.ts: removed all `any`; aligned with ReactiveNode (PropertyValues, unknown); added ResizeObservable interface for onResized; style uses setProperty; render host uses `??` instead of `as any` cast.
- **category:technical** ProtoChain.ts: removed all `any`; properties → Record<string, unknown>; dynamic handler access via `as unknown as Record<string, unknown>`; validateReactiveProperties uses direct primitive type checks instead of indexOf+any cast.
- **category:technical** ReactiveProperty.ts: removed all `any`; value/init → unknown; Observer.start/stop → unknown; decodeInitArgument with safe Record traversal; toJSON typed inline; primitive type debug check uses direct equality. Downstream: ReactiveNode toJSON/applyJSON/setAttribute narrowing; IoGL initPropertyUniform Array.isArray guard.
- **category:technical** Added Queue.bench.ts covering debounce/throttle (unique + coalesce), node-scoped variants, clearNodeQueue, and mixed workload. Follows ChangeQueue.bench.ts pattern; uses noop callbacks and BenchQueueNode.
- **category:technical** Restored TodoMVC demo: originally `packages/core/src/demos/todomvc/` → `apps/todo/` (d5b26321) → deleted with all apps (e76225b4). Restored from e76225b4^ back to `packages/core/src/demos/todomvc/`.
- **category:technical** Added `packages/core/src/demos/benchmarks/IoBenchmarksDemo.ts` — fetches `/benchmarks/results.json`, renders grouped tables (rank, name, throughput, mean, median, RME, samples). Wired into main index.html nav as "Benchmarks".
- **category:technical** Vite 8 + Rolldown bundle stripped copyright: when `minify: 'terser'`, Rolldown sets `comments.legal: false` (because `!options.minify` is false). Terser comment regex alone insufficient — legal comments already gone before terser. Fix: `rollupOptions.output.comments: { legal: true }` + `banner` from entry `/*! ... */` block via `readLicenseBanner()`. Also restored markdown externals accidentally removed locally.
- **category:technical** Post-update TS error: `@types/node@25.6.0` path not found but packageId `@25.9.3` — stale implicit type library resolution. Fix: `"types": []` in root tsconfig (browser packages don't use Node APIs; @types/node only needed for root tooling).
