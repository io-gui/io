# Sliders

The `@io-gui/sliders` context: WebGL-drawn continuous value controls (1D, 2D, range) and number+slider composites. Built on core `IoGl`, not Three.js.

## Language

**Exponent**:
Non-linear mapping between pointer position and value (`value = lerp(min, max, t^exponent)`). `1` is linear.
_Avoid_: gamma, curve, easing

**IoSliderBase**:
Shared base for multi-component pointer math (2D and range). Plain `IoSlider` extends `IoGl` directly and does not use this base.
_Avoid_: IoSlider (for the abstract base)

**Composite slider**:
`IoNumberSlider` / `IoNumberSliderRange` — an inputs number field bound beside a slider for the same value(s).
_Avoid_: labeled slider, hybrid control

**In-place array mutation**:
For 2D/range values held as arrays, components are written on the existing array and surfaced with `dispatchMutation()` — the array reference is not replaced on each drag tick.
_Avoid_: immutable tuple update, reassignment-only change

**Touch scroll passthrough**:
When a touch gesture looks like page scroll rather than a drag, the slider yields instead of capturing — unless `noscroll` forces capture.
_Avoid_: scroll lock, preventDefault mode
