# Current Focus

Grilling session #2 on @io-gui/layout architecture (grill-with-docs). Prior session delivered CONTEXT.md, ADR-0001 (logic in models, accepted/migrating), ADR-0002 (reactive normalize, proposed), flex validation, drag root-walk fix.

Open design branches to grill (one at a time):
1. RESOLVED: Layout model + IoLayout view; Layout.child: Split | Panel. CONTEXT.md + ADR-0003 updated; ADR-0001/0002 aligned.
2. RESOLVED: elements pool on IoLayout.elements only; models store tab content ids; pool threaded to descendants; not persisted.
3. RESOLVED: add-tab picker per-panel (same content id allowed across panels).
4. RESOLVED: cross-panel drag moves Tab instance; tree-wide op → Layout.moveTab(tab, targetPanel, direction).
5. RESOLVED: normalization synchronous (invariants hold when structural methods return); ADR-0002 updated.
6. RESOLVED: Panel owns local tab ops; Layout owns tree-wide (moveTab, split-on-edge).
7. RESOLVED: Split.normalize owns flex-grow invariant; IoSplit owns hasVisibleFlexGrow (drawer-aware CSS).
8. RESOLVED: orphan tabs kept; empty content slot; no auto-strip on hydrate.
9. RESOLVED: add-tab menu always derived from elements pool (curated addMenuOption removed).
10. RESOLVED: drag scope = whole Layout; global drag singleton for now; IoLayout as explicit root not DOM walk.
11. RESOLVED: drag singleton keeps IoPanel element refs (b); ADR-0001 exception noted.
12. RESOLVED: disposal via NodeArray.dispose(deep=true default); ReactiveObject passes deep; shallow via dispose(false). Removed manual array clears on Split/Panel/MenuOption.
2. Model API surface for structural ops: addTab/removeTab/moveTab on Panel; splitPanel/consolidate on Split; where does cross-panel moveTabToSplit live.
3. Normalize semantics: debounced vs sync, re-entrancy guard, who owns ensureOneHasFlexGrow (currently element, mixed w/ drawer visibility).
4. Flex ownership: divider resize writes flex; parseFlexBasis 240 default in element; min-size language.
5. Selection invariant: removeTab at model level must reselect; currently element does it.
6. Same tab id in two panels — shared elements pool means same VDOM element could render twice. Domain question: allowed or not?

Key code facts: model children have `_parents` (ReactiveCore); IoTab walks DOM to find root io-split; io-panel-remove/io-split-remove/io-split-consolidate DOM events still live in IoSplit.
