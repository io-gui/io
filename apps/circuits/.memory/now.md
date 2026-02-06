# NOW - Circuits App

## Current State
Port complete. Reference cleanup done, wired into main app. Untested in browser.

## Recent Changes (uncommitted on `dev`)
- Deleted `src_reference/`, `index_reference.html`, `style_reference.css` (~1,769 lines removed)
- `index.html` → `<circuits-app>` (was `<todo-app>`), added viewport meta + fullscreen styles
- `package.json` — added `@io-gui/inputs`, `@io-gui/layout`, `@io-gui/navigation` deps
- Registered in root `index.html` (nav entry + iframe)

## Next Steps
- Run `pnpm dev`, navigate to `apps/circuits/index.html`
- Verify levels page renders 96 buttons
- Verify level loading, canvas drawing, pointer interaction
- Verify undo/redo/reset/edit/back
- Verify localStorage persistence + hash routing

## Open Questions
- Level fetch path `./public/levels/` — may need adjustment depending on vite serving behavior
- Only 50 level JSON files exist on disk but 96 buttons are rendered (matching reference HTML)
