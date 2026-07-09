# Working Memory - Io-Gui Development

> Persistent curated memory. Prune based on archive access patterns.

## Recent Decisions

(none yet)

### Architectural Insights

- Apps use `<custom-element>` tags directly in HTML (e.g. `<circuits-app>`)
- Apps are embedded in the root `index.html` via `iframe()` helper + nav entry
- Workspace deps use `"workspace:*"` in `package.json`

### Code Patterns That Worked

- **Io events: use bubbling + static Listeners, not listener wrangling.** Source node calls `this.dispatch("event-name", detail, true)` so the event bubbles. Consumers declare `static get Listeners()` mapping event names to handler method names (e.g. `"game-save": "onGameSave"`). No manual `addEventListener` in `ready()`, no storing previous refs or add/remove when dependencies change. Parents that have the dispatching node in their tree receive the event via bubbling.

- **Monorepo packaging/build:** `exports`/`types`/`main` all point at `dist/`. `sideEffects` narrowed to `**/elements/**`, `**/nodes/**`, `**/configs/**`. TS `composite: true` + root `tsc -b` with project `references` (no cross-package `paths`). Clean must delete `tsconfig.tsbuildinfo` or incremental builds skip emit. Vite aliases still resolve to `src/` for dev/tests.

- **Panel owns floating UI via `src` ref** (IoColorPanel/IoColorPicker, IoNumberLadderSingleton): panel holds reference to active child; child derives expanded state from panel; collapse/disconnect clears `src` synchronously. No cross-element addEventListener.

### Code Patterns That Failed

- **NodeArray assignment copy path** when source is already a `NodeArray`: copying via push inside `withInternalOperation` duplicates mutation listeners on kept items. Assign by reference or use explicit `splice`.
- **NodeArray in-place filter via `length = 0` + `push`**: same duplicate-listener issue; use `splice(0, length, ...items)`.

## Open Design Questions

### @io-gui/layout target architecture (ADRs in packages/layout/docs/adr)
- **Seam = DOM-dependency** (ADR-0001): pure structural ops → Split/Panel models; only geometry/hit-test/focus stay on IoSplit/IoPanel elements. Currently violated — elements are fat. Migration incremental.
- **Reactive normalize()** (ADR-0002, proposed): each Split normalizes its own invariants in childrenMutated (guarded+debounced), cascading up via nested-mutation surfacing; delete the 3 io-*-remove/consolidate DOM events. Not implemented.
- Layout invariants (enforce in model): no empty Split/Panel; no single-child Split (consolidate); ≥1 growing child; exactly 1 selected tab per non-empty panel; ≥1 panel survives; unique tab id per panel.
- Watch: `io-split[root]` selector is dead (no element sets `root`) — IoTab now walks to outermost io-split instead. Prefer that over reintroducing the attribute.
- **Hoist/consolidate `_parents` cleanup**: io-core now calls `detachNodeParents` on NodeArray removal + `disconnectPropertyValue`. Layout panel hoist + root collapse rely on that; spread-hoist still needs explicit `detachNodeParents(soleChild)` in `consolidateChildAt`. Never empty NodeArray during hoist while IoSplit bound — crashes `calculateCollapsedDrawers`.

## Package-Specific Notes

### io-core

- **Binding sync = graph write + BindingWave:** `pushBindingValue` settles outbound closure; `ChangeQueue.dispatch` holds one wave across the property pass so parallel networks batch-settle before spoke flush. Wave closes before source `mutated()`. Suites: Binding.test.ts, Binding.network.test.ts.
- `tsconfig.json` include path: use `"./src"` (relative with dot)
- `IoSelector.Listeners` return type: `ListenerDefinitions`
- VDOM supports opt-in keyed reconciliation: set `key` in a vChild's props to match-and-move elements on reorder instead of destroy/recreate. Keys live on DOM elements as non-enumerable `_vdomKey` (read via `getElementKey`); `key` is never applied as a property/attribute. Unkeyed siblings in a keyed list still reuse positionally by tag. Duplicate keys warn in debug blocks.
- VDOM `children` is always `Array<VDOMChild> | undefined`; string literals normalized at factory boundary only. `text()` helper creates `#text` nodes; reconciliation uses `childNodes`.
- Generic `vConstructor` doesn't type subclass props; in tests, wrap it: `type XProps = ReactiveElementProps & {...}; const x = (props: XProps) => X.vConstructor(props)`
- ProtoChain init: avoid runtime imports from ReactiveNode into Property (TDZ/circular init).
- Vitest does not typecheck — run `pnpm build` after typed test changes.
- `IoSyntheticEvent.path` is mutated during bubble; copy if retained beyond handler.

