# Context Map

Io-Gui has one foundational context (the reactive core) plus application-domain contexts built on top of it. Only contexts that have been deliberately modeled are listed here; more may be added as their vocabulary is pinned down.

## Contexts

- [Core](./CONTEXT.md) — the shared reactive system: properties, change/mutation propagation, bindings, rendering. Every other context is built from these primitives.
- [Layout](./packages/layout/CONTEXT.md) — IDE-like tabbed, split, drag-and-drop panel layouts (`@io-gui/layout`).
- [Menus](./packages/menus/CONTEXT.md) — hierarchical option trees presented as dropdowns, menu bars, context menus, and trees (`@io-gui/menus`).

## Relationships

- **Core → Layout**: Layout's `Split`, `Panel`, and `Tab` are `ReactiveObject` models; `IoSplit`, `IoPanel`, `IoTab` (etc.) are `ReactiveElement` views. Both live in one Core reactive graph, so a `Tab` mutation propagates across the object/element boundary to its view without any DOM reference held by the model. Layout adds no new propagation mechanism — it is a concrete use of Core's cross-domain reactivity.
- **Core → Menus**: Menus follows the same pattern — `Menu`/`Option` are `ReactiveObject` models, the paired views and entry points are `ReactiveElement`s, all in one reactive graph. Selection persists through Core's `Storage` bindings (Path/`selectedID`), not through its own mechanism.
- **Menus → Layout**: `IoLayout` composes menus elements for tab chrome (add-tab picker, tab overflow menus); Layout models never reference menus models.
- **Menus → Navigation**: `IoNavigator` presents one `Menu` as a menu bar/tree and mirrors its selection (`selectedID` deep, `getSelectedIDImmediate()` shallow).
