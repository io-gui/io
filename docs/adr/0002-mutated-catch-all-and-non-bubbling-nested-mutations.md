# The node catch-all is `mutated()`, and nested mutations do not auto-bubble

A reactive node's per-batch catch-all handler was named `changed()` because it fires after any of the node's properties change. Semantically, a property change *is* the node mutating: `ChangeQueue.dispatch()` runs the catch-all and then dispatches `io-object-mutation` about the node itself, in the same cycle.

We decided to rename the catch-all `changed()` → `mutated()` to reflect that a property change is a mutation of the owner node. Per-property change handlers stay `[prop]Changed(change)`, and per-property nested-object handlers stay `[prop]Mutated(event)`.

Deliberately, a nested object/child mutating in place does **not** promote to a mutation of its owner and does **not** auto-bubble; `onPropertyMutated` only invokes `[prop]Mutated()`. Bubbling a nested mutation upward is opt-in (`xMutated() { this.dispatchMutation() }`) and is considered an anti-pattern in most cases — the default keeps the graph quiet.

Chosen over keeping `changed()` (zero churn, and arguably an accurate name for "a property changed") because the team values the conceptual truth that a property change is an owner mutation, even at the cost of breaking churn.

## Consequences

`changed()` is likely the most-overridden method across all packages and downstream consumers; the rename is breaking and ecosystem-wide. No new bare nested-mutation catch-all is added — that asymmetry is intentional, not an oversight.
