---
status: accepted
---

# Structural invariants are enforced by reactive normalization on Split and Layout, not DOM events

A well-formed layout has invariants: no empty `Panel` or `Split`, no `Split` with a single child (consolidate — including when the parent is `Layout`, which then holds the lone child as `Split | Panel`), at least one child of every `Split` grows to fill space, exactly one `Tab` selected per non-empty `Panel`, and at least one `Panel` always survives at the root. Today these are restored imperatively by three DOM `CustomEvent`s — `io-panel-remove`, `io-split-remove`, `io-split-consolidate` — that bubble up the *element* tree, each `IoSplit` editing `this.split.children` based on `this.parentElement`. Structural repair therefore depends on the DOM existing and matching the model.

We decided to move enforcement into the model layer as **normalization**. Each `Split` runs a guarded, **synchronous** `normalize()` at the end of structural edits (and from `childrenMutated()` when children change externally) that fixes its own local invariants (drop empty children, consolidate a single-child child-split by adopting it, ensure one child grows). The `Layout` runs its own `normalize()` when its child mutates: if consolidation would leave a single `Panel`, the layout's child becomes that `Panel`; if the last tab of the last panel is removed, an empty `Panel` is kept as the terminal state. Because nested mutations surface on parent nodes via Core's mutation propagation, split repair cascades upward; when a split under `Layout` collapses to one child, `Layout` absorbs it. The three DOM structural events are then deleted.

Chosen over keeping the DOM events as mere triggers for model methods (still couples repair to a live, matching element tree) and over a single coarse "re-normalize the whole tree on any mutation" orchestrator (centralized and expensive). `Layout` owns only root-scope invariants and consolidation into `Split | Panel`; it does not re-run every split rule on every edit (see ADR-0003).

## Consequences

Normalization must run inside a re-entrancy guard (`withInternalOperation`) so its own edits do not re-trigger it into a loop. Invariants hold when structural methods return — safe to persist or traverse immediately after `removeTab`, `moveTab`, etc. Debounce applies to view `mutated()` / render only, not to repair. This is a target design; it depends on ADR-0001 and ADR-0003. The current DOM-event mechanism remains until the models own the operations it coordinates.
