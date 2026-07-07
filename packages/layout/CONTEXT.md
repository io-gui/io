# Layout

The `@io-gui/layout` context: IDE-like arrangements of content into resizable, tabbed, drag-and-droppable regions. A `Layout` owns the root of a tree of `Split` and `Panel` models, rendered by `IoLayout` and matching child elements; the models own the structure, the elements render it and translate gestures back into model operations.

## Language

### Tree

**Layout**:
The root model of a whole arrangement. Holds a single **child** — either a `Split` or a `Panel` — and owns everything tree-scoped: operations that span panels (moving a tab across the tree) and invariants no `Split` can see (a panel always survives). When consolidation collapses the tree to one panel, the child becomes that `Panel` directly. Every arrangement has exactly one `Layout`.
_Avoid_: workspace, root split, manager, layout tree

**Split**:
An internal tree node that arranges its children — other `Split`s or `Panel`s — along a single orientation. Never holds content directly.
_Avoid_: pane group, region, container, section

**Panel**:
A leaf tree node that holds an ordered set of `Tab`s and shows the content of its one selected tab.
_Avoid_: pane, window, view, frame

**Tab**:
A named handle inside a `Panel` that selects one content id from the elements pool. Carries `id` (the content id), `label`, `icon`, `selected`. The same content id may appear in tabs across different panels (split view of the same document); within one panel, ids are unique.
_Avoid_: page, sheet, card

**Orientation**:
The axis a `Split` lays its children along — `horizontal` (a row) or `vertical` (a column).
_Avoid_: axis, layout, flow

**Size**:
A child's size within its parent `Split`. Stored as `size` (`"auto"`, a pixel length, or a percentage). `"auto"` grows to fill remaining space (`flex: 1 1 auto`); fixed values hold a basis (`flex: 0 1 <size>`). Each `Split` keeps at least one child with `size: "auto"` in the model. When a drawer hides children, the view separately tracks whether any **visible** child has auto size — a presentation concern, not a model invariant.
_Avoid_: flex, weight, ratio, span

**MinSize**:
The minimum space a child needs before drawer collapse. Stored as a pixel length or percentage, default `"240px"`. Decoupled from `size` — a wide panel can collapse to a narrow drawer handle.
_Avoid_: flex-basis, drawer size

### Content

**Content id**:
The string on a `Tab` that selects which entry from the application-provided **elements pool** a panel shows. Models store only this id (plus tab chrome: label, icon, selection) — never VDOM or element instances. The view matches `Tab.id` to `elements[].props.id` at render time.
_Avoid_: element, slot key, view id

**Elements pool**:
The catalog of content the application registers on `IoLayout.elements` — VDOM descriptors the layout can open in tabs. Not part of the persisted layout; the host supplies it when mounting. `IoLayout` threads the pool to descendant views so each panel can render selected content and offer entries when the user adds a tab. The add-tab picker is always derived from pool entries whose content id is not already in **that panel**; the same id may be open in other panels.
_Avoid_: content list, pages, views

**Content element**:
One entry in the elements pool — a VDOM element whose `id` matches a tab's content id. Matched at render time; not stored on the model.
_Avoid_: page, view, body

**Orphan tab**:
A tab whose content id has no matching entry in the current elements pool — e.g. after restore when the app catalog changed. The tab stays in the panel with its saved label and icon; the content area shows nothing until the host supplies that id again or the user removes the tab. Layout does not auto-strip orphans.
_Avoid_: broken tab, dead tab, invalid tab

**Selection**:
The single `Tab` per `Panel` whose content is currently shown. Exactly one tab is selected while a panel is non-empty.
_Avoid_: active tab, current tab

### Structure operations

**Consolidation**:
Collapsing a redundant `Split` — one that has a single child — into its parent, so the tree never nests without branching. The parent replaces the redundant split with its lone child; when the lone child is a `Split` with a different orientation and the parent has siblings, the inner split is kept rather than inlined (so the parent orientation is preserved). When orientations match, or the parent has only that one child, the parent may adopt the lone child-split's grandchildren and orientation instead. When the parent is the `Layout`, the lone child becomes the layout's child directly — a `Panel` stays a `Panel`, not wrapped in a one-child `Split`.
_Avoid_: flatten, merge, simplify

**Normalization**:
Restoring invariants after a structural edit, **synchronously** — the tree is well-formed when each public model method returns. Each `Split` normalizes locally: no empty children, no single-child splits (consolidate), and at least one child that grows. The `Layout` normalizes at the root: when the last tab of the last panel is removed, an empty `Panel` survives as the terminal state. Runs inside a re-entrancy guard so repairs do not loop. Render scheduling stays debounced separately.
_Avoid_: cleanup, repair, fixup, validate

**Split direction**:
Where a dragged `Tab` lands on a target `Panel`: `center` merges it into that panel's tabs; an edge (`top`/`bottom`/`left`/`right`) splits the panel, creating a new sibling `Panel`. The dragged **tab handle** (`Tab` instance) moves — label, icon, and selection travel with it; cross-panel drag is relocation, not a fresh slot from the elements pool. Tree-wide moves are `Layout.moveTab`; within-panel add, remove, reorder, and selection are `Panel` methods.
_Avoid_: drop side, drop zone, quadrant

### Chrome

**Divider**:
The draggable handle between two `Split` children that resizes the pair.
_Avoid_: splitter, gutter, resizer, handle

**Drawer**:
A child pushed to a `Split`'s leading or trailing edge and collapsed behind a handle when the split is too small to fit all children at their minimum size; it slides open over the content. Drawer views render the same `Panel`/`Split` models as inline children — disposing drawer chrome must not dispose shared model collections (e.g. `Panel.tabs`).
_Avoid_: sidebar, panel, flyout, tray

**Overflow (tab)**:
The state of an `IoTabs` bar whose tabs exceed its width, which hides the tabs behind a hamburger menu listing them vertically.
_Avoid_: collapse, hidden tabs

**Drag scope**:
The set of panels that can receive a dragged tab — the whole tree under one `Layout`. Tabs cannot be dropped outside the layout that started the drag. One tab drag runs at a time page-wide (shared drag singleton); sufficient for single-workspace apps.
_Avoid_: drop region, drag boundary
