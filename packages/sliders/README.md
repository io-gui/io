# Io-Sliders

WebGL-rendered slider components for Io-Gui.

## Overview

```
IoSliderBase (abstract base)
├── IoSlider (1D horizontal/vertical)
└── IoSlider2d (2D XY pad)

IoSliderRange (1D range with two handles)

IoNumberSlider
├── IoNumber
└── IoSlider

IoNumberSliderRange
├── IoNumber (min)
├── IoSliderRange
└── IoNumber (max)
```

## Elements

### IoSlider

1D slider for single numeric value.

```typescript
type IoSliderProps = {
  value?: number
  step?: number      // defaults to 0.01
  min?: number       // defaults to 0
  max?: number       // defaults to 1
  exponent?: number  // defaults to 1 (linear)
  vertical?: boolean // vertical orientation
  noscroll?: boolean // disable touch scroll detection
  disabled?: boolean
}
```

**Key behaviors:**
- WebGL-rendered with GLSL shaders
- Grid visualization for step increments
- Non-linear scaling via `exponent` property
- Pointer capture for smooth dragging
- Touch-aware scroll detection

### IoSlider2d

2D slider for XY coordinate pairs.

```typescript
type IoSlider2dProps = {
  value?: [number, number]
  step?: [number, number]      // defaults to [0.01, 0.01]
  min?: [number, number]       // defaults to [-1, -1]
  max?: [number, number]       // defaults to [1, 1]
  vertical?: boolean
}
```

**Key behaviors:**
- Crosshair cursor
- Grid with axis lines at origin
- Draggable knob indicator
- All axis properties accept `[x, y]` tuples

### IoSliderRange

Range slider with two draggable handles.

```typescript
type IoSliderRangeProps = {
  value?: [number, number]  // [start, end]
  step?: number
  min?: number
  max?: number
  exponent?: number
  vertical?: boolean
}
```

### IoNumberSlider

Combined number input and slider.

```typescript
type IoNumberSliderProps = {
  value?: number
  step?: number
  min?: number
  max?: number
  exponent?: number
  conversion?: number  // Display multiplier (default 1)
}
```

**Key behaviors:**
- Number field for precise input
- Slider for visual adjustment
- Both controls sync bidirectionally

### IoNumberSliderRange

Combined number inputs and range slider.

```typescript
type IoNumberSliderRangeProps = {
  value?: [number, number]
  step?: number
  min?: number
  max?: number
  exponent?: number
  conversion?: number
}
```

## Non-Linear Scaling

The `exponent` property enables non-linear value distribution:

```typescript
// Linear (default)
ioSlider({ exponent: 1, min: 0, max: 100 })

// Quadratic - more precision at low values
ioSlider({ exponent: 2, min: 0, max: 100 })

// Square root - more precision at high values
ioSlider({ exponent: 0.5, min: 0, max: 100 })
```

The visual position is computed as `position^exponent`, affecting both display and input mapping.

## Touch Scroll Detection

On touch devices, sliders detect scroll intent to avoid hijacking page scroll:

1. On `touchstart`, record initial position
2. On `touchmove`, measure displacement
3. If movement aligns with slider axis (>5px, dominant direction), capture touch
4. If movement is perpendicular, allow scroll passthrough

Set `noscroll: true` to always capture touch regardless of direction.

## Keyboard Controls

All sliders support keyboard interaction when focused:

| Key | Action |
|-----|--------|
| `Shift + ArrowLeft/Down` | Decrease by step |
| `Shift + ArrowRight/Up` | Increase by step |
| `Shift + Home` | Set to min |
| `Shift + End` | Set to max |
| `Shift + PageUp/PageDown` | Increase/decrease by step |
| Arrow keys (without Shift) | Focus navigation |

For 2D sliders:
- `Shift + ArrowLeft/Right` - Adjust X axis
- `Shift + ArrowUp/Down` - Adjust Y axis

## WebGL Rendering

Sliders extend `IoGl` and render using GLSL shaders. Each slider defines:
- `static get Frag()` - Fragment shader for visual rendering
- `static get GlUtils()` - Shared GLSL utilities

Theme variables are available in shaders as uniforms:
- `io_bgColorInput`, `io_bgColorLight`, `io_bgColorBlue`
- `io_color`, `io_borderWidth`, `io_fieldHeight`

Slider-specific uniforms:
- `uValue`, `uMin`, `uMax`, `uStep`, `uExponent`
- `uSize` (element dimensions)
- `uVertical` (orientation flag)
- `uInvalid` (validation state)

## Events

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `value-input` | All sliders | `{ value, oldValue }` | Value changed by user |
| `io-focus-to` | All sliders | `{ source, command }` | Focus navigation request |

## Accessibility

All sliders include ARIA attributes:

- `role="slider"`
- `aria-valuenow` - Current value
- `aria-valuemin` - Minimum value
- `aria-valuemax` - Maximum value
- `aria-invalid` - Validation state
- `aria-disabled` - Disabled state

## Edge Cases

### Inverted Range
If `min > max`, the slider operates in reverse. Keyboard controls automatically invert to maintain intuitive direction.

### NaN Handling
Invalid values show `invalid` attribute and set `aria-invalid="true"`. The visual slider shows empty state.

### Value Clamping
Values are always clamped to `[min, max]` range and rounded to nearest `step` on input. Final precision is fixed to 5 decimal places.

### Object/Array Values
For 2D sliders and range sliders, the value array is mutated in place and `dispatchMutation()` is called to notify observers.
