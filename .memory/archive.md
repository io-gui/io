# Archive — compressed decisions & gotchas - keep commiting memory here aggressively - never delete unless instructed!

## Patterns

### IoMarkdown — DOMPurify strips iframes by default
- `purify.sanitize(md)` removes `<iframe>` → video embeds vanish (not a code regression, DOMPurify default)
- Fix: pass config `{ADD_TAGS:['iframe'], ADD_ATTR:['allow','allowfullscreen','frameborder','scrolling']}` + `uponSanitizeElement` hook restricting iframe src to TRUSTED_IFRAME_HOSTS (youtube/vimeo). Untrusted iframe → removeChild.
- Tests added for trusted-keep / untrusted-strip.

### NodeArray.dispose
- Don't use `this.splice()` in dispose — override always dispatches mutation
- Use manual listener/parent cleanup + `withInternalOperation(() => super.splice(...))` — proxy length set respects internal op flag
- Parent `dispose()` must call `NodeArray.dispose()` BEFORE `detachChildParents()` — avoids double removeParent warnings, disposes array children

Source: `dispatch(name, detail, true)`. Consumers: `static get Listeners()` maps event → handler. No manual add/remove in `ready()`.

### IoColorPicker / IoColorPanel — panel owns picker via `src`
Pattern from IoNumberLadderSingleton: panel holds `src` ref to active picker; picker `expanded` = `Panel.src === this && Panel.expanded`. Collapse/disconnect clear `src` synchronously. No addEventListener between picker and panel.

### VDOM keyed reconciliation — opt-in only (incomplete implementation)
Per-child `props.key` → match-and-move; stored as non-enumerable `_vdomKey`; never applied as DOM prop/attribute. Unkeyed siblings in keyed lists fall back to positional tag match. Default templates unchanged (positional).

### VDOM children — arrays internally
`VDOMElement.children` is `Array<VDOMChild> | undefined` only. String sugar at factory boundary (`span('text')` → `children: ['text']`). `text()` uses `TEXT_TAG = '#text'`; traverse uses `childNodes` for mixed text+element siblings.

### Monorepo build
See `working.md`. Extra: `clean` must remove `tsconfig.tsbuildinfo` or incremental emit skips stale packages.

### MenuOption.pathChanged — invalid path leaf resilience
Hash path like `Docs,Deep Dive,Asynchronou Dispatch` (misspelled leaf) used to select nothing — old code took only last segment, findItemById fail → blank page. Fix: walk path segments back-to-front, select deepest id that findItemById resolves. Invalid leaf falls back to valid ancestor; invalid intermediate still resolves via globally-unique leaf id. URL self-corrects via updatePaths.

## Gotchas

### EventDispatcher — diamond / dual-path dedupe
Shared `visited` set per dispatch prevents duplicate delivery when one ancestor is reachable via multiple parent branches or synthetic+DOM overlap on the same ReactiveElement boundary.

### NodeArray — listener duplication traps
- Assigning `NodeArray → NodeArray`: must skip copy-via-push path (`value instanceof NodeArray`) or kept items get duplicate `io-mutation` listeners.
- In-place filter: use `splice(0, length, ...items)`, not `length = 0` + `push` inside `withInternalOperation` (push re-adds listeners proxy skipped on length).

### Serialization / hydration
- `ReactiveNode.toJSON` must include primitives (strings/booleans) or wire items become `{}`.
- `NodeArray.applyJSON` must grow/shrink safely; empty arrays must not call `.applyJSON` on undefined slots.
- Storage catch must rehydrate to domain types, not leave raw JSON strings on the model.

### Module init — ProtoChain TDZ
`Property` importing runtime `constructType` from `ReactiveNode` creates circular init (ReactiveElement → Property → ReactiveNode → ReactiveElement). Use local constructor casts in Property; `import type` only in ReactiveCore deps.

### Tests & types
Vitest (esbuild) does not typecheck — run `pnpm build` after adding typed tests.

### IoSyntheticEvent.path
Shared array mutated during bubble (push/pop per target). Handlers that retain path must copy it.

### Double `@Register` on same class
Throws (`Cannot redefine _protochain`). Tests need fresh anonymous classes.

### Missing `@Register` — vConstructor factory check
`ProtoChain.init()` throws on `new UnregisteredClass()` only.
Added debug check in `ReactiveElement.Register()` vConstructor: `this !== ioNodeConstructor` → warn (inherited parent factory called on subclass).

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

### Docs sync to ADRs 0001-0004 (Jun 26)
Audited docs vs ADRs. Source already implements all 4. Found stale only in docs/deep-dive.md + docs/quick-start.md + layout/README:212. Fixed: ReactiveNode(base)→ReactiveObject, ReactiveElement→ReactiveElement, @Property/ReactiveProperties→@Property/Properties, catch-all changed()/change()→mutated(), `new Storage()`→`Storage()` (factory returns Binding). Kept: `ReactiveNode`=graph union (correct), `ReactiveElementProps` type (legit export, NOT stale). core/README already fully correct. io-gui.mdc rule already updated.

