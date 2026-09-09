# Colors

The `@io-gui/colors` context: interactive editors for color channels. Values are plain RGBA objects in 0–1 space — not the core `Color` class used by Theme. Sliders and a panel singleton edit channels; conversion helpers speak 0–255 arrays at the boundary.

## Language

**ColorValue**:
A plain object `{r, g, b, a?}` with each channel in 0–1. The wire and binding shape for all colors elements. Distinct from core's `Color` class (hex/CSS, theme tokens).
_Avoid_: Color (core class), RGB 0–255 object, hex string (as the element value type)

**Channel**:
Which dimension a color slider edits: 1D (`r`/`g`/`b`/`a`/`h`/`s`/`v`/`l`) or 2D (`hs`/`sv`/`sl`). Hue is stored 0–1 (maps to 0–360°).
_Avoid_: component, axis, slider type

**Hue preservation**:
Keeping the last meaningful hue when saturation/value/lightness collapse would otherwise lose it in an RGB round-trip.
_Avoid_: hue lock, sticky hue

**Alpha presence**:
Whether `a` exists on the ColorValue. When defined, alpha UI is shown; when omitted, the color is treated as opaque without an alpha slider.
_Avoid_: opacity flag, hasAlpha property

**IoColorPanelSingleton**:
Shared overlay panel (SV + hue + optional alpha) opened by compact pickers. Lives in `IoOverlaySingleton`; views set source and expand — they do not own panel state.
_Avoid_: IoColorPanel, color popup
