# Working Memory - Io-Gui Development

> Persistent curated memory. Prune based on archive access patterns.

## Recent Decisions

- daily-routines P4 locked: storage buffers + TSL vertex pull + IndirectStorageBufferAttribute. No texture2DArray. Density/heatmap overlay removed 2026-09-05 — lines only at all zooms. GPU pool 16M verts (was 4M; SF L14 ~5M). Dummy pos stay 2 — draw count is indirect.
- daily-routines line gaps: shader hides chords longer than `tileSpan * SEGMENT_MAX_TILE_FRACTION` only (no frontend DISTANCE/TIME/SPEED). Ingest owns rejection in pipeline config. Pair both verts via `evenVid = vid - (vid & 1)` — do not `bitAnd(0xfffffffe)` (f32 loses low bits). Collapse both ends to even endpoint. Day/hour filters hard (no fade). No weekday filter.
- daily-routines: no synthesized flights. Ingest splits gaps only. File cache VERSION 2. Exclusive client LOD stay.
- daily-routines coarse LOD = Ramer–Douglas–Peucker (perp. deviation), not radial stride. Every run survives. Weight = dropped verts folded onto preceding kept. No weekday/hour hash drop (deleted in mesh-style rewrite). `SIMPLIFY_MIN_DEG` ≈ 10 m. Do **not** raise eps to hit COARSE_TILE_BUDGET — that flattened L0–L11 to 2-pt sticks. Leaf L14 full-res. Archive 2026-09-06: 189.7 MiB; L0 561,918 → L13 2.29M → L14 20.6M. 16-bit tile quantize still coarse at world tiles (huge bbox). Hour filter at world zoom can miss tracks (kept verts are shape, not time).
- daily-routines pipeline: `pnpm pipeline` full chain. Incremental ingest. After config.js limits or filecache VERSION change: `pnpm pipeline -- --force`. Stage scripts resume from later step. 12 GB heap on ingest/canonical/tile/verify.
- three r185: do not share one StorageBufferAttribute as atomic in compute and readonly in fragment — writes don't appear. MeshBasicNodeMaterial MultiplyBlending can ignore blend and draw opaque; use opacityNode + NormalBlending for DataTexture overlays.

### Architectural Insights

- **Agent skills ship inside packages:** `packages/<pkg>/skills/io-gui-<pkg>/SKILL.md` + CONTEXT.md in npm `files[]`. Root `skills/` = git symlinks for `npx skills add io-gui/io`. agentskills.io format; consumer linker can also discover from node_modules.
- Apps use `<custom-element>` tags directly in HTML (e.g. `<circuits-app>`)
- Apps are embedded in the root `index.html` via `iframe()` helper + nav entry
- Workspace deps use `"workspace:*"` in `package.json`

- **Editor configs colocated w/ class** (user rule 2026-10-10): `registerEditorConfig`/`registerEditorGroups` right after class def, narrowest class. `configs/` dir = external (three.js) only. No global `Object` config - removed on purpose (steps over all derived classes). Not a regression; don't flag. Whitelist = Main names + Advanced catch-all regex (explicit names beat regex).
- **io-three essence:** document = portable content (scene, timeline, onRendererInitialized, onAnimate, props+groups; no editor/view/DOM access). Editor = host/session (playing, selection, tools, ops). View = intent (axis, first/named cam) carried across docs; resolved nav per doc. Apps = one host + documents (demos/IoEditorExample). Rules in io-gui.mdc.
- **Timeline (2026-10-10):** `document.timeline` node = clock (currentTime, duration, frameRate, loop, autoplay, lazy `timeNode` TSL uniform). onAnimate(delta, time) on every currentTime change (play/scrub/step); delta = change in timeline time, negative on wrap/scrub back (why: same time -> same state as far as integrators allow). Derive from time where possible; mixers integrate delta. Editor.tick -> timeline.advance(frame.delta). frameRate = stepping/snap/dividers only, no playback effect; user: fps matters only for video export, revisit then. UI: ThreeTimeline + ThreeTimelineRange (IoGl).

### Code Patterns That Worked

- **Io events: use bubbling + static Listeners, not listener wrangling.** Source node calls `this.dispatch("event-name", detail, true)` so the event bubbles. Consumers declare `static get Listeners()` mapping event names to handler method names (e.g. `"game-save": "onGameSave"`). No manual `addEventListener` in `ready()`, no storing previous refs or add/remove when dependencies change. Parents that have the dispatching node in their tree receive the event via bubbling.

