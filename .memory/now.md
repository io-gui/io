# NOW - Current Focus

> Prune aggressively. Only what's relevant to current work stays here.

## Current Task
`packages/three/src/nodes/ToolBase.ts`: scope hover/active pointer bookkeeping per viewport

## Key Context
- `ToolBase` now keeps hover and active pointers in viewport-keyed `WeakMap`s
- Pointer events resolve the source viewport from `event.currentTarget`
- Pointer conversion reuses prior pointer state from the matching viewport only
- `pnpm build` passed in `packages/three`
- `pnpm test:three` was not rerun; package has no matching test files from prior check

## Blockers / Open Questions
- None
