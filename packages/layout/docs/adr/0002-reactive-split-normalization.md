---
status: completed
---

# Structural invariants are enforced by reactive normalization on Split and Layout

A well-formed layout has invariants: no empty `Panel` or `Split`; no `Split` with a single child (consolidate — when the parent is `Layout`, the lone child becomes `layout.child` as `Split | Panel`); at least one child of every `Split` has `size: "auto"` (`ensureOneChildHasAutoSize`); exactly one `Tab` selected per non-empty `Panel`; at least one `Panel` always survives at the root.

Enforcement lives in the model layer as **normalization**. Each `Split.normalize()` fixes local invariants inside a `withInternalOperation` guard: drop empty children, consolidate single-child nested splits via `consolidateChildAt()`, ensure one child has auto size. `Layout.normalize()` runs after child mutations: delegates to `child.normalize()` when the child is a `Split`, promotes a lone remaining child to `layout.child`, and ensures a terminal empty `Panel` survives when the tree would otherwise have no panels.

Normalization is triggered **debounced** from `Layout.childMutated` (two frames): `dispatchMutation()` runs first, then `normalize()`. Render scheduling stays debounced separately. `withInternalOperation` prevents normalization edits from re-entering repair loops.

## Consequences

Between a structural mutator returning and the debounced normalization pass, observers may briefly see an un-normalized tree. `Layout` owns only root-scope invariants and consolidation into `Split | Panel`; it does not re-run every split rule on every edit (see ADR-0003). Invariants hold after normalization completes — safe to persist or traverse.
