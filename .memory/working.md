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

### Code Patterns That Failed

(to be populated)

## Open Design Questions

(none yet)

## Package-Specific Notes

### io-core

- `tsconfig.json` include path: use `"./src"` (relative with dot)
- `IoSelector.Listeners` return type: `ListenerDefinitions`

### io-three

(none)

### io-layout

(none)

### io-menus

(none)

### Other Packages

(none)
