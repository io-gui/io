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
(to be populated)

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
