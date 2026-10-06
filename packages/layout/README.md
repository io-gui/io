# @io-gui/layout

A reactive tabbed panel layout system built on Io-Gui's reactive architecture. `IoLayout` renders resizable split regions with tabbed panels; models own structure, elements render and forward gestures.

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

| Domain Model | Element | Purpose |
|--------------|---------|---------|
| `Layout` | `IoLayout` | Root; tree-wide ops (`moveTab`), root normalization |
| `Split` | `IoSplit` | Arranges children horizontally or vertically; `normalize()` |
| `Panel` | `IoPanel` | Tab container; `addTab`, `removeTab`, `moveTab`, `selectByIndex` |
| `Tab` | `IoTab` | Tab handle with id, label, icon |

`IoLayout.elements` is the application-provided **elements pool** (VDOM descriptors). It is not persisted — the host supplies it when mounting. The add-tab menu is derived from pool entries.

## Domain Models

### Tab

```typescript
type TabData = {
  id: string
  label?: string
  icon?: string
  selected?: boolean
}
```

- `label` defaults to `id` if not provided
- Only one tab per panel can be `selected` at a time

### Panel

```typescript
type PanelData = {
  type: 'panel'
  tabs: Array<TabData>
  size?: string     // 'auto' | 'Npx' | 'N%' | 'Npx auto' | 'N% auto', defaults to 'auto'
}
```

- `applyJSON` auto-selects the first tab if none are selected
- `selectedID` (getter) / `selectByIndex(index)` manage tab selection; selecting dispatches `io-panel-tab-selected`
- `addTab(tab, index?)`, `removeTab(tab)`, `moveTab(tab, index)` — structural tab ops (dedupe id within panel, reselect on remove)
- There is no `minSize`; the collapse budget is derived from `size` (see CONTEXT.md, "Size budget")

### Split

```typescript
type SplitData = {
  type: 'split'
  children: Array<SplitData | PanelData>
  orientation?: 'horizontal' | 'vertical'  // defaults to 'horizontal'
  size?: string
}
```

- `normalize()` — repair empty children, consolidate single-child nested splits, ensure one child has auto size
- Children are stored in a `NodeArray<Split | Panel>`

### Layout

```typescript
type LayoutData = {
  child: SplitData | PanelData
}
```

- Single reactive `child: Split | Panel`
- `moveTab(tab, targetPanel, direction, tabIndex)` — tree-wide tab moves; `direction` is a `SplitDirection` (`'center'` merges at `tabIndex`, `'left' | 'right' | 'top' | 'bottom'` split the target panel)
- `findPanelWithTab(node, tab)` — locate the panel holding a tab (walk from `node`, usually `child`)
- `normalize()` — root invariants: promote lone child after split consolidation; keep terminal empty panel

## Elements

### IoLayout

Root view. Renders `ioSplit` or `ioPanel` from `layout.child`.

```typescript
ioLayout({
  model: layoutModel,
  elements: contentPool,
})
```

Handles `io-add-tab-request` from panels and shows an overlay menu built from `elements`.

Also handles `io-tab-drag` from tabs: shows its own `IoTabDragGhost` in the overlay, resolves the drop target (tab index or panel edge) under the pointer, and calls `layout.moveTab()` on drop.

### IoSplit

Renders a Split model as a flex container with children and dividers.

- Divider resize events (`io-divider-move`, `io-divider-move-end`) write measured sizes to the model
- Drawer collapse when space is insufficient; `hasVisibleAutoSize` for CSS fallback when auto-size child is in a collapsed drawer

### IoPanel

Renders `IoTabs` header and `IoSelector` content area.

Tab keyboard actions arrive as `io-tab-action` events; `IoPanel.onTabAction` delegates to `Panel` methods:

- `select` → `panel.selectByIndex`
- `delete` → `panel.removeTab`
- `move-left` / `move-right` / `move-start` / `move-end` → `panel.moveTab`

After selection or reorder (`io-panel-tab-selected`), the panel focuses the selected tab element (debounced).

### IoTabs

Renders `IoTab[]` plus an add button that dispatches `io-add-tab-clicked`.

