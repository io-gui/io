---
name: io-gui-layout
description: >-
  Build IDE-like Io-Gui layouts with Layout/Split/Panel/Tab models and IoLayout.
  Use when working with @io-gui/layout, tabbed splits, drawers, dividers, elements
  pool, content ids, or layout persistence.
---

# @io-gui/layout

## Defaults

- Import from `@io-gui/layout`.
- One **`Layout`** root holds a single child: a **`Split`** or **`Panel`**.
- Models own structure; views (`IoLayout`, `IoSplit`, `IoPanel`, `IoTabs`, `IoTab`, …) render and forward gestures into model ops.
- Host supplies **`IoLayout.elements`** (elements pool). Models store **content ids** on Tabs — never VDOM instances.

## Gotchas

- **Elements pool is not persisted.** Restore layout JSON + re-supply the pool on mount.
- Same content id may appear in tabs across panels (split view). Within one panel, tab ids are unique; `addTab` dedupes.
- **Orphan tabs** (id missing from pool) stay in the panel with saved chrome; content area empty until pool catches up — layout does not auto-strip.
- Normalization is **debounced** after structural mutators — brief un-normalized trees are expected between mutate and normalize.
- Tree-wide tab moves: `Layout.moveTab`. Within-panel add/remove/reorder/select: `Panel` methods.
- **Drawer** here = collapsed Split child behind a handle. Not navigation's `IoNavigatorDrawer`.
- Each `IoLayout` owns its own drag ghost in the overlay (not a page-wide singleton).

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API / examples: [README.md](../../README.md)
