# Menus

The `@io-gui/menus` context: hierarchical trees of selectable options and the elements that present them as dropdowns, menu bars, context menus, and trees. A `Menu` owns the root of a tree of `Option`s; paired views render them and translate gestures back into model operations. (The Menu/Option split and view renames are being introduced — today the root is just another `MenuOption`.)

## Language

### Model

**Menu**:
The root model of a whole menu tree. Owns everything tree-scoped: selection tracking (`selectedID`, `path`), tree Disclosure (`expandedIDs`), default selection, serialization, and invariants no single Option can see. Every menu tree has exactly one Menu. Its JSON form is structure only (ids, labels, icons, hints, modes, nesting) — selection persists separately through Path/`selectedID` bindings.
_Avoid_: root option, menu tree, manager

**Option**:
One node of a Menu's tree — an id/label/value with an interaction Mode, an optional `action`, and optionally nested child options. Both branches and leaves are Options; tree-scoped state belongs on the Menu.
_Avoid_: item, entry, choice

**Id**:
An Option's identifier, unique across its whole Menu (a Menu invariant, debug-enforced). May not contain a comma — the Path separator. The only way Options are addressed. `label` and `value` default to it.
_Avoid_: key, name

**Value**:
Opaque payload data carried by an Option — delivered to its `action`, read off the selected Option, legitimately shareable between Options. Never an address: selection and lookup key on Id only. Entry points may *match* an app-bound value to an Option at their boundary, but that resolves to an Id.
_Avoid_: selector, key

**Mode**:
How an Option responds to Activation: `select` (persistent, exclusive within its scope), `toggle` (persistent, independent), `none` (transient command). Defaulted by inference: an Option with an `action` defaults to `none`; one without defaults to `select`. An explicit mode always wins.
_Avoid_: type, kind, behavior

### Selection

**Selection scope**:
The `select`-mode children of any one Option form a group in which at most one is selected; the parent enforces this in one place. Mode stays per-child, so actions, toggles, and a radio cluster can share a parent. A Menu's `selectedID`/Path are derived from the chain of selected scopes starting at the root.
_Avoid_: radio group, exclusive group

**Path**:
The comma-joined chain of selected Ids from the Menu root through nested selection scopes to the deepest selected Option. Derived from selection but writable: writing a Path selects the deepest Id that still exists (stale-tolerant restore). `selectedID` is its leaf, also writable. A scope's selected child is derived on demand via `getSelectedIDImmediate()` — never stored, never bound.
_Avoid_: route, trail, selection chain

**Default selection**:
Selecting a branch's chain of first `select`-mode children, deliberately triggered when the user activates a branch shown at its Depth limit (a shallow navigator's click-a-section behavior). The model operation is `selectDefault()`, also used for initial selection.
_Avoid_: auto-select, fallback selection

### Interaction

**Activation**:
A user committing an Option — running its action, flipping its toggle, or making a selection. The one public synthetic event: `io-option-clicked`. Selection *state* has no public events — apps observe it by binding `selectedID`/Path. Chrome geometry events (e.g. tree resize) are element-internal, not domain API.
_Avoid_: click (as a domain term), commit, trigger

**Expansion**:
Transient view state: whether an Option's submenu is currently popped open (in the overlay, or inline while a menu bar is engaged). Hover/keyboard-driven, never persisted, never on the model.
_Avoid_: open, disclosure (for overlays)

**Disclosure**:
Persistent tree state: which branch Options an inline tree shows expanded. Menu-level (`expandedIDs`) — a derived-but-writable projection like Path, persisted through a single host-chosen storage binding.
_Avoid_: expansion (for trees), collapsible state

**Depth**:
How many nested levels a view lets the user walk below itself. A `select`-mode branch at the limit renders as a leaf and activates by Default selection.
_Avoid_: levels, nesting limit

### Views

**IoMenu / IoOption (paired views)**:
The two views paired with the models, Layout-style: `IoOption` renders one Option; `IoMenu` renders an expanded selection scope as a list (its `model` is the Menu or the branch Option whose children it shows). Every menus element holds its model in a property named `model`.
_Avoid_: IoMenuItem, IoMenuOptions, `option` (as a view property name)

**Entry point**:
A chrome element that summons or hosts a Menu in a distinct interaction pattern — dropdown (`IoOptionSelect`), right-click (`IoContextMenu`), hamburger (`IoMenuHamburger`), inline tree (`IoMenuTree`). Descriptively named, not model-paired; each takes `model: Menu`.
_Avoid_: wrapper, host, launcher
