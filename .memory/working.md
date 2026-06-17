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

(none yet)

## Package-Specific Notes

### io-core

- `tsconfig.json` include path: use `"./src"` (relative with dot)
- `IoSelector.Listeners` return type: `ListenerDefinitions`
- VDOM supports opt-in keyed reconciliation: set `key` in a vChild's props to match-and-move elements on reorder instead of destroy/recreate. Keys live on DOM elements as non-enumerable `_vdomKey` (read via `getElementKey`); `key` is never applied as a property/attribute. Unkeyed siblings in a keyed list still reuse positionally by tag. Duplicate keys warn in debug blocks.
- VDOM `children` is always `Array<VDOMChild> | undefined`; string literals normalized at factory boundary only. `text()` helper creates `#text` nodes; reconciliation uses `childNodes`.
- Generic `vConstructor` doesn't type subclass props; in tests, wrap it: `type XProps = IoElementProps & {...}; const x = (props: XProps) => X.vConstructor(props)`
- `ReactiveNode.toJSON` must serialize primitives; wire hydration goes through `applyJSON` on domain types, not raw JSON left on models.
- ProtoChain init: avoid runtime imports from ReactiveNode into ReactiveProperty (TDZ/circular init).
- Vitest does not typecheck — run `pnpm build` after typed test changes.
- `IoSyntheticEvent.path` is mutated during bubble; copy if retained beyond handler.

### io-three

- `ToolBase` stores hover and active pointers per `IoThreeViewport` in viewport-keyed `WeakMap`s. Pointer events should resolve the source viewport from `event.currentTarget` so hover/move/down/up payloads stay isolated to the viewport that emitted the event.
- Dev import map needs bare `"three"` entry (OrbitControls imports `from 'three'`).

### io-layout

(none)

### io-menus

(none)

### Other Packages

- Vite 8 Rolldown: legal comments stripped before terser when minifying — set `rollupOptions.output.comments: { legal: true }` + entry banner for license preservation.
