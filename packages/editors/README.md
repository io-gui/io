# @io-gui/editors

Property editing components for Io-Gui with configurable widget selection and grouping.

## Overview

```
IoInspector
├── IoBreadcrumbs (navigation)
└── IoPropertyEditor (current object)
    ├── Widget (optional, type-specific)
    └── Property rows
        ├── Label
        └── Editor widget (IoString, IoNumber, IoBoolean, etc.)

IoObject (collapsible)
└── IoPropertyEditor

EditorConfig (widget selection)
EditorGroups (property grouping)
```

## Configuration System

### EditorConfig

Determines which widget to use for each property. Configuration is matched by priority:

1. **Exact property name** - `{ name: 'color', tag: 'io-color-picker' }`
2. **Value type** - `{ type: Number, tag: 'io-number' }`
3. **RegExp pattern** - `{ name: /^on[A-Z]/, tag: 'io-button' }`

```typescript
type PropertyConfig = {
  name?: string | RegExp      // Property name or pattern
  type?: AnyConstructor       // Value constructor
  tag?: string                // Widget element tag
  props?: Record<string, any> // Props to pass to widget
}
```

**Built-in defaults:**
| Type | Widget |
|------|--------|
| `Number` | `io-number` |
| `String` | `io-string` |
| `Boolean` | `io-boolean` |
| `Object` | `io-object` |
| `Array` | `io-object` |
| `Function` | `io-button` |

**Custom registration:**
```typescript
import { registerEditorConfig } from 'io-editors'

registerEditorConfig(MyClass, [
  { name: 'position', tag: 'io-vector', props: { labels: ['x', 'y', 'z'] } },
  { name: /Color$/, tag: 'io-color-picker' },
])
```

### EditorGroups

Organizes properties into collapsible groups. Groups are matched using strings or RegExp patterns.

```typescript
type PropertyGroups = Record<string, Array<string | RegExp>>
```

**Built-in groups:**
| Group | Matches |
|-------|---------|
| `Main` | Ungrouped properties (default) |
| `Hidden` | `constructor`, `toString`, `__*` |
| `Advanced` | `_*` (single underscore prefix) |

**Registration:**
```typescript
import { registerEditorGroups } from 'io-editors'

registerEditorGroups(MyClass, {
  Transform: ['position', 'rotation', 'scale'],
  Material: [/Color$/, /Texture$/],
  Hidden: ['_internalState'],
})
```

## Elements

### IoInspector

Full object inspector with breadcrumb navigation.

```typescript
type IoInspectorProps = {
  value: object               // Object to inspect
  config?: PropertyConfig[]   // Widget overrides
  groups?: PropertyGroups     // Grouping overrides
  labeled?: boolean           // Show property labels
  labelWidth?: string         // Label column width
}
```

**Key behaviors:**
- Breadcrumb trail for nested object navigation
- Click object property to drill into it
- Back button returns to parent

### IoPropertyEditor

Renders editable properties for an object.

```typescript
type IoPropertyEditorProps = {
  value: object | any[]
  properties?: string[]       // Specific properties (omit for auto)
  config?: PropertyConfig[]
  groups?: PropertyGroups
  labeled?: boolean           // Show labels (default: true)
  labelWidth?: string         // Label width (default: '80px')
  orientation?: 'vertical' | 'horizontal'
  widget?: VDOMElement        // Override auto-detected widget
}
```

**Key behaviors:**
- Auto-detects appropriate widgets per property
- Groups properties with collapsible sections
- Responds to object mutations via `io-object-mutation` event
- Debounced rendering for performance

### IoObject

Collapsible property editor with persistent expand state.

```typescript
type IoObjectProps = {
  value: object
  label?: string              // Header label
  properties?: string[]       // Specific properties
  expanded?: boolean          // Expand state
  persistentExpand?: boolean  // Remember expand state
  config?: PropertyConfig[]
  groups?: PropertyGroups
}
```

**Key behaviors:**
- Expand state persisted by object identifier (`guid`, `uuid`, `id`, `name`, or `label`)
- Falls back to temporary identifier for anonymous objects
- Stored in localStorage

### IoVector

Editor for numeric arrays/objects with labeled components.

```typescript
type IoVectorProps = {
  value: number[] | Record<string, number>
  keys?: string[]             // Component keys
  labels?: string[]           // Component labels (e.g., ['X', 'Y', 'Z'])
}
```

### IoMatrix

Grid editor for matrix values (2D arrays or flat arrays).

```typescript
type IoMatrixProps = {
  value: number[]
  columns?: number            // Number of columns
}
```

### IoBreadcrumbs

Navigation trail for nested object inspection.

```typescript
type IoBreadcrumbsProps = {
  path?: string               // Dot-separated path
}
```

### IoContextEditorSingleton

Global singleton for context-aware property editing. Shows property editor popup on right-click or when triggered programmatically.

## Data Flow

```
Object property mutates
    ↓
io-object-mutation event dispatched
    ↓
IoPropertyEditor.valueMutated()
    ↓
Debounced reconfiguration
    ↓
getEditorConfig() → widget selection
getEditorGroups() → property grouping
    ↓
Render property rows with selected widgets
    ↓
User edits value
    ↓
Widget dispatches 'value-input'
    ↓
IoPropertyEditor._onValueInput()
    ↓
Updates object property
    ↓
Dispatches mutation if not a Node
```

## Events

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `value-input` | All editor widgets | `{ value, oldValue }` | Property value changed |
| `io-object-mutation` | IoPropertyEditor | `{ object }` | Object mutated |

## Edge Cases

### Configuration Inheritance
Configs and groups are inherited through the prototype chain. A config for `Object` applies to all objects unless overridden by a more specific constructor.

### Property Visibility
Properties starting with `__` are always hidden. Properties starting with single `_` go to the "Advanced" group by default.

### Function Properties
Functions are displayed as buttons that invoke the function with the object as `this`. The button label defaults to the function name.

### Array Handling
Arrays are treated as objects with numeric keys. Array methods are hidden by default.

### Circular References
Object navigation via breadcrumbs prevents infinite recursion by tracking the path explicitly. Clicking a property that references a parent creates a new path entry rather than looping.