- **Monorepo packaging/build:** `exports`/`types`/`main` all point at `dist/`. `sideEffects` narrowed to `**/elements/**`, `**/nodes/**`, `**/configs/**`. TS `composite: true` + root `tsc -b` with project `references` (no cross-package `paths`). Clean must delete `tsconfig.tsbuildinfo` or incremental builds skip emit. Vite aliases still resolve to `src/` for dev/tests.

- **Panel owns floating UI via `src` ref** (IoColorPanel/IoColorPicker, IoNumberLadderSingleton): panel holds reference to active child; child derives expanded state from panel; collapse/disconnect clears `src` synchronously. No cross-element addEventListener.

### Code Patterns That Failed

- **three `Float32BufferAttribute(array)` copies the array.** Keep `attribute.array`, not the array passed in, when writing per-vertex data later. `InstancedBufferAttribute`/`BufferAttribute` do not copy.
- **Vitest browser hang** ("no tests", ~10 min): stale Chrome for Testing processes. Kill them; run `npx vitest run --project unit <path> --browser.headless`.
- `source .env` before `pnpm test`: PLAYWRIGHT_BROWSERS_PATH=repo `.playwright-browsers`; after Playwright upgrade run `source .env && pnpm exec playwright install chromium` (1248 installed 2026-10-10). Synthetic PointerEvent tests: stub `setPointerCapture`. Screenshots: `page.viewport()` + `page.screenshot({path: 'relative.png'})` (Vite fs.strict blocks paths outside repo).

- **NodeArray assignment copy path** when source is already a `NodeArray`: copying via push inside `withInternalOperation` duplicates mutation listeners on kept items. Assign by reference or use explicit `splice`.
- **NodeArray in-place filter via `length = 0` + `push`**: same duplicate-listener issue; use `splice(0, length, ...items)`.

## Open Design Questions

### @io-gui/core construction order (raised 2026-10-10)
- Reactions (ready, *Changed, mutated, io-mutation) run inside base ctor, before subclass fields/ctor body. Costs: silent wipe of non-`declare` fields written by handlers, guards in handlers (ThreeViewport), @Field workarounds everywhere. Plan + draft ADR (proposed core 0005): `.cursor/plans/core_construction_order.plan.md` (@Register wrapper, `new.target` finish, queue while constructing). Not started.
- Timeline delta negative on wrap/scrub back: accepted for now; see three_future_work plan `timeline-negative-delta`.

### @io-gui/layout target architecture (ADRs in packages/layout/docs/adr)
- **Seam = DOM-dependency** (ADR-0001): pure structural ops → Split/Panel models; only geometry/hit-test/focus stay on IoSplit/IoPanel elements. Currently violated — elements are fat. Migration incremental.
- **Reactive normalize()** (ADR-0002, proposed): each Split normalizes its own invariants in childrenMutated (guarded+debounced), cascading up via nested-mutation surfacing; delete the 3 io-*-remove/consolidate DOM events. Not implemented.
- Layout invariants (enforce in model): no empty Split/Panel; no single-child Split (consolidate); ≥1 growing child; exactly 1 selected tab per non-empty panel; ≥1 panel survives; unique tab id per panel.
- Watch: `io-split[root]` selector is dead (no element sets `root`) — IoTab now walks to outermost io-split instead. Prefer that over reintroducing the attribute.
- **Hoist/consolidate `_parents` cleanup**: io-core now calls `detachNodeParents` on NodeArray removal + `disconnectPropertyValue`. Layout panel hoist + root collapse rely on that; spread-hoist still needs explicit `detachNodeParents(soleChild)` in `consolidateChildAt`. Never empty NodeArray during hoist while IoSplit bound — crashes `calculateCollapsedDrawers`.

## Package-Specific Notes

### io-core

