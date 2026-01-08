# @io-gui/icons

SVG icon system for Io-Gui with namespace-based icon registration.

## Overview

```
IconsetSingleton (global registry)
    └── registers SVG icons by namespace

IoIcon (element)
    └── renders icons from registry
```

## Usage

### Displaying Icons

```typescript
import { IoIcon } from 'io-icons'

// Using constructor
const icon = new IoIcon({ value: 'io:gear' })

// Using vDOM factory
ioIcon({ value: 'io:gear', size: 'medium' })
```

### Icon Reference Format

Icons are referenced using `namespace:id` format:

```typescript
value="io:gear"      // namespace: "io", id: "gear"
value="io:check"     // namespace: "io", id: "check"
value="custom:logo"  // namespace: "custom", id: "logo"
```

If no colon is present, the value is rendered as text content.

## Elements

### IoIcon

SVG icon element that displays icons from the global registry.

```typescript
type IoIconProps = {
  value: string                    // Icon reference "namespace:id" or text
  stroke?: boolean                 // Enable stroke styling
  size?: 'small' | 'medium'        // Icon size variant
}
```

**Properties:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | string | `''` | Icon reference or text content |
| `stroke` | boolean | `false` | Adds stroke styling |
| `size` | string | `'small'` | `'small'` = line height, `'medium'` = field height |

**Key behaviors:**
- Hidden when `value` is empty
- Falls back to text content when no colon in value
- Inherits fill color from `--io_color` CSS variable
- SVG viewBox is fixed at `0 0 24 24`

## IconsetSingleton

Global singleton for registering and retrieving SVG icons.

### Registering Custom Icons

```typescript
import { IconsetSingleton } from 'io-icons'

const customIcons = `
<svg>
  <g id="my-icon">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
  </g>
  <g id="another-icon">
    <circle cx="12" cy="12" r="10"/>
  </g>
</svg>
`

IconsetSingleton.registerIcons('custom', customIcons)

// Now available as:
// 'custom:my-icon'
// 'custom:another-icon'
```

### SVG Format Requirements

- Wrap icons in a parent `<svg>` element
- Each icon must be a `<g>` element with a unique `id` attribute
- Icons should be designed for 24x24 viewBox
- Fill color should be omitted or set to `currentColor` for theme compatibility

### Retrieving Icons

```typescript
const svg = IconsetSingleton.getIcon('io:gear')
// Returns: '<svg viewBox="0 0 24 24" ...><g class="icon-id-gear">...</g></svg>'
```

## Built-in Icons

The `io` namespace includes a comprehensive icon set:

**Navigation:**
`chevron_left`, `chevron_right`, `chevron_up`, `chevron_down`, `arrow_left`, `arrow_right`, `arrow_up`, `arrow_down`, `arrow_home`, `arrow_end`

**Actions:**
`check`, `close`, `search`, `gear`, `tune`, `trash`, `undo`, `redo`, `reload`, `link`, `unlink`

**UI:**
`hamburger`, `more_horizontal`, `more_vertical`, `fullscreen`, `fullscreen_off`, `visibility`, `visibility_off`

**Shapes:**
`circle`, `circle_fill`, `box`, `box_fill`, `triangle_up`, `triangle_down`, `triangle_left`, `triangle_right`

**Status:**
`circle_info`, `circle_warning`, `circle_help`, `circle_checked`, `lock`, `unlock`

**Numeric:**
`numeric-0` through `numeric-9`, `numeric-0-box` through `numeric-9-box`

## Styling

Icons inherit color from their parent and can be styled via CSS:

```css
io-icon {
  fill: var(--io_color);
}

io-icon[stroke] {
  stroke: var(--io_colorStrong);
  stroke-width: var(--io_borderWidth);
}

io-icon[size=small] {
  width: var(--io_lineHeight);
  height: var(--io_lineHeight);
}

io-icon[size=medium] {
  width: var(--io_fieldHeight);
  height: var(--io_fieldHeight);
}
```
