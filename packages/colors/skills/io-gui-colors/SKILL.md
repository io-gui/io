---
name: io-gui-colors
description: >-
  Edit colors with IoColorPicker, IoColorRgba, and channel sliders using 0–1
  ColorValue objects. Use when working with @io-gui/colors or color channel UI.
---

# @io-gui/colors

## Defaults

- Import from `@io-gui/colors`.
- Element `value` is **ColorValue**: `{r,g,b,a?}` each **0–1**, plain object.
- Compact UI: `IoColorPicker` → expands `IoColorPanelSingleton`. Expanded: `IoColorRgba`.

## Gotchas

- **Not core `Color`.** Theme tokens use `@io-gui/core` `Color`. Do not assign `Color` instances as picker values.
- Not 0–255 (conversion helpers may use 0–255 arrays at the boundary only).
- Alpha slider only when `value.a` is defined.
- Hue is preserved when S/V/L hit extremes that would lose hue in RGB round-trips.
- Panel singleton lives in overlay; set source/expand from the picker — don't create ad-hoc panels.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
