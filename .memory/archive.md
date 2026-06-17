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

### Vitest bench split
- `unit` project: browser tests; all `test:*` use `--project unit`.
- `bench` project: Node-only, `--run`, no watch/browser.
- `bench:baseline` → `results-baseline.json`; `bench` compares and writes `results.json`.
- Bench files: relative imports to avoid barrel side-effects (Theme/Storage init); ESLint/tsconfig exclude `*.bench.ts`.

### io-three ToolBase pointers
Per-viewport `WeakMap`s for hover/active; resolve viewport from `event.currentTarget`.
