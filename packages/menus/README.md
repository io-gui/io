# @io-gui/menus

Menu system for Io-Gui with a rich domain model for hierarchical option management.

See [live examples here](https://iogui.dev/io/#path=Demos,Menus)

For the design vocabulary (Option, Menu, selection scope, Path, disclosure…) see [CONTEXT.md](./CONTEXT.md). Architectural decisions are recorded in [docs/adr/](./docs/adr/).

## Overview

The model is split in two: **`Option`** is one node of the tree and carries only local state; **`Menu`** extends `Option` as the root of the tree and owns everything tree-scoped (selection tracking, disclosure, serialization entry point).

Each core model has a paired view: `Option` ↔ `IoOption`, an expanded selection scope ↔ `IoMenu`. Entry-point elements (`IoOptionSelect`, `IoMenuTree`, `IoContextMenu`, `IoMenuHamburger`) present a whole `Menu` in a specific way.

```
Menu extends Option (root model, tree-scoped state)
├── selectedID, path       — writable derived selection projections
├── expandedIDs            — persistent tree disclosure
└── Option (node model, local state)
    ├── id, value, label, icon, hint
    ├── mode: 'select' | 'toggle' | 'none'
    ├── action: (value) => void
    ├── selected
    └── options: NodeArray<Option>

IoOptionSelect (model: Menu)
└── IoOption
    └── IoMenu (expandable)
        └── IoOption[]

IoMenuTree (model: Menu)
└── IoMenuTreeBranch (recursive)
    └── IoOption[]

IoContextMenu (model: Menu, attached to parent element)
└── IoMenu
```

## Domain Model

### Option

One node of a Menu's tree.

```typescript
type OptionProps = {
  id?: string                // Identifier — unique per Menu, no commas
  value?: any                // Payload (defaults to id)
  label?: string             // Display label (defaults to id)
  icon?: string              // Icon reference (e.g., 'io:gear')
  hint?: string              // Keyboard shortcut hint
  action?: (value?) => void  // Click handler
  mode?: 'select' | 'toggle' | 'none'
  disabled?: boolean
  hidden?: boolean
  selected?: boolean
  options?: OptionProps[]    // Nested options
}
```

**Modes:**
| Mode | Description |
|------|-------------|
| `select` | Single selection within siblings (radio-like) |
| `toggle` | Independent toggle (checkbox-like) |
| `none` | Action-only, no selection state |

**Key behaviors:**
- Constructor accepts primitives (`string`, `number`, `boolean`) as shorthand
- `label` and `value` default to `id`
- An `action` without an explicit `mode` implies `mode: 'none'` (a transient command)
- Nested options are automatically converted to `Option` instances
- The `select`-mode children of one parent form a **selection scope**: at most one is selected, enforced by the parent
- `value` is payload only — selection is tracked by `id`

### Menu

The root of a menu tree. Owns tree-scoped state:

```typescript
const menu = new Menu({
  id: 'root',
  options: [
    { id: 'File', options: ['New', 'Open', 'Save'] },
    { id: 'Edit', options: ['Cut', 'Copy', 'Paste'] },
  ]
})

menu.selectedID   // Deepest selected option id in the tree
menu.path         // Comma-joined chain of selected ids: "File,Open"
menu.expandedIDs  // Comma-joined ids of disclosed tree branches
```

`Option.selected` (per scope) is the only source of truth for selection. `selectedID` and `path` are derived projections that stay **writable on purpose** — they are the entry points for persistence and routing. Writing a `path` performs a stale-tolerant restore: the deepest id that still exists wins, so persisted selection survives menu restructuring (see ADR 0001).

```typescript
// Persist selection:
new Menu({options: [...], selectedID: $({key: 'nav', storage: 'local', value: 'home'})})
// Persist tree disclosure:
new Menu({options: [...], expandedIDs: $({key: 'nav-expanded', storage: 'local', value: ''})})
```

The id of a scope's selected child is derived on demand via `Option.getSelectedIDImmediate()` — a method, not a stored property. Views observe it through mutation events; bindings are reserved for the writable entry points (`selectedID`, `path`, `expandedIDs`).

### Methods

| Method | Description |
|--------|-------------|
| `getAllOptions()` | Flattens tree into array |
| `findOptionById(id)` | Find option by id (children-first) |
| `findOptionByValue(value)` | Find option by value (children-first) |
| `selectDefault()` | Select the default (first select-mode) branch chain |
| `toJSON()` / `applyJSON()` | Serialization — **structure only**, never selection (ADR 0003) |
| `isDisclosed(id)` / `setDisclosed(id, bool)` | Menu only: tree branch disclosure |

## Elements

### IoOptionSelect

Dropdown select button that expands a menu on click.

```typescript
type IoOptionSelectProps = {
  model?: Menu
  value?: any     // Payload of the selected Option
  label?: string
  icon?: string
}
```

**Key behaviors:**
- Displays selected option's label + dropdown indicator
- `value` mirrors the selected Option's `value`; writing `value` matches it to an Option at this boundary and selects it by id
- Dispatches `value-input` on selection change

### IoOption

The view paired with one `Option` model.

```typescript
type IoOptionProps = {
  model?: Option
  label?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  depth?: number            // Remaining levels to expand
  expanded?: boolean
}
```

**Key behaviors:**
- Shows icon, label, hint, and expansion indicator
- Expands submenu on hover (with 250ms delay for diagonal movement)
- Pointer capture for drag-through interaction
- Keyboard navigation with arrow keys relative to expansion direction

### IoMenu

The view paired with an expanded selection scope: renders `IoOption` elements from its model's `options`. Rendered in overlay when expanded from an `IoOption`.

```typescript
type IoMenuProps = {
  model?: Menu | Option    // Menu root or the branch Option whose children it shows
  horizontal?: boolean     // Horizontal layout (menu bar)
  expanded?: boolean
  searchable?: boolean
  depth?: number
  direction?: NudgeDirection
}
```

### IoMenuTree

Vertical tree menu with inline collapsible branches.

```typescript
type IoMenuTreeProps = {
  model?: Menu
  searchable?: boolean
  depth?: number
}
```

**Key behaviors:**
- Renders `IoMenuTreeBranch` for each option with children
- Branch **disclosure** is persistent state on the Menu (`expandedIDs`) — bind it to storage to persist; distinct from transient overlay **expansion**
- Selected branches disclose themselves

### IoContextMenu

Invisible element that attaches a context menu to its parent.

```typescript
type IoContextMenuProps = {
  model: Menu
  button?: number   // Mouse button (default: 0; use 2 for right-click)
  expanded?: boolean
}
```

**Usage:**
```typescript
div([
  ioContextMenu({ model: myMenu }),
  'Right-click me'
])
```

### IoMenuHamburger

Hamburger button that expands a menu panel.

## Data Flow

```
User clicks IoOption
    ↓
action invoked (if any)
If mode === 'select':
    option.selected = true
    (scope siblings auto-deselected by parent)
    ↓
Menu root updates selectedID, path (synchronously, via mutation chain)
    ↓
'io-option-clicked' dispatched from the menu root element
    ↓
Observers read selection from model properties
(IoOptionSelect listens to Menu 'selectedID-changed' → updates value → 'value-input')
```

## Events

Selection is observed via **property change events on the models** (`selected-changed`, `selectedID-changed`, `path-changed`, …), not synthetic menu events. There is a single public activation event for the one case properties can't express — activations that change no state (`mode: 'none'` commands). See ADR 0002.

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `io-option-clicked` | menu root element | `{ option }` | An option was activated |
| `value-input` | IoOptionSelect | `{ value, oldValue }` | Selection value changed |

## Keyboard Navigation

Within expanded menus:
- **Arrow keys** - Navigate based on menu direction
- **Enter/Space** - Activate option or expand submenu
- **Backspace** - Navigate to parent menu
- **Escape** - Collapse entire menu tree

Arrow key behavior adapts to expansion direction:
- Horizontal menus: Left/Right navigate, Up/Down expand/collapse
- Vertical menus: Up/Down navigate, Left/Right expand/collapse

## Edge Cases

### Duplicate Selection Prevention
When multiple options have `selected: true` with `mode: 'select'` in one scope, only the first is kept:
```typescript
new Option({
  options: [
    { id: 'A', selected: true, mode: 'select' },
    { id: 'B', selected: true, mode: 'select' }, // Reset to false
  ]
})
```

### Stale-Tolerant Path Restore
Writing `path` selects the deepest segment that still exists:
```typescript
new Menu({options: [...], path: 'food,fruits,removed'}) // selects 'fruits'
```

### Pointer Capture for Drag-Through
Options capture pointer on mousedown, enabling "drag through" interaction where users can click, drag across options, and release to select.

### Overlay Management
Submenus are appended to `IoOverlaySingleton`, ensuring they render above other content. Position is calculated using `nudge()` utility to stay within viewport.

### Delayed Hover Expansion
Submenu expansion on hover includes a 250ms delay to allow diagonal mouse movement without accidentally closing/opening menus.
