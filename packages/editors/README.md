# @io-gui/editors

Property editing components for Io-Gui with configurable widget selection and grouping.

See [live examples here](https://iogui.dev/io/#path=Demos,Editors)

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

Determines which widget to use for each property. A `PropertyConfig` is a tuple of a property identifier and a prebuilt vDOM widget:

```typescript
type PropertyIdentifier = AnyConstructor | string | RegExp | null | undefined
type PropertyConfig = [PropertyIdentifier, VDOMElement]
```

An identifier matches a property when it is:
- a **constructor** and the value is an instance of it (or has it as its `constructor`)
- a **string** equal to the property name
- a **RegExp** that tests true against the property name
- `null` / `undefined` and the value is `null` / `undefined`

Configs are collected from every registered constructor the object is an instance of (in registration order), followed by the element's `config` prop. Every matching entry is applied in that order and **the last match wins**. Re-registering an existing identifier replaces its widget but keeps its position in the order.

**Built-in defaults (for `Object`):**
| Identifier | Widget |
|------|--------|
| `String` | `ioString()` |
| `Number` | `ioNumber({step: 0.01})` |
| `Boolean` | `ioSwitch()` |
| `Object` (incl. arrays) | `ioObject()` |
| `null` / `undefined` | `ioField({disabled: true})` |
| `Function` | `ioButton()` |

Read-only (getter-only or non-writable) prototype properties of configured constructors are mapped to a disabled `ioField`.

**Custom registration:**
```typescript
import { registerEditorConfig } from '@io-gui/editors'
import { ioColorRgba } from '@io-gui/colors'
import { ioVector3 } from '@io-gui/three'

registerEditorConfig(MyClass, [
  ['position', ioVector3()],
  [/Color$/, ioColorRgba()],
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
import { registerEditorGroups } from '@io-gui/editors'

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
  value?: object | any[]      // Root object to inspect
  selected?: object | any[]   // Currently inspected (drilled-into) object; bindable
  search?: string             // Property filter; bindable
  config?: PropertyConfig[]   // Widget overrides
  groups?: PropertyGroups     // Grouping overrides
  widget?: VDOMElement        // Override auto-detected widget
}
```

**Key behaviors:**
- Breadcrumb trail for nested object navigation
- Click object property to drill into it
- Breadcrumb back button returns to the parent object

### IoPropertyEditor

Renders editable properties for an object.

```typescript
type IoPropertyEditorProps = {
  value: object | any[]
  properties?: string[] | null // Specific properties (omit for auto)
  label?: string
  config?: PropertyConfig[]
  groups?: PropertyGroups
  labeled?: boolean           // Show labels (default: true)
  labelWidth?: string         // Label width (default: '80px')
  widget?: VDOMElement        // Override auto-detected widget
}
```

**Key behaviors:**
- Auto-detects appropriate widgets per property
- Groups properties with collapsible sections
- Responds to object mutations via `io-mutation` event
- Debounced rendering for performance

### IoObject

Collapsible property editor with persistent expand state.

```typescript
type IoObjectProps = {
  value: object | any[]
  label?: string              // Header label
  labeled?: boolean           // Show property labels
  labelWidth?: string         // Label column width
  properties?: string[]       // Specific properties
  expanded?: boolean          // Expand state; bindable
  persistentExpand?: boolean  // Remember expand state
  config?: PropertyConfig[]
  groups?: PropertyGroups
  widget?: VDOMElement | null // Override auto-detected widget
}
```

**Key behaviors:**
- Expand state persisted by object identifier (`guid`, `uuid`, `id`, `name`, or `label`)
- Falls back to temporary identifier for anonymous objects
- Stored in localStorage

### IoBreadcrumbs

Navigation trail for nested object inspection.

```typescript
type IoBreadcrumbsProps = {
  value?: object              // Root object
  selected?: object           // Currently selected object; bindable
  search?: string             // Search string; bindable
}
```

### IoContextEditorSingleton

Global singleton for context-aware property editing. Shows property editor popup on right-click or when triggered programmatically.

## Data Flow

```
Object property mutates
    ↓
io-mutation event dispatched
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
Dispatches mutation if not a ReactiveNode
```

## Events

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `value-input` | All editor widgets | `{ value, oldValue }` | Property value changed |
| `io-mutation` | IoPropertyEditor | `{ object }` | Object mutated |

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
