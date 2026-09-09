---
name: io-gui-navigation
description: >-
  Wire IoNavigator / IoSelector content switching to a menus Menu model with
  select depth, caching, and anchor sync. Use when working with @io-gui/navigation,
  IoCollapsible, or menu-driven routing.
---

# @io-gui/navigation

## Defaults

- Import from `@io-gui/navigation`. Depends on `@io-gui/menus` for the model.
- `IoNavigator` takes `model: Menu` (or Option scope) + `elements` whose **`id` matches Option ids**.
- `menu`: `top` | `left` | `none` (selector only, still routed by the model).
- `select`: `shallow` | `deep` | `all` | `none` — how selection maps to shown content (not Option Mode).

## Gotchas

- Reuse menus vocabulary for Menu/Option/selectedID — do not invent a parallel routing model.
- `shallow` uses immediate scope selection (`getSelectedIDImmediate()`); `deep` uses deepest `selectedID`.
- Cache keys are element ids — **colliding ids** across templates reuse the wrong cached instance.
- Proactive caching runs on idle frames; many dynamic `import`s warm slowly.
- Anchor sync targets `[data-heading]` (markdown package stamps these). 120ms debounce breaks scroll↔anchor loops.
- **`IoNavigatorDrawer` ≠ layout Drawer.**

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- Menus vocabulary: [menus CONTEXT.md](../../../menus/CONTEXT.md)
- API: [README.md](../../README.md)
