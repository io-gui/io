---
status: accepted (target); migration in progress
---

# The root is a Layout model whose child is Split or Panel

Every arrangement has a `Layout` model and an `IoLayout` view. The layout's **child** is either a `Split` or a `Panel` — not always a `Split`. When the tree collapses to a single panel, consolidation promotes that panel to be the layout's child directly; there is no permanent "root split with one child" exemption.

We decided this over always wrapping the tree in a root `Split` because that forced a standing violation of the no-single-child-split rule, pushed root-only invariants (`isRootPanel`, "at least one panel survives") into DOM sniffing on `IoPanel`/`IoSplit`, and made normalization language in the glossary untrue at the top of the tree. A uniform `Split`-only root was simpler to type and render, but it exported structural exceptions forever.

The `Layout` owns tree-scoped operations and invariants: cross-panel tab moves, drag scope, and ensuring an empty `Panel` survives when all tabs are removed. Local split invariants stay on `Split` (see ADR-0002). `IoLayout` renders `ioSplit` or `ioPanel` from the child type and passes the shared `elements` pool down, replacing the current pattern of a bare root `ioSplit`.

## Consequences

Serialization's top level becomes a `Layout` envelope (or equivalent) whose payload is `{type: 'split', ...}` or `{type: 'panel', ...}`. Persisted layouts store structure and tab ids only — not the elements pool; the application re-supplies `IoLayout.elements` on restore. Persisted layouts need a version bump or migration shim. `IoTab` drag and `removeTab` root checks move from DOM parent walks to `Layout` model queries. ADR-0002 drops the root-`Split` special case for "panel survives"; that rule lives on `Layout` instead.
