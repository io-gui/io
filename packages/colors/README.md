# Io-Colors

Color picker components for Io-Gui with RGB, HSL, and HSV color model support.

## Overview

```
IoColorPicker
└── IoColorPanelSingleton (overlay)
    ├── IoColorSlider (sv - 2D saturation/value)
    ├── IoColorSlider (h - hue)
    └── IoColorSlider (a - alpha, optional)

IoColorRgba
├── IoColorSwatch
└── IoColorSlider[] (r, g, b, a)
```

## Color Value Format

All color components use RGBA objects with values normalized to 0-1:

```typescript
type ColorValue = {
  r: number  // 0-1
  g: number  // 0-1
  b: number  // 0-1
  a?: number // 0-1, optional
}
```

## Elements

### IoColorPicker

Compact color picker that expands `IoColorPanelSingleton` on click.

```typescript
type IoColorPickerProps = {
  value: ColorValue  // Color object with r, g, b, a properties
}
```

**Key behaviors:**
- Displays an `IoColorSwatch` preview
- Expands panel singleton on click, Enter, or Space
- Panel is positioned using `nudge()` utility

### IoColorSwatch

Displays a colored square with transparency checkerboard background.

```typescript
type IoColorSwatchProps = {
  value: ColorValue
}
```

### IoColorSlider

Generic color slider wrapper that renders channel-specific sliders.

```typescript
type IoColorSliderProps = {
  value: ColorValue
  channel: 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'v' | 'l' | 'hs' | 'sv' | 'sl'
  step?: number       // defaults to 0.01
  vertical?: boolean  // vertical orientation
}
```

**Available channels:**
| Channel | Type | Description |
|---------|------|-------------|
| `r` | 1D | Red (0-1) |
| `g` | 1D | Green (0-1) |
| `b` | 1D | Blue (0-1) |
| `a` | 1D | Alpha (0-1) |
| `h` | 1D | Hue (0-1, maps to 0-360°) |
| `s` | 1D | Saturation (0-1) |
| `v` | 1D | Value/Brightness (0-1) |
| `l` | 1D | Lightness (0-1) |
| `hs` | 2D | Hue + Saturation |
| `sv` | 2D | Saturation + Value |
| `sl` | 2D | Saturation + Lightness |

### IoColorRgba

Expanded color editor with swatch and individual RGBA sliders.

```typescript
type IoColorRgbaProps = {
  value: ColorValue
}
```

### IoColorPanelSingleton

Global singleton overlay containing the expanded color picker UI. Automatically appended to `IoOverlaySingleton`.

**Key behaviors:**
- Shows SV (saturation/value) 2D slider + H (hue) vertical slider
- Alpha slider appears only when `value.a` is defined
- Collapses on Escape, Enter, or Space

## Color Model Conversions

The package exports conversion utilities:

```typescript
import { rgb2hsl, hsl2rgb, rgb2hsv, hsv2rgb } from 'io-colors'

// RGB arrays use 0-255 range
// HSL/HSV arrays use: [0-360, 0-100, 0-100]

const hsl = rgb2hsl([255, 128, 64])  // [20, 100, 62.5]
const rgb = hsl2rgb([20, 100, 62.5]) // [255, 128, 64]
```

## Data Flow

```
User drags slider
    ↓
IoColorSlider._onValueInput()
    ↓
Updates internal HSV/HSL → converts to RGB → updates value object
    ↓
Dispatches 'value-input' event
    ↓
IoColorBase.valueMutated() triggers re-render
```

## Events

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `value-input` | IoColorSlider, IoColorPanel | `{ property: 'value', value }` | Color value changed |

## Edge Cases

### Hue Preservation
When saturation or value reaches 0, the hue information would normally be lost during RGB conversion. `IoColorBase` preserves the original hue:

- Hue at 0° or 360° retains previous hue value
- Saturation at 0 retains previous hue
- Value/Lightness at 0 or 100 retains previous hue and saturation

### Alpha Channel
The alpha slider only renders when `value.a` is defined. Components handle both RGB and RGBA values:

```typescript
// RGB only - no alpha slider
picker.value = { r: 1, g: 0.5, b: 0 }

// RGBA - alpha slider appears
picker.value = { r: 1, g: 0.5, b: 0, a: 0.8 }
```

### WebGL Rendering
Color sliders extend `IoSlider` and `IoSlider2d` which use WebGL for rendering. Channel-specific GLSL shaders compute gradient colors dynamically based on the current color state.
