# Menus

The `@io-gui/menus` context: hierarchical trees of selectable options and the elements that present them as dropdowns, menu bars, context menus, and trees. (Naming scheme under active revision — being aligned with Layout's model/view convention.)

## Language

**Menu**:
The root model of a whole menu tree. Owns everything tree-scoped: selection tracking (`selectedID`, `path`), default selection, serialization, and invariants no single Option can see. Every menu tree has exactly one Menu. Its JSON form is structure only (ids, labels, icons, hints, modes, nesting) — selection persists separately through Path/`selectedID` bindings. (Being introduced — today the root is just another `MenuOption`.)
_Avoid_: root option, menu tree, manager

**Selection scope**:
The `select`-mode children of any one Option form a group in which at most one is selected; the parent enforces this in one place. `mode` stays per-child, so actions, toggles, and a radio cluster can share a parent. A Menu's `selectedID`/`path` are derived from the chain of selected scopes starting at the root.
_Avoid_: radio group, exclusive group

**Option**:
One node of a Menu's tree — an id/label/value with an interaction `mode` (`select` | `toggle` | `none`), an optional `action`, and optionally nested child options. Both branches and leaves are Options; tree-scoped state belongs on the Menu.
_Avoid_: item, entry, choice

**Id**:
An Option's identifier, unique across its whole Menu (a Menu invariant, debug-enforced). May not contain a comma — the Path separator. The only way Options are addressed. `label` and `value` default to it.
_Avoid_: key, name

**Value**:
Opaque payload data carried by an Option — delivered to its `action`, read off the selected Option, legitimately shareable between Options. Never an address: selection and lookup key on Id only. Entry points may *match* an app-bound value to an Option at their boundary, but that resolves to an Id.
_Avoid_: selector, key

**IoMenu / IoOption (paired views)**:
The two views paired with the models, Layout-style: `IoOption` renders one Option; `IoMenu` renders an expanded selection scope as a list (its `model` is the Menu or the branch Option whose children it shows). Every menus element holds its model in a property named `model`.
_Avoid_: IoMenuItem, IoMenuOptions, `option` (as a view property name)

**Entry point**:
A chrome element that summons or hosts a Menu in a distinct interaction pattern — dropdown (`IoOptionSelect`), right-click (`IoContextMenu`), hamburger (`IoMenuHamburger`), inline tree (`IoMenuTree`). Descriptively named, not model-paired; each takes `model: Menu`.
_Avoid_: wrapper, host, launcher

**Path**:
The comma-joined chain of selected Ids from the Menu root through nested selection scopes to the deepest selected Option. Derived from selection but writable: writing a Path selects the deepest Id that still exists (stale-tolerant restore). `selectedID` is its leaf, also writable; `selectedIDImmediate` (a scope's selected child) is read-only derived.
_Avoid_: route, trail, selection chain
