# NOW - Circuits App

## Current Task
Remove `src/game/items/terminal.ts` and represent terminals as `Pad` with `isTerminal: true`.

## Key Context
- Runtime refactor completed: game state, plotter, scene, board, grid all operate on pads only.
- Legacy level support intentionally removed in runtime `fromJSON`.
- Migration script created at `tools/migrate-levels-to-terminal-pads.js`.
- Script already executed across `public/levels/lvl_*.json`.

## Open Questions / Next Check
- Quick browser pass: draw terminal pad, draw line to verify 1-connection limit and completion checks.
