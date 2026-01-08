# Io-Inputs

Basic input elements for Io-Gui including fields, buttons, and number inputs.

## Overview

```
IoField (base class)
├── IoButton
├── IoString
├── IoNumber
│   └── IoNumberLadderSingleton (overlay)
└── IoBoolean
    └── IoSwitch
```

## Elements

### IoField

Base class for all input elements. Provides interaction handling, appearance modes, and accessibility features.

```typescript
type IoFieldProps = {
  value?: any
  icon?: string
  label?: string
  selected?: boolean
  disabled?: boolean
  appearance?: 'neutral' | 'inset' | 'outset'
}
```

**Appearance modes:**
| Mode | Description |
|------|-------------|
| `neutral` | Transparent background, no border |
| `inset` | Sunken appearance with input background |
| `outset` | Raised button-like appearance |

**Key behaviors:**
- Pointer capture for drag interactions
- Keyboard navigation via `io-focus-to` event
- Caret position management for editable fields
- ARIA attribute management

### IoButton

Clickable button element that invokes an action.

```typescript
type IoButtonProps = IoFieldProps & {
  action?: (value: any) => void
}
```

**Key behaviors:**
- Default appearance: `outset`
- Calls `action(value)` on click
- Dispatches `io-button-clicked` event
- Supports Enter/Space activation

### IoString

Text input for string values with contentEditable.

```typescript
type IoStringProps = IoFieldProps & {
  value?: string
  live?: boolean        // Update on every keystroke
  placeholder?: string
}
```

**Key behaviors:**
- Default appearance: `inset`
- Value commits on blur or Enter
- Arrow key navigation at text boundaries
- Shift+Enter attempts JSON parse (for object strings)

### IoNumber

Numeric input with step, min/max constraints and optional ladder UI.

```typescript
type IoNumberProps = IoFieldProps & {
  value?: number
  live?: boolean        // Update on every keystroke
  step?: number         // defaults to 0.0001
  min?: number          // defaults to -Infinity
  max?: number          // defaults to Infinity
  conversion?: number   // Display multiplier (default 1)
  ladder?: boolean      // Show ladder on click
}
```

**Key behaviors:**
- Default appearance: `inset`
- Clamps to min/max, rounds to step
- Home/End keys set min/max values
- Ladder expands on click (if enabled) or middle-click/Ctrl+click
- Comma normalized to period for decimal input

### IoBoolean

Boolean toggle displayed as text.

```typescript
type IoBooleanProps = IoFieldProps & {
  value?: boolean
  true?: string   // Label for true state (default: 'true')
  false?: string  // Label for false state (default: 'false')
}
```

**Key behaviors:**
- Toggles on click, Enter, or Space
- Custom labels can be text or icon references (e.g., `'io:check'`)
- Dispatches `io-boolean-clicked` event

### IoSwitch

Toggle switch with animated knob.

```typescript
type IoSwitchProps = IoBooleanProps
```

**Key behaviors:**
- Extends `IoBoolean` with switch styling
- Animated transition between states
- Blue highlight when active

## IoNumberLadderSingleton

Global overlay for precision number input. Displays step increment buttons arranged vertically.

**Key behaviors:**
- Steps scale exponentially: 10000×, 1000×, 100×, 10×, 1×, 0.1×, 0.01×, 0.001× of base step
- Horizontal drag changes value at focused step rate
- Up/Down arrows navigate between step levels
- Left/Right arrows change value by focused step
- Shift key rounds value to step increment
- Escape closes and returns focus

## Events

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `value-input` | All inputs | `{ value, oldValue }` | Value changed by user |
| `io-button-clicked` | IoButton | `{ value }` | Button activated |
| `io-boolean-clicked` | IoBoolean | `{ value }` | Boolean toggled |
| `io-focus-to` | All inputs | `{ source, command }` | Focus navigation request |

## Keyboard Navigation

All inputs support arrow key navigation via the `io-focus-to` event system:

- **ArrowLeft/Right/Up/Down** - Navigate to adjacent focusable elements
- **Tab** - Standard tab navigation
- **Home/End** - Navigate to first/last element (or set min/max in IoNumber)
- **PageUp/PageDown** - Page-level navigation

For editable fields (IoString, IoNumber), arrow keys navigate only when caret is at text boundary or Ctrl is held.

## Accessibility

All inputs include proper ARIA attributes:

- `role` - Semantic role (textbox, button, checkbox, slider)
- `aria-label` - From label property
- `aria-disabled` - Disabled state
- `aria-invalid` - Validation state
- `aria-valuenow/min/max/step` - Numeric range info
- `aria-checked` - Boolean state
- `aria-pressed` - Button press state
