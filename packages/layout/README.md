# @io-gui/layout

A reactive, drag-and-drop tabbed panel layout system built on Io-Gui's reactive architecture. `IoLayout` enables IDE-like split panel interfaces where users can arrange, resize, and reorganize content through intuitive drag-and-drop interactions.

See [live examples here](https://iogui.dev/io/#path=Demos,Layout)

## Overview

`IoLayout` is the entry point. It renders a **`Layout`** root whose child is a tree of **`Split`** and **`Panel`** models:

```
IoLayout (root view)
  └── IoSplit | IoPanel  ← layout.child
        ├── IoSplit (nested)
        │   ├── IoPanel → IoTabs → IoTab[]
        │   ├── IoDivider
        │   └── IoPanel
        ├── IoDivider
        └── IoPanel
```

The system separates **domain models** (structure and invariants) from **elements** (geometry and gestures):

| Domain Model | Element | Purpose |
|--------------|---------|---------|
| `Layout` | `IoLayout` | Root; tree-wide ops (`moveTab`), root normalization |
| `Split` | `IoSplit` | Arranges children horizontally or vertically; `normalize()` |
| `Panel` | `IoPanel` | Tab container; `addTab`, `removeTab`, `moveTab`, selection |
| `Tab` | `IoTab` | Tab handle with id, label, icon |

`IoLayout.elements` is the application-provided **elements pool** (VDOM descriptors). It is not persisted — the host supplies it when mounting. The add-tab menu is derived from pool entries whose content id is not already open in that panel.

This split is a concrete use of Io-Gui's **cross-domain reactivity**: models own state and behavior; elements render and forward gestures. See the core [deep dive](https://iogui.dev/io/#path=Docs,Deep%20Dive) "Cross-Domain Reactivity" section for the underlying mechanism.

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

A container holding an array of tabs with size properties.

```typescript
type PanelProps = {
  type: 'panel'  // Required type discriminator
  tabs: Array<TabProps>
  size?: string     // 'auto' | 'Npx' | 'N%', defaults to 'auto'
  minSize?: string  // 'Npx' | 'N%', defaults to '240px'
}
```

**Key behaviors:**
- Constructor auto-selects the first tab if none are selected
- `tabs` is a `NodeArray<Tab>` with reactive mutation tracking
- `getSelected()` / `setSelected(id)` manage tab selection
- `addTab(tab, index?)`, `removeTab(tab)`, `moveTab(tab, index)` — structural tab ops (dedupe id within panel, reselect on remove)
- Empty panel triggers parent `Split.normalize()` up the ancestor chain

### Split

A container that arranges children (Panels or nested Splits) with an orientation.

```typescript
type SplitOrientation = 'horizontal' | 'vertical'
type SplitDirection = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'center'

type SplitProps = {
  type: 'split'                   // Required type discriminator
  children: Array<SplitProps | PanelProps>
  orientation?: SplitOrientation  // defaults to 'horizontal'
  size?: string                   // defaults to 'auto'
  minSize?: string                // defaults to '240px'
}
```

**Key behaviors:**
- Constructor validates that `type === 'split'` and throws an error otherwise
- Constructor recursively instantiates child Splits and Panels based on the `type` property
- **Construction-time consolidation**: If a Split has only one child that is also a Split, the constructor automatically adopts that child's children and orientation
- `normalize()` — synchronous repair: drop empty children, consolidate single-child nested splits, ensure one child has auto size
- Children are stored in a `NodeArray<Split | Panel>`

### Layout

The root model for a whole arrangement.

```typescript
type LayoutProps = {
  type: 'layout'
  version?: number  // current wire format: 2
  child: SplitProps | PanelProps
}
```

**Key behaviors:**
- Single reactive `child: Split | Panel` (not a `NodeArray`)
- `moveTab(tab, targetPanel, direction, sourcePanel?)` — tree-wide tab moves (center merge or edge split)
- `findPanel(tab)` — locate the panel holding a tab
- `normalize()` — root invariants: promote lone child after split consolidation; keep terminal empty panel
- `hydrateLayout(json)` / `Layout.applyJSON()` accept both `{ type: 'layout', child: ... }` and legacy root `SplitProps | PanelProps`

## Elements

### IoLayout

Root view. Renders `ioSplit` or `ioPanel` from `layout.child`.

```typescript
ioLayout({
  layout: layoutModel,
  elements: contentPool,
  editable?: boolean,
})
```

### IoSplit

Renders a Split model as a flex container with children and dividers.

**Key responsibilities:**
- Renders child `IoSplit` or `IoPanel` elements interleaved with `IoDivider` elements
- Handles divider resize events (`io-divider-move`, `io-divider-move-end`) and writes size to the model
- Drawer collapse when space is insufficient; `hasVisibleAutoSize` for CSS fallback when auto-size child is in a collapsed drawer

**Event listeners:**
- `io-divider-move` — Updates flex CSS during drag
- `io-divider-move-end` — Persists size values to the model, then `split.normalize()`
- `io-drawer-expanded-changed` — Manages drawer veil state

### IoPanel

Renders a Panel model with tabs and content.

**Key responsibilities:**
- Renders `IoTabs` header and `IoSelector` content area
- Handles tab editing events (select, remove, reorder) by delegating to `Panel` methods
- `moveTabToSplit(sourcePanel, tab, direction)` delegates to `layout.moveTab()` (resolves `layout` from prop or `closest('io-layout')`)

**Tab operations** (view wrappers around model):
- `selectTab(tab)` / `selectIndex(index)` — Change selection and focus
- `addTab(tab, index?)` — Delegates to `panel.addTab`
- `removeTab(tab)` — Delegates to `panel.removeTab`
- `moveTab(tab, index)` — Delegates to `panel.moveTab`

**Root survival:** When the last tab of the last panel is removed, `Layout.normalize()` keeps an empty terminal panel.

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
- Resolves drag root via `closest('io-layout')`
- Updates `IoTabDragIconSingleton` with current position
- Detects drop targets by iterating all `io-tabs` and `io-panel` elements
- Calculates drop position (index or split direction) based on cursor position

### IoDivider

Resizable divider between split children.

**Key behaviors:**
- Dispatches `io-divider-move` events during drag with `{ index, clientX, clientY }`
- Dispatches `io-divider-move-end` when drag completes
- Visual feedback via `pressed` attribute

**Resize algorithm (in IoSplit):**
- Maps model `size` to CSS flex via `sizeToFlex()`
- Divider drag sets adjacent panels to fixed pixel flex for visual feedback
- On drag end, measured sizes are persisted as `size: 'Npx'` on the model
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

### IoTabDropRect

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
Debounced callback calls mutated()
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
   → Initialize IoTabDragIconSingleton with tab, source panel
   → Update icon position at cursor

3. pointermove (continued)
   → Iterate io-tabs elements for tab-bar drops
   → Iterate io-panel elements for split drops
   → Update dropTarget, splitDirection, dropIndex
   → tabDropMarkerSingleton shows preview

4. pointerup
   → If dropIndex !== -1: addTab to target panel
   → If splitDirection !== 'none': layout.moveTab via IoTabDragIconSingleton
   → Reset singleton state
```

## Event Reference

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `io-edit-tab` | IoTab | `{ tab, key }` | Tab editing commands |
| `io-divider-move` | IoDivider | `{ index, clientX, clientY }` | Resize in progress |
| `io-divider-move-end` | IoDivider | `{ index, clientX, clientY }` | Resize complete |
| `io-menu-option-clicked` | IoMenuItem | `{ option }` | Add new tab from elements pool |

## Important Considerations

### Multiple Layout Instances

IoLayout uses **global singletons** for drag-and-drop functionality:

- `IoTabDragIconSingleton` - Shows tab icon at cursor during drag
- `IoTabDropRectSingleton` - Shows drop target preview
- `IoTabsHamburgerMenuSingleton` - Overflow menu for hidden tabs

**Limitations when using multiple `IoLayout` instances on the same page:**

1. **One drag operation at a time** — Singletons are shared globally
2. **Drop target scoping** — Drop targets are scoped to the `io-layout` subtree of the dragged tab
3. **Shared hamburger menu** — The overflow menu is shared

This architecture works well for the common case of a single layout per page. For multiple independent layouts, be aware of the shared drag state.

### Tab ID Uniqueness

Tab IDs serve two purposes:
1. **Content matching** - The `id` property matches tabs to content elements in the `elements` array
2. **Identity within panels** - Each tab in a panel should have a unique `id`

**Within a single panel:**
When adding a tab, if a tab with the same `id` already exists in that panel, the existing tab is removed first (with a console warning):
```typescript
addTab(tab: Tab, index?: number) {
  const existingIndex = this.panel.tabs.findIndex(t => t.id === tab.id)
  if (existingIndex !== -1) {
    console.warn(`IoPanel.addTab: Duplicate tab id "${tab.id}", removing duplicate tab.`)
    this.panel.tabs.splice(existingIndex, 1)
  }
  // ... add at new position
}
```

**Across panels:**
Duplicate IDs across different panels are **allowed** and can be useful when:
- Multiple panels should display the same content (e.g., split view of same document)
- Each panel independently selects which content to show

However, consider that:
- All tabs with the same ID will display the same content
- Removing a tab only affects that specific panel
- No automatic synchronization occurs between panels with duplicate IDs

### Minimum Panel Sizes

Panels have enforced minimum size `ThemeSingleton.fieldHeight * 4` during resize operations to prevent them from becoming unusably small. These values scale with the theme's `fieldHeight` setting, ensuring usability across different display densities and theme configurations.

**Note:** These minimums apply during user resize operations via IoDivider. Programmatically setting smaller `size` values is possible but may result in cramped UI.

### Storage and Serialization

When using `Storage` for layout persistence, understanding what gets serialized helps avoid unexpected behavior.

**What IS persisted:**
- `Layout` envelope: `{ type: 'layout', version: 2, child: SplitProps | PanelProps }`
- Layout structure (nested splits and panels), orientations, size/minSize values, tab data
- Legacy root `SplitProps` / `PanelProps` without the envelope are wrapped on hydrate

**Wire format example:**
```typescript
{
  type: 'layout',
  version: 2,
  child: {
    type: 'split',
    children: [{
      type: 'panel',
      size: '200px',
      tabs: [{ id: 'A' }]
    }]
  }
}
```

**What is NOT persisted:**
- Transient drag state (`IoTabDragIconSingleton` properties)
- Runtime element references (`dropSource`, `dropTarget`)
- Overflow state (`IoTabs.overflow` value)
- DOM-specific state (scroll positions, focus)

**Serialization example:**
```typescript
// This structure with defaults:
new Split({
  type: 'split',
  orientation: 'horizontal',  // default, omitted in JSON
  size: 'auto',              // default, omitted in JSON
  minSize: '240px',          // default, omitted in JSON
  children: [{
    type: 'panel',
    size: '200px',           // non-default, included
    tabs: [{ id: 'A', label: 'A' }]  // label equals id, omitted
  }]
})

// Serializes to:
{
  type: 'split',
  children: [{
    type: 'panel',
    flex: '0 0 200px',
    tabs: [{ id: 'A' }]
  }]
}
```

---

## Nuances and Edge Cases

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

When a split ends up with only one child, it is consolidated into its parent — synchronously via `Split.normalize()` and `Layout.normalize()`, not DOM events.

**At construction time:** The Split constructor consolidates when initialized with only one child that is a Split.

**At runtime:** Structural methods (`Panel.removeTab`, `Layout.moveTab`, divider resize end) call `normalize()` on affected splits. Each split drops empty children, hoists single-child nested splits, and ensures one child has auto size. `Layout.normalize()` promotes a lone child to `layout.child` and keeps a terminal empty panel when the tree would otherwise have no panels.

### Size Value Persistence
Divider resize operations update element `style.flex` immediately for visual feedback, but model `size` properties are only updated on `io-divider-move-end`. This prevents excessive mutation events during drag.

### Overflow Detection Timing
`IoTabs.tabsMutated()` resets `overflow = -1` and calls `onResized()` to recalculate. It compares the last rendered child's right edge to the container's, and uses a hysteresis of 32px to prevent flickering:
```typescript
if (this.overflow === -1) {
  if (lastElementRect.right > rect.right) {
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

1. **Auto-size preservation**: When removing the middle auto-size panel from three panels, remaining fixed panels don't fill space
2. **Arrow Up/Down tab movement**: Cross-panel tab movement via keyboard not implemented
3. **Hamburger animations**: Overflow transition animations marked for improvement

## Storage Integration

`IoLayout` integrates with Io-Gui's `Storage` system for persistence:

```typescript
import { Storage as $ } from '@io-gui/core'
import { Layout, ioLayout } from '@io-gui/layout'

const defaultLayout = new Layout({
  type: 'layout',
  child: { type: 'split', children: [...] },
})

ioLayout({
  layout: $({ key: 'my-layout-v2', storage: 'local', value: defaultLayout }),
  elements: contentPool,
})
```

`Layout.toJSON()` serializes the v2 envelope. `Layout.applyJSON()` and `hydrateLayout()` accept both the envelope and legacy root split/panel JSON saved before the migration.
