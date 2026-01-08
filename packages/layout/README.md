# @io-gui/layout

A reactive, drag-and-drop tabbed panel layout system built on Io-Gui's reactive architecture. IoLayout enables IDE-like split panel interfaces where users can arrange, resize, and reorganize content through intuitive drag-and-drop interactions.

## Overview

IoLayout implements a **nested tree structure** for layout management:

```
IoLayout
└── IoSplit (root)
    ├── IoSplit (nested)
    │   ├── IoPanel
    │   │   └── IoTabs → IoTab[]
    │   └── IoDivider
    │   └── IoPanel
    └── IoDivider
    └── IoPanel
```

The system separates **domain models** (data) from **elements** (UI), following Io-Gui's reactive architecture:

| Domain Model | Element | Purpose |
|--------------|---------|---------|
| `Split` | `IoSplit` | Container that arranges children horizontally or vertically |
| `Panel` | `IoPanel` | Container for tabs with content selection |
| `Tab` | `IoTab` | Individual tab with id, label, and icon |

## Domain Models

### Tab

The atomic unit representing a single tab.

```typescript
type TabProps = {
  id: string       // Unique identifier, used for content matching
  label?: string   // Display label (defaults to id)
  icon?: string    // Icon identifier (e.g., 'io:settings')
  selected?: boolean
}
```

**Key behaviors:**
- `label` defaults to `id` if not provided
- Only one tab per panel can be `selected` at a time
- Tab mutations bubble up through the panel via `dispatchMutation()`

### Panel

A container holding an array of tabs with flex sizing.

```typescript
type PanelProps = {
  type: 'panel'  // Required type discriminator
  tabs: Array<TabProps>
  flex?: string  // CSS flex value, defaults to '1 1 100%'
}
```

**Key behaviors:**
- Constructor auto-selects the first tab if none are selected
- `tabs` is a `NodeArray<Tab>` with reactive mutation tracking
- `getSelected()` / `setSelected(id)` manage tab selection
- `setSelected()` uses `withInternalOperation()` to batch property changes before dispatching a single mutation event

### Split

A container that arranges children (Panels or nested Splits) with an orientation.

```typescript
type SplitOrientation = 'horizontal' | 'vertical'
type SplitDirection = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'center'

type SplitProps = {
  type: 'split'                   // Required type discriminator
  children: Array<SplitProps | PanelProps>
  orientation?: SplitOrientation  // defaults to 'horizontal'
  flex?: string                   // defaults to '1 1 100%'
}
```

**Key behaviors:**
- Constructor validates that `type === 'split'` and throws an error otherwise
- Constructor recursively instantiates child Splits and Panels based on the `type` property
- **Construction-time consolidation**: If a Split has only one child that is also a Split, the constructor automatically adopts that child's children and orientation. This prevents unnecessary nesting and is applied recursively.
- Children are stored in a `NodeArray<Split | Panel>`
- Mutation events from children bubble up through debounced handlers

## Elements

### IoLayout

The top-level container element. It renders a single root `IoSplit`.

```typescript
type IoLayoutProps = {
  split: Split | Binding          // The root Split model
  elements: VDOMElement[]         // Content elements matched by tab id
  addMenuOption?: MenuOption      // Optional menu for adding new tabs
}
```

**Usage:**
```typescript
ioLayout({
  split: new Split({
    type: 'split',
    children: [
      { type: 'panel', tabs: [{ id: 'Editor' }, { id: 'Preview' }] },
      { type: 'panel', tabs: [{ id: 'Console' }], flex: '0 0 200px' }
    ]
  }),
  elements: [
    div({ id: 'Editor' }, 'Editor content'),
    div({ id: 'Preview' }, 'Preview content'),
    div({ id: 'Console' }, 'Console output'),
  ]
})
```

The `elements` array provides content matched to tabs via the `id` property. IoLayout passes these to `IoSelector` inside each `IoPanel` for content switching.

### IoSplit

Renders a Split model as a flex container with children and dividers.

**Key responsibilities:**
- Renders child `IoSplit` or `IoPanel` elements interleaved with `IoDivider` elements
- Handles divider resize events (`io-divider-move`, `io-divider-move-end`)
- Manages panel/split removal and conversion
- Coordinates tab drag-and-drop operations that create new splits

**Event listeners:**
- `io-divider-move` - Updates flex values during drag
- `io-divider-move-end` - Persists flex values to the model
- `io-panel-remove` - Removes empty panels, may trigger split removal or consolidation
- `io-split-remove` - Removes empty splits from parent, may trigger consolidation
- `io-split-consolidate` - Consolidates single-child splits (replacing split with its sole child)

### IoPanel

