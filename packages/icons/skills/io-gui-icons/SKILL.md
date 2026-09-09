---
name: io-gui-icons
description: >-
  Display and register SVG icons via IconsetSingleton and IoIcon using namespace:id
  references. Use when working with @io-gui/icons or icon labels on other elements.
---

# @io-gui/icons

## Defaults

- Import from `@io-gui/icons`.
- Reference format: **`namespace:id`** (e.g. `io:gear`).
- Register custom SVG groups on **`IconsetSingleton`**; render with **`IoIcon`** / `ioIcon`.

## Gotchas

- Register markup as `<g id="…">` inside a wrapper `<svg>`; viewBox **24×24**.
- **No colon** ⇒ value rendered as **text**, not an icon miss.
- Empty `value` ⇒ element hidden.
- Fill from `--io_color`; stroke via `stroke` prop + `--io_colorStrong`.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
