# NOW - Circuits App

## Current Task
Refactor circuits grid dimensions so `width`/`height` mean line counts, then migrate level JSON dimensions.

## Key Context
- Runtime updated: `Game`, `Pads`, `Plotter`, `Grid`, and `ThreeScene` now consume line-count dimensions.
- Segment extents are derived as `width - 1` and `height - 1` where needed.
- Level files in `public/levels/lvl_*.json` were migrated by incrementing width/height by 1.
- `pads.test.ts` updated for line-count constructor semantics (`new Pads(5, 6)` baseline).

## Open Questions / Next Check
- Browser smoke-check still pending for camera framing and drag feel on migrated levels.
