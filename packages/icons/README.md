# @io-gui/icons

SVG icon system for Io-Gui with namespace-based icon registration.

See [live examples here](https://iogui.dev/io/#path=Demos,Icons)

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
import { IoIcon } from '@io-gui/icons'

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
import { IconsetSingleton } from '@io-gui/icons'

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
- Each icon is a `<g>` element with an `id`, unique in its namespace. Every element with an `id` is registered, nested ones too, so put ids on the groups only
- Registering an existing `namespace:id` again (in the same markup or a later call) replaces it; an id defined twice in one markup warns in debug builds
- Icons render in a fixed `0 0 24 24` viewBox. Artwork drawn in another coordinate system needs a `transform` on its group
- Omit `fill` so the icon takes `--io_color` and follows field states; also drop `width`, `height` and `xmlns`

### Icons from Material Symbols

[Material Symbols](https://fonts.google.com/icons) (Apache-2.0) use a `0 -960 960 960` viewBox. Keep the `<path d>` of the 24px SVG and wrap it in a group that maps it onto the 24×24 box (translate by 960, then scale 960 to 24):

```typescript
IconsetSingleton.registerIcons('app', /* html */`
<svg>
  <g id="play" transform="scale(0.025) translate(0 960)">
    <path d="M320-200v-560l440 280-440 280Z"/>
  </g>
</svg>`)
```

Each icon's SVG is at `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/<name>/default/24px.svg`; use `fill1` instead of `default` for the filled variant, or the `materialsymbolsrounded` / `materialsymbolssharp` families. Name ids by what they do in your UI (`skip_start`) rather than by the glyph (`skip_previous`).

### A Package's Own Namespace

A package registers its namespace in a side-effect module, imported by the elements that use the icons and by the package index, and listed in the package's `sideEffects` so bundlers keep it. `@io-gui/three` registers `three:` icons for its timeline this way (`src/icons/threeIcons.ts`).

### Retrieving Icons

```typescript
const svg = IconsetSingleton.getIcon('io:gear')
// Returns: '<svg viewBox="0 0 24 24" ...><g class="icon-id-gear">...</g></svg>'
```

An unknown reference returns an empty `<svg>`, without a warning. `hasIcon` tells whether a reference is registered:

```typescript
IconsetSingleton.hasIcon('io:gear') // true
IconsetSingleton.hasIcon('Mode: on') // false
```

## Built-in Icons

The `io` namespace includes a comprehensive icon set:

**Navigation:**
`chevron_left`, `chevron_right`, `chevron_up`, `chevron_down`, `chevron_home`, `chevron_end`, `arrow_left`, `arrow_right`, `arrow_up`, `arrow_down`, `arrow_home`, `arrow_end`, `less`, `more`

**Actions:**
`check`, `close`, `close_small`, `search`, `zoom_in`, `zoom_out`, `gear`, `trash`, `trash_empty`, `undo`, `redo`, `reload`, `link`, `unlink`, `backspace`, `code`, `color_picker`

**UI:**
`hamburger`, `more_horizontal`, `more_vertical`, `fullscreen`, `fullscreen_off`, `visibility`, `visibility_off`, `lock`, `unlock`, `rows`, `columns`, `dashboard`, `grid`, `grid_fill`, `layers`, `layers_off`, `layer_add`, `layer_remove`, `layer_to_back`, `layer_to_front`, `layer_image`, `image`, `label`, `label_fill`, `toggle_on`, `slider`, `sliders`, `dark_mode`, `light_mode`, `theme`

**Shapes:**
`circle`, `circle_fill`, `circle_fill_red`, `circle_fill_green`, `circle_fill_blue`, `box`, `box_fill`, `box_focus`, `triangle_up`, `triangle_down`, `triangle_left`, `triangle_right`, `circle_triangle_up`, `circle_triangle_down`, `circle_triangle_left`, `circle_triangle_right`, `diagonal_line`

**Status:**
`circle_info`, `circle_warning`, `circle_help`, `circle_checked`, `circle_minus`, `circle_plus`, `circle_close`, `circle_pause`, `circle_location`, `circle_location_checked`, and filled variants: `circle_fill_info`, `circle_fill_warning`, `circle_fill_help`, `circle_fill_checked`, `circle_fill_minus`, `circle_fill_plus`, `circle_fill_pause`, `circle_fill_group`, `circle_fill_arrow_up`, `circle_fill_arrow_down`, `circle_fill_arrow_left`, `circle_fill_arrow_right`, `box_fill_checked`, `box_fill_minus`, `box_fill_plus`, `box_fill_gear`

**Media and topics:**
`camera`, `camera_alt`, `film`, `color_palette`, `hub`, `editors`, `calendar_check`, `school`, `package`, `ads_click`, `translate`, `routine`, `kid_star`, `swipe`, `hint`, `book`

**Brand and demo navigation:**
`io`, `io_logo`, `inputs`, `icons`, `colors`, `menus`, `navigation`

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