Renders a Panel model with tabs and content.

**Key responsibilities:**
- Renders `IoTabs` header and `IoSelector` content area
- Handles tab editing events (select, remove, reorder)
- Manages drag-and-drop tab operations

**Tab operations:**
- `selectTab(tab)` / `selectIndex(index)` - Change selection
- `addTab(tab, index?)` - Add tab, removes duplicate ids first
- `removeTab(tab)` - Remove tab, dispatch removal if panel becomes empty
- `moveTab(tab, index)` - Reorder within panel
- `moveTabToSplit(sourcePanel, tab, direction)` - Move to adjacent panel or create new split

**Edge case:** The last tab in the last panel of a layout cannot be removed (prevents empty layouts).

### IoTabs

Container for tab elements with overflow handling.

**Key behaviors:**
- Renders `IoTabsHamburger` + `IoTab[]` + optional add menu
- Tracks overflow state via `onResized()` - when tabs exceed container width, shows hamburger menu
- Mutations to the `tabs` array trigger re-render and overflow recalculation

### IoTab

Individual tab element extending `IoField` for click/keyboard interactions.

**Key features:**
- Drag-and-drop source for tab reorganization
- Context menu (right-click or Shift+Enter) for editing label/icon
- Keyboard shortcuts (with Shift modifier):
  - `Backspace` - Remove tab
  - `ArrowLeft/Right` - Reorder within panel
  - `ArrowUp/Down` - Reserved for cross-panel movement

**Drag behavior:**
- Captures pointer on `pointerdown`
- Initiates drag after 10px movement threshold
- Updates `tabDragIconSingleton` with current position
- Detects drop targets by iterating all `io-tabs` and `io-panel` elements
- Calculates drop position (index or split direction) based on cursor position

### IoDivider

Resizable divider between split children.

**Key behaviors:**
- Dispatches `io-divider-move` events during drag with `{ index, clientX, clientY }`
- Dispatches `io-divider-move-end` when drag completes
- Visual feedback via `pressed` attribute

**Resize algorithm (in IoSplit):**
- Tracks fixed-size (`0 0 Npx`) vs flex-size (`1 1 N%`) panels
- First/last dividers set adjacent panel to fixed size
- Middle dividers adjust two adjacent flex panels proportionally
- Enforces minimum sizes based on `ThemeSingleton.fieldHeight`

## Supporting Singletons

### IoTabDragIcon

Global singleton rendered at cursor position during tab drag. Shows tab icon and label.

**Properties:**
- `dragging` - Visibility control
- `tab` - The tab being dragged
- `dropSource` - Source IoPanel
- `dropTarget` - Target IoPanel (updated during drag)
- `splitDirection` - 'none', 'center', 'left', 'right', 'top', 'bottom'
- `dropIndex` - Target index within tabs (-1 for split operations)

### IoTabDropMarker

Global singleton showing drop location preview.

**Behaviors:**
- When `dropIndex !== -1`: Shows as thin vertical bar at tab insertion point
- When `splitDirection !== 'none'`: Shows as semi-transparent overlay on half (or full for 'center') of target panel

### IoTabsHamburger

Button that appears when tabs overflow. Opens `IoTabsHamburgerMenuSingleton`.

### IoTabsHamburgerMenuSingleton

Overlay menu displaying all tabs vertically when overflow occurs. Provides alternate access to tab selection and editing.

## Data Flow

### Trunk-to-Leaf (Model → UI)

```
Split/Panel/Tab property change
    ↓
Property setter triggers change event
    ↓
Change handler (e.g., splitMutated) invokes debounced callback
    ↓
Debounced callback calls changed()
    ↓
Element re-renders with updated model state
```

### Leaf-to-Trunk (UI → Model)

```
User interaction (e.g., tab click)
    ↓
IoTab dispatches 'io-edit-tab' event
    ↓
IoPanel handles event, calls model method (e.g., selectTab)
    ↓
Model updates internal state
    ↓
Model dispatches mutation via dispatchMutation()
    ↓
Parent elements receive mutation, may propagate up
```

### Tab Drag-and-Drop Flow

```
1. pointerdown on IoTab
   → Set pointer capture, record start position

2. pointermove (>10px delta)
   → Initialize tabDragIconSingleton with tab, source panel
   → Update icon position at cursor

3. pointermove (continued)
   → Iterate io-tabs elements for tab-bar drops
   → Iterate io-panel elements for split drops
   → Update dropTarget, splitDirection, dropIndex
   → tabDropMarkerSingleton shows preview

4. pointerup
   → If dropIndex !== -1: addTab to target panel
   → If splitDirection !== 'none': moveTabToSplit
   → Reset singleton state
```