- **Binding sync = graph write + BindingWave:** `pushBindingValue` settles outbound closure; `ChangeQueue.dispatch` holds one wave across the property pass so parallel networks batch-settle before spoke flush. Wave closes before source `mutated()`. Suites: Binding.test.ts, Binding.network.test.ts.
- **Nomenclature (ADR-0001):** Object base = `ReactiveObject` ("object"); HTMLElement base = `ReactiveElement` ("element"); union/graph vertex = `ReactiveNode` ("node"). Informal pairing is objects + elements, not nodes + elements.
- `tsconfig.json` include path: use `"./src"` (relative with dot)
- `IoSelector.Listeners` return type: `ListenerDefinitions`
- VDOM reconciles children **by position and tag only** (`ReactiveElement._reconcileChildren`). A `key` prop is stored as non-enumerable `_vdomKey` but nothing matches by it yet (TODO in core, checked 2026-10-10). Inserting rows mid-list re-props every later sibling.
- VDOM props that are not reactive properties are assigned directly (`element[name] = value`), so a `@Field` takes props. An object-valued `@Property` starts a mutation observer (window listener for plain objects): keep per-row object refs in Fields.
- VDOM `children` is always `Array<VDOMChild> | undefined`; string literals normalized at factory boundary only. `text()` helper creates `#text` nodes; reconciliation uses `childNodes`.
- Generic `vConstructor` doesn't type subclass props; in tests, wrap it: `type XProps = ReactiveElementProps & {...}; const x = (props: XProps) => X.vConstructor(props)`
- ProtoChain init: avoid runtime imports from ReactiveObject into Property (TDZ/circular init).
- Vitest does not typecheck — run `pnpm build` after typed test changes.
- **Change handlers run inside base ctor** (applyProperties -> ready -> dispatchQueue) before subclass field initializers. State they touch: `@Field` or `declare private x` + lazy getter; actions passed in first render: `on*` methods (auto-bound), not arrow fields.
- **Child node instead of parent props** to keep change typing clean: `@Property({type: Child, init: null})` + `childMutated()`; child prop changes don't call parent `mutated()` (no cascade). Used for Document.timeline (time changes no longer emit 'settings').
- **IoGl derived uniforms:** declare extra `uniform float` in Frag, set with `setShaderProgram()` + `setUniform()` before `super.onRender()`; 2D text via `this.ctx` after it. Compute positions in JS (double) and shade in device px (`gl_FragCoord`) when float32 would drift (long timelines).
- `IoSyntheticEvent.path` is mutated during bubble; copy if retained beyond handler.

#### ReactiveObject (de)serialization — generic `toJSON` / `applyJSON`

**Principle:** Wire format is dumb; domain types are smart; infrastructure only connects them. Serialize at the boundary, hydrate at the boundary — keep the interior model typed and rich. Persistence/transport deals in plain JSON-safe data; each type owns encode/decode; `Storage` routes bytes, never embeds type-specific knowledge.

**Commit:** `83d9ef6d` — *Improved node (de)serialization* (Jun 14, 2026). Evolved from Theme/Storage refactor; replaced per-type `hydrate`/`fromJSON` instance paths with a unified contract.

**Naming:**

| Method | Role |
|--------|------|
| `toJSON()` | Instance → wire JSON. Called by `JSON.stringify`. |
| `applyJSON(json)` | Wire JSON → **existing** instance (in-place rehydration). What `Storage` uses for bound live nodes. |
| `fromJSON` (static) | Factory/parse only where needed (e.g. `Color` has no static; `Theme` presets are plain `ThemeJSON`). Not the Storage path. |

Renamed instance `fromJSON` → `applyJSON` to distinguish apply-to-existing from static factory semantics.

**Generic `ReactiveObject.toJSON()`** (`packages/core/src/nodes/ReactiveObject.ts`):
- Walks `_reactiveProperties`;
- Objects with `toJSON()` → delegate (nested nodes, `NodeArray`, `Color`, etc.).
- Primitives (`number`, `string`, `boolean`) → copied as-is.
- Does **not** auto-serialize arbitrary plain objects or unregistered props.

**Generic `ReactiveObject.applyJSON(json)`**:
- For each key in JSON, looks up reactive property.
- Object values with `applyJSON()` → delegate in place (nested rehydration).
- Otherwise → collect as primitive, batch via `setProperties`.
- Returns `this`. Warns in debug when object property lacks `applyJSON`.

**`NodeArray`** (`packages/core/src/core/NodeArray.ts`):
- `toJSON()` → `map(item => item.toJSON())`.
- `applyJSON(json[])` → updates **existing** items in place via `this[i].applyJSON(json[i])` (same references preserved).
- Does not grow/shrink by itself — empty arrays need domain handling (constructor or custom `applyJSON` on parent).
- Assigning plain `ReactiveNode[]` to a `NodeArray` property uses `applyNodeArrayAssignment` → `splice(0, length, ...items)` (not `length=0`+`push` — avoids duplicate mutation listeners).

**`Color`** — reference implementation for nested wire types:
- Wire format: 32-bit ARGB hex (`toJSON()` / `applyJSON(hex)`).
- Legacy 24-bit RGB decodes as opaque (`a = 1`).
- `applyJSON` mutates existing instance; no static factory needed for Storage path.