### IoTab

Individual tab element extending `IoField`.

- Click dispatches `io-tab-action` with action `select`; the close icon dispatches `delete`
- Shift+`Backspace` / Shift+`ArrowLeft` / Shift+`ArrowRight` / Shift+`Home` / Shift+`End` dispatch `delete`, `move-left`, `move-right`, `move-start`, `move-end`
- Dragging past a small threshold dispatches `io-tab-drag` (`start` / `move` / `end`) for cross-panel drag-and-drop

### IoDivider

Draggable handle between split children. Dispatches:

- `io-divider-move` — `{ clientX, clientY, element }` during drag
- `io-divider-move-end` — same payload when drag completes

`IoSplit` maps model `size` to CSS flex via `sizeToFlex()`, updates flex on adjacent siblings during drag, and persists pixel sizes to the model on drag end.

### IoDrawer / IoDrawerHandle

Collapsed split children shown as slide-out drawers when the split is too small for all children's size budgets. `IoDrawerHandle` dispatches `io-drawer-toggle`.

## Event Reference

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `io-tab-action` | IoTab | `{ model, action }` | Select, remove, reorder tab |
| `io-tab-drag` | IoTab | `{ model, phase, x, y }` | Cross-panel tab drag (`start` / `move` / `end`) |
| `io-panel-tab-selected` | Panel (model) | `{ index }` | Focus selected tab |
| `io-drawer-toggle` | IoDrawerHandle | — | Expand/collapse a drawer |
| `io-add-tab-clicked` | IoTabs | — | Open add-tab flow |
| `io-add-tab-request` | IoPanel | `{ model }` | Show add-tab menu for panel |
| `io-divider-move` | IoDivider | `{ clientX, clientY, element }` | Resize in progress |
| `io-divider-move-end` | IoDivider | `{ clientX, clientY, element }` | Resize complete |

## Data Flow

### Model → UI

Property changes on models trigger debounced `mutated()` on matching elements, which re-render from model state.

### UI → Model

User interaction on `IoTab` dispatches `io-tab-action`. `IoPanel` handles the event and calls the corresponding `Panel` method. Model mutations propagate up via `dispatchMutation()` for bound views and parent observers.

## Storage and Serialization

Persist a `Layout` instance (or bind it with `Storage` from `@io-gui/core`):

```typescript
import { Storage as $ } from '@io-gui/core'
import { Layout, ioLayout } from '@io-gui/layout'

const defaultLayout = new Layout({
  child: { type: 'split', children: [...] },
})

ioLayout({
  model: $({ key: 'my-layout-v3', storage: 'local', value: defaultLayout }),
  elements: contentPool,
})
```

**Persisted:** layout structure, orientations, size values, tab id/label/icon/selected.

**Not persisted:** `IoLayout.elements`, transient UI state, focus, scroll positions.

`Layout.toJSON()` returns `{ child: SplitData | PanelData }`. Defaults (`orientation: 'horizontal'`, `size: 'auto'`, etc.) are omitted from child JSON where unchanged.

Example serialized panel:

```typescript
{
  type: 'panel',
  size: '200px',
  tabs: [{ id: 'A' }]
}
```

## Nuances

### Duplicate tab IDs within a panel

`Panel.addTab` removes an existing tab with the same `id` in that panel first (with a console warning). Duplicate ids across different panels are allowed.

### Split consolidation

`Split.normalize()` and `Layout.normalize()` drop empty children, hoist single-child nested splits, and ensure one child has auto size. `Layout.normalize()` also promotes a lone child to `layout.child` and keeps a terminal empty panel when the tree would otherwise have no panels. Normalization runs from `Layout.childMutated` (debounced) after structural child changes.

### Minimum panel sizes during resize

Divider drag enforces `ThemeSingleton.fieldHeight * 4` minimum on adjacent siblings. Programmatic smaller `size` values are allowed but may produce cramped UI.

### Known limitations

- Tabs cannot be dragged between different `IoLayout` instances
- Shift+ArrowUp/Down reserved for future cross-panel keyboard moves
- Auto-size redistribution when removing the middle auto-size panel from three panels needs work