### Docs: Cross-Domain Reactivity feature writeup (Jun 26)
User wants the "three parent/child relations" gap sold as a real feature (not a doc bug). Core facts verified in src: reactive graph `_parents`/`_children` edges created ONLY via addParent/removeParent, sourced from node-valued props (ReactiveObject.ts:300) + NodeArray items — NOT from VDOM children/DOM. EventDispatcher.dispatchEvent walks node._parents (line 365) recursively for synthetic bubbling; elements also fire `composed` native CustomEvent → DOM bubbling. Circuit breaker = `visited: Set<ReactiveNode>` (line 320-323): re-entry into visited node returns early → safe diamonds/cycles/multi-parent. `hasVisitedDomAncestor` (line 78-86) suppresses native DOM bubble when a DOM ancestor already visited by synthetic walk → no double-fire across domains. Multi-parent: `_parents` is array; one node held by multiple props/arrays/owners (mix of objects+elements). Added "Cross-Domain Reactivity" section to docs/deep-dive.md (after Reactive Data Flow), glossary "Graph & propagation" to CONTEXT.md, intro paras to root README.md + quick-start.md, note to CONTRIBUTING.md, framed layout/README table as concrete example. Tone: "distinctive/uncommon", no overhype.

### Json type refactor review (Jun 19)
`Json` changed from object-interface to value-union (`JsonPrimitive|JsonObject|JsonArray`, +null). Compiles clean. Found: NodeArray.ts stale LOCAL `interface Json` shadowing import (user fixed). Pre-existing debug bug in ReactiveNode.applyJSON: `if (type === jsonObject.constructor)` always compared to Object + inverted. FIXED → `if (type && jsonObject[name]?.constructor !== type)` (guard `type` because `type?: AnyConstructor` optional; untyped props like MenuOption.value would over-warn). Also tightened locals `out`/`primitiveProps` to `JsonObject` (return type stays `Json` for subclass overrides like MenuOption `toJSON(): Json`). EditorConfig double-cast left as-is: MenuOptionProps has non-JSON fields (action fn, any) so toJSON can't narrow to it. All core/layout/menus tests pass.

### polygone.art AssetInfo types (Jun 30)
Added `src/asset-info.ts`. Initial enums were hallucinated; corrected to Poly API v1 (20201006): license/visibility/formatType/colorSpace from poly-api.json. Nested types PolyFile/Format/PresentationParams/Quaternion. AssetInfo = blob mirror shape (name, authorId, tags, likes + Poly fields).

### Layout grill-with-docs (Jul 2)
Grilling session on @io-gui/layout. User chose scope=target_incremental (define target+docs now, apply refactor incrementally), then skipped remaining forks → adopted my recommendations.
Docs created: root CONTEXT-MAP.md (Core+Layout contexts); packages/layout/CONTEXT.md (glossary: Split/Panel/Tab/Orientation/Flex/Content element/Selection/Consolidation/Normalization/Split direction/Divider/Drawer/Overflow); packages/layout/docs/adr/0001 (structural logic belongs in models, seam=DOM-dependency), 0002 (proposed: reactive per-Split normalize() in childrenMutated replacing io-panel-remove/io-split-remove/io-split-consolidate DOM events).
Key finding — REAL BUG (fixed): IoTab drag used `this.closest('io-split[root]')` but NO element ever sets a `root` attribute → detectDropTargets skipped in production, drops silently no-op. Tests passed only because they set dropTarget manually. Fixed by walking ancestors to outermost io-split in IoTab.onPointermove.
Other fixes: nodes/flex.ts (DEFAULT_FLEX + isValidFlex) centralizes duplicated flex regex; Panel.flexChanged logged "Split:" (copy-paste) → "Panel:"; models use DEFAULT_FLEX const.
Findings NOT yet fixed (candidate future work): fat elements hold structural ops (moveTabToSplit/convertToSplit/consolidateChild/ensureOneHasFlexGrow/add/removeTab); invariants scattered; IoTabDragIconSingleton holds IoPanel refs (leak/removed-mid-drag risk); tab `id` dual role (identity + content key); parseFlexBasis magic 240 default; Split.dispose sets children.length=0 without recursive dispose. 411 layout tests pass.

### Layout grill session #2 (Jul 2)
[decision] Root identity: user chose EXPLICIT Layout model + IoLayout view over my rec (b: derived root-ness via _parents). Rationale space: Layout gives tree-scope ops/invariants an owner (moveTab across panels, "panel survives", maybe elements pool, persistence root). Term "Layout" added to packages/layout/CONTEXT.md. ADR deferred until Layout responsibilities pinned.
[decision] Disposal: NodeArray.dispose(deep=true) default; ReactiveObject.dispose(true) on NodeArray props; dispose(false) for shallow detach. Removed Split/Panel/MenuOption pre-clear of arrays (blocked deep cascade). 901 core+layout tests pass.