**`Storage` load/save** (`packages/core/src/nodes/Storage.ts`):
- Load: `JSON.parse(stored)` → if value is ReactiveObject, `value.applyJSON(parsed)` — **same instance**, bindings preserved.
- Save: `JSON.stringify` uses each node's `toJSON()` via normal JSON semantics + mutation dispatch.
- Non-node values: construct via registered constructor or assign parsed plain object.
- Catch block must not leave raw JSON **string** on model — corrupts typed state.

**When to override** (domain logic beyond flat reactive props):
- **`Split` / `Panel` / `Tab`** — polymorphic tree, `createChild`, consolidation, compact wire format (omit defaults).
- **`TodoListModel`** — `applyJSON` maps wire items → `TodoItemModel` instances via `setProperty('items', ...)`.
- **`Option`** — custom `toJSON` for menu-specific shape.
- **`Theme`** — uses generic path; color keys hydrate via `Color.applyJSON` on reactive properties.

**Gotchas discovered post-refactor:**
- `toJSON` must include strings/booleans or wire items become `{}` (TodoMVC crash).
- `NodeArray.applyJSON` on empty array: generic version only updates existing indices — parent must construct items (custom `applyJSON` or constructor).
- Storage must call `applyJSON` on existing node, not `new Constructor(parsed)` — Theme/layout singletons rely on in-place hydration.
- Layout tests renamed `.fromJSON(` → `.applyJSON(` across Tab/Panel/Split tests.

**Tests:** `ReactiveObject.test.ts`, `NodeArray.test.ts`, `Color.test.ts`, `Theme.test.ts`, `Storage.test.ts` cover round-trip, nested delegation, in-place updates, and localStorage hydration.

### io-three

