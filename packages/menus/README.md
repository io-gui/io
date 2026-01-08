# @io-gui/menus

Menu system for Io-Gui with a rich domain model for hierarchical option management.

## Overview

```
MenuOption (domain model)
├── id, value, label, icon, hint
├── mode: 'select' | 'toggle' | 'none'
├── action: (value) => void
└── options: NodeArray<MenuOption>

IoOptionSelect
└── IoMenuItem
    └── IoMenuOptions (expandable)
        └── IoMenuItem[]

IoMenuTree
└── IoMenuTreeBranch (recursive)
    └── IoMenuItem[]

IoContextMenu (attached to element)
└── IoMenuOptions
```

## Domain Model

### MenuOption

Rich domain model for representing menu items with selection state, actions, and nested options.

```typescript
type MenuOptionProps = {
  id?: string                // Unique identifier
  value?: any                // Associated value
  label?: string             // Display label (defaults to id)
  icon?: string              // Icon reference (e.g., 'io:gear')
  hint?: string              // Keyboard shortcut hint
  action?: (value?) => void  // Click handler
  mode?: 'select' | 'toggle' | 'none'
  disabled?: boolean
  selected?: boolean
  options?: MenuOptionProps[]  // Nested options
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
- `label` defaults to `id` if not provided
- `value` defaults to `id` if not provided
- Nested options are automatically converted to `MenuOption` instances
- Selection within `select` mode siblings is mutually exclusive

### Selection Tracking

```typescript
const menu = new MenuOption({
  id: 'root',
  mode: 'select',
  options: [
    { id: 'File', options: ['New', 'Open', 'Save'] },
    { id: 'Edit', options: ['Cut', 'Copy', 'Paste'] },
  ]
})

// Track selection
menu.selectedID         // Final selected option ID in tree
menu.selectedIDImmediate // Direct child selection
menu.path               // Comma-separated selection path: "File,Open"
```

### Methods

| Method | Description |
|--------|-------------|
| `getAllOptions()` | Flattens tree into array |
| `findItemById(id)` | Find option by ID |
| `findItemByValue(value)` | Find option by value |
| `selectDefault()` | Select first selectable child |
| `toJSON()` / `fromJSON()` | Serialization |

## Elements

### IoOptionSelect

Dropdown select button that expands a menu on click.

```typescript
type IoOptionSelectProps = {
  option: MenuOption
  value?: any
  selectBy?: 'value' | 'id'  // How to match selection
}
```

**Key behaviors:**
- Displays selected item's label + dropdown indicator
- Updates `value` when option selected
- Dispatches `value-input` on selection change

### IoMenuItem

Individual menu item that can expand nested options.

```typescript
type IoMenuItemProps = {
  option: MenuOption
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

### IoMenuOptions

Expandable container for menu items, rendered in overlay.

```typescript
type IoMenuOptionsProps = {
  option: MenuOption
  horizontal?: boolean  // Horizontal layout (for menu bar)
  expanded?: boolean
  depth?: number
  direction?: NudgeDirection
}
```

### IoMenuTree

Vertical tree menu with expandable branches.

```typescript
type IoMenuTreeProps = {
  option: MenuOption
  depth?: number
}
```

**Key behaviors:**
- Renders `IoMenuTreeBranch` for each option with children
- Branch items are collapsible inline (no overlay)

### IoContextMenu

Invisible element that attaches a context menu to its parent.

```typescript
type IoContextMenuProps = {
  option: MenuOption
  button?: number   // Mouse button (default: 2 for right-click)
  expanded?: boolean
}
```

**Usage:**
```typescript
div([
  ioContextMenu({ option: myMenuOption }),
  'Right-click me'
])
```

### IoMenuHamburger

Hamburger button that expands a menu panel.

## Data Flow

```
User clicks IoMenuItem
    ↓
If mode === 'select':
    option.selected = true
    (siblings auto-deselected via onOptionSelectedChanged)
    ↓
option-selected-changed event bubbles
    ↓
Parent MenuOption updates selectedID, path
    ↓
option-selected event dispatched
    ↓
IoOptionSelect.onOptionSelected() updates value
    ↓
Dispatches 'value-input' event
```

## Events

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `option-selected-changed` | MenuOption | `{ option }` | Selection state changed |
| `option-selected` | MenuOption | `{ option }` | Option was selected |
| `io-menu-option-clicked` | IoMenuItem | `{ option }` | Menu item clicked |
| `value-input` | IoOptionSelect | `{ value, oldValue }` | Selection value changed |

## Keyboard Navigation

Within expanded menus:
- **Arrow keys** - Navigate based on menu direction
- **Enter/Space** - Activate item or expand submenu
- **Backspace** - Navigate to parent menu
- **Escape** - Collapse entire menu tree

Arrow key behavior adapts to expansion direction:
- Horizontal menus: Left/Right navigate, Up/Down expand/collapse
- Vertical menus: Up/Down navigate, Left/Right expand/collapse

## Edge Cases

### Duplicate Selection Prevention
When multiple options have `selected: true` with `mode: 'select'`, only the first is kept:
```typescript
new MenuOption({
  options: [
    { id: 'A', selected: true, mode: 'select' },
    { id: 'B', selected: true, mode: 'select' }, // Reset to false
  ]
})
```

### Pointer Capture for Drag-Through
Menu items capture pointer on mousedown, enabling "drag through" interaction where users can click, drag across options, and release to select.

### Overlay Management
Submenus are appended to `IoOverlaySingleton`, ensuring they render above other content. Position is calculated using `nudge()` utility to stay within viewport.

### Delayed Hover Expansion
Submenu expansion on hover includes a 250ms delay to allow diagonal mouse movement without accidentally closing/opening menus.
