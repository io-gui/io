# Working Memory - Io-Gui Development

> Persistent curated memory. Prune based on archive access patterns.

## Recent Decisions

(none yet)

## Active Patterns

### Architectural Insights

- Apps use `<custom-element>` tags directly in HTML (e.g. `<circuits-app>`)
- Apps are embedded in the root `index.html` via `iframe()` helper + nav entry
- Workspace deps use `"workspace:*"` in `package.json`

### Code Patterns That Worked

- **Io events: use bubbling + static Listeners, not listener wrangling.** Source node calls `this.dispatch("event-name", detail, true)` so the event bubbles. Consumers declare `static get Listeners()` mapping event names to handler method names (e.g. `"game-save": "onGameSave"`). No manual `addEventListener` in `ready()`, no storing previous refs or add/remove when dependencies change. Parents that have the dispatching node in their tree receive the event via bubbling.

- **Monorepo packaging/build:** `exports`/`types`/`main` all point at `dist/`. `sideEffects` narrowed to `**/elements/**`, `**/nodes/**`, `**/configs/**`. TS `composite: true` + root `tsc -b` with project `references` (no cross-package `paths`). Clean must delete `tsconfig.tsbuildinfo` or incremental builds skip emit. Vite aliases still resolve to `src/` for dev/tests.

### Code Patterns That Failed

(to be populated)

## Open Design Questions

(none yet)

## Package-Specific Notes

### io-core

- `tsconfig.json` include path: use `"./src"` (relative with dot)
- `IoSelector.Listeners` return type: `ListenerDefinitions`
- VDOM supports opt-in keyed reconciliation: set `key` in a vChild's props to match-and-move elements on reorder instead of destroy/recreate. Keys live on DOM elements as non-enumerable `_vdomKey` (read via `getElementKey`); `key` is never applied as a property/attribute. Unkeyed siblings in a keyed list still reuse positionally by tag. Duplicate keys warn in debug blocks.
- Generic `vConstructor` doesn't type subclass props; in tests, wrap it: `type XProps = IoElementProps & {...}; const x = (props: XProps) => X.vConstructor(props)`

### io-three

- `ToolBase` stores hover and active pointers per `IoThreeViewport` in viewport-keyed `WeakMap`s. Pointer events should resolve the source viewport from `event.currentTarget` so hover/move/down/up payloads stay isolated to the viewport that emitted the event.

### io-layout

(none)

### io-menus

(none)

### Other Packages

(none)
