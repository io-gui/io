# Editors

The `@io-gui/editors` context: universal property inspection for arbitrary objects. Config maps pick widgets and groups by constructor; inspector elements walk properties and drill into nested values. Objects under inspection need not be ReactiveNodes.

## Language

### Configuration

**PropertyConfig**:
A tuple `[PropertyIdentifier, VDOMElement]` that maps a matcher (property name string, RegExp, value constructor, `null`, or `undefined`) to a prebuilt VDOM widget. Registered per constructor via `registerEditorConfig`; configs inherit along the prototype chain.
_Avoid_: `{tag, props}` object shape, widget descriptor object

**EditorConfig**:
The per-constructor collection of PropertyConfigs used to resolve which widget edits each property. Match priority: exact name, then value type, then RegExp.
_Avoid_: schema, form config

**EditorGroups**:
Named buckets of property-name matchers (strings or RegExp) that organize inspector rows into collapsible sections. Defaults include Main (ungrouped), Hidden (`__*`, `constructor`, …), and Advanced (`_*`).
_Avoid_: sections, categories, tabs

**Property visibility**:
Convention for which properties appear where: `__` prefix → Hidden group; `_` prefix → Advanced; others → Main unless grouped explicitly.
_Avoid_: private, public (as grouping rules)

**Widget**:
The VDOM element chosen for one property row — typically an inputs/sliders/colors/menus control bound to that property. Type-level chrome, not a separate editor framework.
_Avoid_: control, field editor, input type

### Inspection

**Persistent expand**:
Whether an `IoObject` row stays expanded across sessions, keyed by a stable object identifier (`guid` / `uuid` / `id` / `name` when present). Stored in localStorage.
_Avoid_: open state, collapsed flag

**Breadcrumb drill-down**:
`IoBreadcrumbs` path through nested objects the inspector has opened; selecting a crumb returns the editor to that object.
_Avoid_: navigation stack, history

**IoContextEditorSingleton**:
Overlay singleton that opens a property editor on right-click. Owns popup lifecycle; views forward the gesture.
_Avoid_: context menu editor, popup inspector
