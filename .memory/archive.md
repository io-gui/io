# Archive — compressed decisions & gotchas - keep commiting memory here aggressively - never delete unless instructed!

## Patterns

### Io events — bubbling + static Listeners
Source: `dispatch(name, detail, true)`. Consumers: `static get Listeners()` maps event → handler. No manual add/remove in `ready()`.

### IoColorPicker / IoColorPanel — panel owns picker via `src`
Pattern from IoNumberLadderSingleton: panel holds `src` ref to active picker; picker `expanded` = `Panel.src === this && Panel.expanded`. Collapse/disconnect clear `src` synchronously. No addEventListener between picker and panel.

### VDOM keyed reconciliation — opt-in only (incomplete implementation)
Per-child `props.key` → match-and-move; stored as non-enumerable `_vdomKey`; never applied as DOM prop/attribute. Unkeyed siblings in keyed lists fall back to positional tag match. Default templates unchanged (positional).

### VDOM children — arrays internally
`VDOMElement.children` is `Array<VDOMChild> | undefined` only. String sugar at factory boundary (`span('text')` → `children: ['text']`). `text()` uses `TEXT_TAG = '#text'`; traverse uses `childNodes` for mixed text+element siblings.

### Monorepo build
See `working.md`. Extra: `clean` must remove `tsconfig.tsbuildinfo` or incremental emit skips stale packages.

## Gotchas

### EventDispatcher — diamond / dual-path dedupe
Shared `visited` set per dispatch prevents duplicate delivery when one ancestor is reachable via multiple parent branches or synthetic+DOM overlap on the same IoElement boundary.

### NodeArray — listener duplication traps
- Assigning `NodeArray → NodeArray`: must skip copy-via-push path (`value instanceof NodeArray`) or kept items get duplicate `io-object-mutation` listeners.
- In-place filter: use `splice(0, length, ...items)`, not `length = 0` + `push` inside `withInternalOperation` (push re-adds listeners proxy skipped on length).

### Serialization / hydration
- `ReactiveNode.toJSON` must include primitives (strings/booleans) or wire items become `{}`.
- `NodeArray.applyJSON` must grow/shrink safely; empty arrays must not call `.applyJSON` on undefined slots.
- Storage catch must rehydrate to domain types, not leave raw JSON strings on the model.

### Module init — ProtoChain TDZ
`ReactiveProperty` importing runtime `constructType` from `ReactiveNode` creates circular init (IoElement → ReactiveProperty → ReactiveNode → IoElement). Use local constructor casts in ReactiveProperty; `import type` only in ReactiveCore deps.

### Tests & types
Vitest (esbuild) does not typecheck — run `pnpm build` after adding typed tests.

### IoSyntheticEvent.path
Shared array mutated during bubble (push/pop per target). Handlers that retain path must copy it.

### Double `@Register` on same class
Throws (`Cannot redefine _protochain`). Tests need fresh anonymous classes.

### Vite 8 / Rolldown bundle — license banner
With `minify: 'terser'`, Rolldown sets `comments.legal: false` before terser runs. Fix: `rollupOptions.output.comments: { legal: true }` + entry `banner` via `readLicenseBanner()`.

### Dev import map — bare `three`
OrbitControls imports `from 'three'`. Import map needs `"three": "./packages/three/node_modules/three/build/three.webgpu.js"`, not only `three/webgpu` paths.

### Root tsconfig types
`"types": []` avoids stale implicit `@types/node` resolution when package versions drift.

## Operational

### Vitest bench beforeEach trap
- `beforeEach` in bench options runs **per sample**, not once per task — heavy setup (node trees, 1000 items) → 60s+ timeout + console flood.
- Use `beforeAll`/`afterAll` for expensive fixtures; lightweight `beforeEach` only for reset.
- Binding bench: 500 bindings → same 10 target props = "Improper usage detected!" spam (debug block). Each binding needs own target nodes.
- `testTimeout: 120_000` on unit project for full suite (~3min browser bench).

### Vitest v5 bench (beta.5)
- `bench` fixture inside `test()` — no top-level `bench` import; use `benchSuite()` helper.
- Browser instances need unique `name` (≠ project name): `unit-chromium`, `coverage-chromium`.
- No separate bench project — `benchmark.include` on unit project; `vitest bench` auto-spawns `unit (bench)`.
- `--compare` / `--outputJson` removed; use `--reporter=json --outputFile=` or `bench.from()` + `writeResult`.
- JSON reporter format changed: `testResults[].assertionResults[].benchmarks[].tasks[].latency` (mean/p50/rme); old was `files[].groups[].benchmarks[]` flat stats. IoBenchmarksDemo normalizes both.

### io-three ToolBase pointers
Per-viewport `WeakMap`s for hover/active; resolve viewport from `event.currentTarget`.

### Json type refactor review (Jun 19)
`Json` changed from object-interface to value-union (`JsonPrimitive|JsonObject|JsonArray`, +null). Compiles clean. Found: NodeArray.ts stale LOCAL `interface Json` shadowing import (user fixed). Pre-existing debug bug in ReactiveNode.applyJSON: `if (type === jsonObject.constructor)` always compared to Object + inverted. FIXED → `if (type && jsonObject[name]?.constructor !== type)` (guard `type` because `type?: AnyConstructor` optional; untyped props like MenuOption.value would over-warn). Also tightened locals `out`/`primitiveProps` to `JsonObject` (return type stays `Json` for subclass overrides like MenuOption `toJSON(): Json`). EditorConfig double-cast left as-is: MenuOptionProps has non-JSON fields (action fn, any) so toJSON can't narrow to it. All core/layout/menus tests pass.
