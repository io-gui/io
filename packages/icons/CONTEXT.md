# Icons

The `@io-gui/icons` context: a global SVG icon registry and the element that renders from it. Icons are addressed by namespace-qualified ids; strings without a colon are plain text.

## Language

**Icon reference**:
A string `namespace:id` that selects one registered SVG group (e.g. `io:gear`). The only address form for lookup.
_Avoid_: icon name (alone), icon path, glyph id

**Namespace**:
The left side of an Icon reference. Built-in set is `io`; apps register additional namespaces on the singleton.
_Avoid_: prefix, pack, set name (alone)

**IconsetSingleton**:
Global registry that stores SVG markup by namespace and id and serves `IoIcon`. Views do not hold icon markup themselves.
_Avoid_: icon registry, icon database (as class names)

**Text fallback**:
When `IoIcon.value` has no `:`, the string is shown as text content instead of an icon lookup. Empty value hides the element.
_Avoid_: label mode, missing icon placeholder