#### ReactiveNode (de)serialization — generic `toJSON` / `applyJSON`

**Principle:** Wire format is dumb; domain types are smart; infrastructure only connects them. Serialize at the boundary, hydrate at the boundary — keep the interior model typed and rich. Persistence/transport deals in plain JSON-safe data; each type owns encode/decode; `Storage` routes bytes, never embeds type-specific knowledge.

**Commit:** `83d9ef6d` — *Improved node (de)serialization* (Jun 14, 2026). Evolved from Theme/Storage refactor; replaced per-type `hydrate`/`fromJSON` instance paths with a unified contract.

**Naming:**

| Method | Role |
|--------|------|
| `toJSON()` | Instance → wire JSON. Called by `JSON.stringify`. |
| `applyJSON(json)` | Wire JSON → **existing** instance (in-place rehydration). What `Storage` uses for bound live nodes. |
| `fromJSON` (static) | Factory/parse only where needed (e.g. `Color` has no static; `Theme` presets are plain `ThemeJSON`). Not the Storage path. |

Renamed instance `fromJSON` → `applyJSON` to distinguish apply-to-existing from static factory semantics.

**Generic `ReactiveNode.toJSON()`** (`packages/core/src/nodes/ReactiveNode.ts`):
- Walks `_reactiveProperties`;
- Objects with `toJSON()` → delegate (nested nodes, `NodeArray`, `Color`, etc.).
- Primitives (`number`, `string`, `boolean`) → copied as-is.
- Does **not** auto-serialize arbitrary plain objects or unregistered props.

**Generic `ReactiveNode.applyJSON(json)`**:
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
- Load: `JSON.parse(stored)` → if value is IoValue (node), `value.applyJSON(parsed)` — **same instance**, bindings preserved.
- Save: `JSON.stringify` uses each node's `toJSON()` via normal JSON semantics + mutation dispatch.
- Non-node values: construct via registered constructor or assign parsed plain object.
- Catch block must not leave raw JSON **string** on model — corrupts typed state.

**When to override** (domain logic beyond flat reactive props):
- **`Split` / `Panel` / `Tab`** — polymorphic tree, `createChild`, consolidation, compact wire format (omit defaults).
- **`TodoListModel`** — `applyJSON` maps wire items → `TodoItemModel` instances via `setProperty('items', ...)`.
- **`MenuOption`** — custom `toJSON` for menu-specific shape.
- **`Theme`** — uses generic path; color keys hydrate via `Color.applyJSON` on reactive properties.

**Gotchas discovered post-refactor:**
- `toJSON` must include strings/booleans or wire items become `{}` (TodoMVC crash).
- `NodeArray.applyJSON` on empty array: generic version only updates existing indices — parent must construct items (custom `applyJSON` or constructor).
- Storage must call `applyJSON` on existing node, not `new Constructor(parsed)` — Theme/layout singletons rely on in-place hydration.
- Layout tests renamed `.fromJSON(` → `.applyJSON(` across Tab/Panel/Split tests.

**Tests:** `ReactiveNode.test.ts`, `NodeArray.test.ts`, `Color.test.ts`, `Theme.test.ts`, `Storage.test.ts` cover round-trip, nested delegation, in-place updates, and localStorage hydration.

### io-three

- `ToolBase` stores hover and active pointers per `IoThreeViewport` in viewport-keyed `WeakMap`s. Pointer events should resolve the source viewport from `event.currentTarget` so hover/move/down/up payloads stay isolated to the viewport that emitted the event.
- Dev import map needs bare `"three"` entry (OrbitControls imports `from 'three'`).

### io-layout

(none)

### io-menus

- **MenuOption empty-id selection:** `getSelectedIDImmediate`, `optionsMutated`, `updatePaths` must not treat `''` as falsy. `updatePaths` sets `selectedID` directly (path `''` can't round-trip via `pathChanged`).
- **Open: root MenuOption identity.** Root defaults `id: ''` (`args.id ?? ''`). Child option with `id: ''` (e.g. filter "all" with `value: ''` for string-input sync) duplicates root id → debug warning in `getAllOptions`. Valid use case; root identity model needs improvement (distinct internal id vs leaf ids, or exclude root from duplicate-id check).
- **findItemById/findItemByValue:** search descendants before self so empty-id child wins over empty-id root (fixes selectedID `''` binding → menu highlight).

### Other Packages

- Vite 8 Rolldown: legal comments stripped before terser when minifying — set `rollupOptions.output.comments: { legal: true }` + entry banner for license preservation.