- **Arch (2026-10-07, ADR 0001-0007):** WebGPU only, no WebGL fallback. Layers: app (Editor: doc, selection, tools, ops, undo, clock; document queues its own DocumentChanges, no ChangeBus since 2026-10-10) / view (View data outlives ThreeViewport element) / frame (RenderScheduler only renderer, typed dirty tags, phases, budget). Reactive mutation never triggers draws.
- **Input:** InputRouter per viewport owns DOM listeners + capture. Priority bands modal 1000, gizmo 800, tool 500, nav 300, fallback select 100. Tools = ToolDefinition only (shared), behaviors per view. ThreeApplet/ToolBase/viewport `applet`+`tool` props/editor onResized removed 2026-10-07 (no back-compat going forward; external GlobeTool must port to ToolDefinition).
- **Selection:** by Object3D.uuid + attribute domain (object/point/edge/primitive/corner), bitsets, transactions. UV sel = corner domain; uvSync = mapping.
- RenderScheduler rAF must run after core FrameScheduler rAF in same frame (import order).
- **Undo (ADR-0008 proposed):** command (Maya-like intent: repeat/journal/actions/macros) -> transaction (undo+sync unit) -> patch (set/insert/remove/setAttribute by uuid, old value auto-recorded). No hand-written undoIt. Build mutation API now (P4), undo stack + commands later (P8). Selection/nav/hover = session state, never synced. Multi-user target: Figma-style server order + LWW + fractional index; per-user undo skips paths changed by others.
- `ThreeViewport` lazy-inits a shared default `WebGPURenderer`. Must assign onto `args` before `super()` — `@Property({value: _renderer})` snapshots at class def, so a later `let` assign never reaches instances. Custom `renderer` prop still wins.
- Dev import map needs bare `"three"` entry (OrbitControls imports `from 'three'`).
- **Render path (P6):** pipeline -> own half-float RT (linear) -> compositor presents RT + overlays in ONE renderer.render(overlayScene) to canvas; present quad writes pipeline depth via material.depthNode. Tone mapping only at present (view ?? pipeline ?? document). PostProcessing in a pipeline: outputColorTransform=false. Renderer's shared frameBufferTarget does tone mapping per canvas render call -> keep canvas draws to one call.
- Overlay hook = `prepare` (GizmoLayer is Behavior + Overlay; `update` name clash). Router startModal marks presses non-click.
- **Components (P7):** ID pass = RGBA32F RT (slot, prim+1, view depth), readback rows padded to 256 B (stride = ceil(w*16/256)*256/4 floats), row 0 = top. Points/edges CPU-projected + 3x3 depth test. Overlay wires/points need depth bias: `material.depthNode` = viewZToPerspectiveDepth(viewZ*(1-eps)) (positionView in fragment). WebGPU points are 1px: use `Sprite` + PointsNodeMaterial(positionNode=instancedBufferAttribute) with `sprite.count`. Disposing a geometry frees GPU buffers of ALL its attributes -> never share an attribute with a geometry you dispose (clone it).
- **Change listeners (2026-10-10):** non-view UI that follows a document (ThreeScenegraph) = `renderScheduler.addListener({document, onDocumentChanges})`; scheduler drains listener docs too. Never drain docs elsewhere. Async adds outside transactions must `notify({kind: 'structure'})` or the tree misses them.
- **ThreeScenegraph:** flat IoField rows (positional VDOM), all expanded by default, disclosure = collapsed uuids (host binds Storage), capped 1000. Reveal on active change; rename via `object.rename` operator. Not on io-menus (menus select ancestors, branch rows toggle; ADR-0007 updated). Object icons: prototype-chain registry `icons/objectIcons.ts`.
- CSS: grid column `minmax(max-content, auto)` = widest row, at least container (scrolls); `minmax(100%, max-content)` never exceeds container. IoField captures the pointer on press -> click target is the row, decide sub-target on pointerdown. Ending an edit that removes an IoString: stopImmediatePropagation in your prop listeners (they run before IoString's focus-added ones).
- Inspector: `selection.active` is a uuid; property editors want the object (`selection.activeObject`). IoLayout keeps elements it first rendered (selector cache ignores later `value` props): bind a reactive host property. Add-tab menu: `element.group` nests entries under one option.
- **Framing AABB:** always `Box3.setFromObject(obj, true)`. Default path unions morph-target extremes via `geometry.computeBoundingBox()` — absolute morphs often inflate to origin. Also: both cams `lookAt(center)`, near/far from AABB corner depths, `orbitControls.update()`.
- **Examples:** rules + audit + todos in `.cursor/plans/three.js_example_conversion.plan.md`. `src_examples` = symlink to local three.js dev checkout (ahead of release) -> convert from r186 (`git -C ../three.js show 148ef33ecb:examples/X.html`; no r183+ tags locally). Easy misses: renderer.toneMapping -> super({toneMapping}); wall-clock timers; whole-scene framing dominated by sky/floors. Authored helpers temporary until `scene-helpers` overlay (future plan).
- Live docs (three ADR-0009): game-like state from interaction -> integrate only delta>0, transport = pause/step. Sequence docs derive from time.
- **Headless WebGPU check:** playwright headless = SwiftShader; viewport screenshots blank. Use page's own three (`performance.getEntriesByType('resource')` URL matching three_webgpu; fresh `import('three/webgpu')` = 2nd instance -> TSL 'No stack defined'), WebGPURenderer -> RenderTarget (headless canvas texture invalid), compileAsync + render in `device.pushErrorScope('validation')`, read pixels.
- **After three upgrade:** restart `pnpm dev` (Vite checks lockfile only at startup; stale pre-bundle). Isolated check: scratch .mjs config importing repo vite.config.ts + mergeConfig({cacheDir, server.port}) with `--configLoader native`.

### io-layout

(none)

### io-menus

- **Option empty-id selection:** `getSelectedIDImmediate`, `optionsMutated` must not treat `''` as falsy. Menu `updatePaths` sets `selectedID` directly (path `''` can't round-trip via `pathChanged`).
- **Open: root Menu identity.** Menu defaults `id: 'root'` when omitted. Child option with `id: ''` (e.g. filter "all" with `value: ''` for string-input sync) can still collide with an empty-id Option. Valid use case; root identity model needs improvement (distinct internal id vs leaf ids, or exclude root from duplicate-id check).
- **findOptionById/findOptionByValue:** search descendants before self so empty-id child wins over empty-id root (fixes selectedID `''` binding → menu highlight).

### io-icons

- Material Symbols: viewBox `0 -960 960 960` -> `<g id transform="scale(0.025) translate(0 960)">`, path d only. Package namespace = side-effect module in `src/icons/` + `sideEffects` `**/icons/**` + icons dev/peer dep + tsconfig ref. Rule: `.cursor/rules/io-icons.mdc`.
- `IconsetSingleton.hasIcon(ref)`; IoBoolean labels -> icon iff registered (any ns), else text. `io:slider` (single) vs `io:sliders` (tune).
- Long Material `d` (>300 chars): wrap before command letters (lint max-len 360). Contact sheet recipe: validate d by regex, HTML grid, playwright screenshot from scratchpad node script.

### Other Packages

- Vite 8 Rolldown: legal comments stripped before terser when minifying — set `rollupOptions.output.comments: { legal: true }` + entry banner for license preservation.
