# CONTEXT.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Be opinionated.** When multiple words exist for the same concept, pick the best one and list the others under `_Avoid_`.
- **Keep definitions tight.** One or two sentences max. Define what it IS, not what it does.
- **Only include terms specific to this project's context.** General programming concepts (timeouts, error types, utility patterns) don't belong even if the project uses them extensively. Before adding a term, ask: is this a concept unique to this context, or a general programming concept? Only the former belongs.
- **Group terms under subheadings** when natural clusters emerge. If all terms belong to a single cohesive area, a flat list is fine.

## Context Map - multi-context repos

**Multiple contexts:** A `CONTEXT.md` lists the contexts, where they live, and how they relate to each other:

## Contexts

- [Core](./packages/core/CONTEXT.md) — the shared reactive system: properties, change/mutation propagation, bindings, rendering. Every other context is built from these primitives.
- [Layout](./packages/layout/CONTEXT.md) — IDE-like tabbed, split, drag-and-drop panel layouts (`@io-gui/layout`).
- [Menus](./packages/menus/CONTEXT.md) — hierarchical option trees presented as dropdowns, menu bars, context menus, and trees (`@io-gui/menus`).

## Relationships

- **Core → Layout**: Layout's `Split`, `Panel`, and `Tab` are `ReactiveObject` models; `IoSplit`, `IoPanel`, `IoTab` (etc.) are `ReactiveElement` views. Both live in one Core reactive graph, so a `Tab` mutation propagates across the object/element boundary to its view without any DOM reference held by the model. Layout adds no new propagation mechanism — it is a concrete use of Core's cross-domain reactivity.
- **Core → Menus**: Menus follows the same pattern — `Menu`/`Option` are `ReactiveObject` models, the paired views and entry points are `ReactiveElement`s, all in one reactive graph. Selection persists through Core's `Storage` bindings (Path/`selectedID`), not through its own mechanism.
- **Menus → Layout**: `IoLayout` composes menus elements for tab chrome (add-tab picker, tab overflow menus); Layout models never reference menus models.
- **Menus → Navigation**: `IoNavigator` presents one `Menu` as a menu bar/tree and mirrors its selection (`selectedID` deep, `getSelectedIDImmediate()` shallow).
```

The skill infers which structure applies:

- If `CONTEXT.md` exists, read it to find contexts
- If only a root `CONTEXT.md` exists, single context
- If neither exists, create a root `CONTEXT.md` lazily when the first term is resolved

When multiple contexts exist, infer which one the current topic relates to. If unclear, ask.
