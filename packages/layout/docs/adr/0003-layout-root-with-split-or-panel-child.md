---
status: completed
---

# The root is a Layout model whose child is Split or Panel

Every arrangement has a `Layout` model and an `IoLayout` view. The layout's **child** is either a `Split` or a `Panel`. When the tree collapses to a single panel, consolidation promotes that panel to be the layout's child directly — there is no standing one-child root `Split`.

`Layout` owns tree-scoped operations and root invariants: cross-panel tab moves (`moveTab`), and ensuring an empty `Panel` survives when all tabs are removed. Local split invariants stay on `Split` (see ADR-0002). `IoLayout` renders `ioSplit` or `ioPanel` from the child type and passes the shared `elements` pool down.

## Consequences

Serialization's top level is a `Layout` envelope whose payload is `{type: 'split', ...}` or `{type: 'panel', ...}`. Persisted layouts store structure and tab metadata only — not the elements pool; the application re-supplies `IoLayout.elements` on restore. Root checks for tab drag and removal use `Layout` model queries rather than DOM parent walks.