## Event Reference

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `io-edit-tab` | IoTab | `{ tab, key }` | Tab editing commands |
| `io-divider-move` | IoDivider | `{ index, clientX, clientY }` | Resize in progress |
| `io-divider-move-end` | IoDivider | `{ index, clientX, clientY }` | Resize complete |
| `io-panel-remove` | IoPanel | `{ panel }` | Panel became empty |
| `io-split-remove` | IoSplit | `{ split }` | Split became empty |
| `io-split-consolidate` | IoSplit | `{ split }` | Split has single child, needs consolidation |
| `io-menu-option-clicked` | IoMenuItem | `{ option }` | Add new tab from menu |

## Nuances and Edge Cases

### Last Tab Protection
The system prevents removing the last tab from the last panel in a layout. In `IoPanel.removeTab()`:
```typescript
const grandParentLayout = (parentSplit.parentElement instanceof IoLayout) ? parentSplit.parentElement : null
if (grandParentLayout && parentSplit.split.children.length === 1 && this.panel.tabs.length === 1) {
  return  // Abort removal
}
```

### Duplicate Tab IDs
When adding a tab, if a tab with the same `id` exists in the panel, it's removed first:
```typescript
addTab(tab: Tab, index?: number) {
  const existingIndex = this.panel.tabs.findIndex(t => t.id === tab.id)
  if (existingIndex !== -1) {
    this.panel.tabs.splice(existingIndex, 1)
  }
  // ... add at new position
}
```

### Split Consolidation
When a split ends up with only one child, it should be consolidated:

**At construction time:** The Split constructor automatically consolidates if initialized with only one child that is a Split:
```typescript
// This structure:
new Split({
  type: 'split',
  children: [{
    type: 'split',
    orientation: 'horizontal',
    children: [...]
  }]
})
// Becomes a single split with the inner children and orientation
```

**At runtime:** When panel/split removal leaves only one child:
```typescript
if (this.split.children.length === 1) {
  this.dispatch('io-split-consolidate', {split: this.split}, true)
}
```

The parent IoSplit handles `io-split-consolidate` via `consolidateChild()`:
- If the sole child is a **Panel**: Replace the split with that panel
- If the sole child is a **Split**: Adopt the child's children and orientation

This maintains a minimal tree structure and prevents unnecessary nesting.

### Flex Value Persistence
Divider resize operations update element `style.flex` immediately for visual feedback, but model `flex` properties are only updated on `io-divider-move-end`. This prevents excessive mutation events during drag.

### Overflow Detection Timing
`IoTabs.tabsMutated()` resets `overflow = -1` and calls `onResized()` to recalculate. The overflow detection uses a hysteresis of 32px to prevent flickering:
```typescript
if (this.overflow === -1) {
  if (addMenuRect.right > rect.right) {
    this.overflow = rect.width
  }
} else if (rect.width > (this.overflow + 32)) {
  this.overflow = -1
}
```

### First Tab Auto-Selection
Panel constructor ensures at least one tab is selected:
```typescript
if (args.tabs.length > 0 && !args.tabs.find(tab => tab.selected)) {
  args.tabs[0].selected = true
}
```

### Drop Zone Detection
Tab drag uses different detection for tab bar vs panel content:
- **Tab bar**: Exact bounds checking with tabs, determines insert index
- **Panel content**: Normalized coordinates from center, determines split direction
  - Center region (|x| < 0.5 && |y| < 0.5): 'center' (merge into panel)
  - Edge regions: 'top', 'bottom', 'left', 'right' (create new split)

### Debounced Mutation Propagation
Both `Panel` and `Split` use debounced mutation handlers to prevent excessive updates:
```typescript
tabsMutated() {
  this.debounce(this.onTabsMutatedDebounced)
}
onTabsMutatedDebounced() {
  this.dispatchMutation()
}
```
This batches rapid changes (e.g., multiple tab property updates) into single update cycles.

### Known Limitations (TODOs in code)

1. **Flex-grow preservation**: When removing the middle flex panel from three panels, remaining fixed panels don't fill space
2. **Arrow Up/Down tab movement**: Cross-panel tab movement via keyboard not implemented
3. **Hamburger animations**: Overflow transition animations marked for improvement

## Storage Integration

IoLayout integrates with Io-Gui's `Storage` system for persistence:

```typescript
import { Storage as $ } from '@io-gui/core'

ioLayout({
  split: $({ key: 'layout', storage: 'local', value: defaultSplit }),
  // ...
})
```

The `Split.toJSON()` / `fromJSON()` methods enable serialization of the entire layout tree including all nested splits, panels, tabs, and flex values.
