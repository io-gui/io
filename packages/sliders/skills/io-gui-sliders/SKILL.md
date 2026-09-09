---
name: io-gui-sliders
description: >-
  Use WebGL IoSlider, IoSlider2d, IoSliderRange, and IoNumberSlider composites.
  Use when working with @io-gui/sliders, exponent scaling, or in-place array values.
---

# @io-gui/sliders

## Defaults

- Import from `@io-gui/sliders`.
- 1D: `IoSlider`. 2D: `IoSlider2d` (`[x,y]`). Range: `IoSliderRange` (`[start,end]`).
- Composites: `IoNumberSlider` / `IoNumberSliderRange` (inputs + slider).
- Non-linear mapping via **`exponent`** (1 = linear).

## Gotchas

- Built on core **`IoGl`**, not Three.js.
- `IoSlider` extends `IoGl` directly; 2D/range share **`IoSliderBase`** — don't assume one inheritance for all.
- Array values: mutate components **in place** + `dispatchMutation(value)` — don't replace the array every tick unless intentional.
- `min > max` inverts intentionally.
- Shift+arrows adjust value; plain arrows emit `io-focus-to`.
- Touch: scroll-like gestures pass through unless `noscroll`.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
