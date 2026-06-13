# NOW - Current Focus

> Prune aggressively. Only what's relevant to current work stays here.

## Current Task
Roadmap C2 done: VDOM keyed diffing + render allocation reduction in `packages/core`

## Key Context
- `IoElement.traverse` now dispatches to `_reconcileKeyedChildren` (when any vChild has `props.key`) or `_reconcilePositionalChildren` (previous behavior)
- Keys are opt-in per child; stored as non-enumerable `_vdomKey` on elements in `constructElement`; never applied as property/attribute (`key` skipped in `applyProperties` and `applyNativeElementProps`)
- `filterVDOMElements` helper returns same array when no nulls (no per-render filter allocation); `this.$` cleared in place instead of reallocated
- `pnpm test` all green (773 tests), `pnpm --filter @io-gui/core build` and `pnpm lint` clean

## Blockers / Open Questions
- None
