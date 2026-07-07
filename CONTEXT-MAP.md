# Context Map

Io-Gui has one foundational context (the reactive core) plus application-domain contexts built on top of it. Only contexts that have been deliberately modeled are listed here; more may be added as their vocabulary is pinned down.

## Contexts

- [Core](./CONTEXT.md) — the shared reactive system: properties, change/mutation propagation, bindings, rendering. Every other context is built from these primitives.
- [Layout](./packages/layout/CONTEXT.md) — IDE-like tabbed, split, drag-and-drop panel layouts (`@io-gui/layout`).
- [Menus](./packages/menus/CONTEXT.md) — hierarchical option trees presented as dropdowns, menu bars, context menus, and trees (`@io-gui/menus`).

## Relationships

- **Core → Layout**: Layout's `Split`, `Panel`, and `Tab` are `ReactiveObject` models; `IoSplit`, `IoPanel`, `IoTab` (etc.) are `ReactiveElement` views. Both live in one Core reactive graph, so a `Tab` mutation propagates across the object/element boundary to its view without any DOM reference held by the model. Layout adds no new propagation mechanism — it is a concrete use of Core's cross-domain reactivity.
