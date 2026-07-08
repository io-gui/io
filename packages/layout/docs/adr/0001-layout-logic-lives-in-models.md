---
status: completed
---

# Layout structure and structural logic are owned by the models, not the elements

A layout is a `Layout` root whose child is a tree of `Split`/`Panel`/`Tab` models, rendered by `IoLayout`/`IoSplit`/`IoPanel`/`IoTab` elements.

The responsibility seam is **DOM-dependency**: operations that only read and write model state — structure, selection, size strings — belong on the models. `Layout` owns tree-scoped work; `Split` and `Panel` own local structure. Operations that need measured geometry stay on the elements — divider resize, drawer collapse, drag hit-testing, and focus. Element event handlers translate user gestures into model method calls (`layout.moveTab(...)`, `panel.removeTab(tab)`) and render the result.

**Model responsibilities:**
- `Layout` — `moveTab`, `convertToSplit`, `findPanelWithTab`, `findParentSplit`, root `normalize()`
- `Split` — `normalize()`, `consolidateChildAt()`, child `NodeArray`
- `Panel` — `addTab`, `removeTab`, `moveTab`, `selectByIndex`

## Consequences

Structural operations are unit-testable without rendering. Tree-wide operations live on `Layout` (see ADR-0003); per-split repair stays on `Split` (see ADR-0002).

**Exception:** tab drag keeps element refs in `IoLayout` for hit-testing and drop execution; drag ends with `layout.moveTab(...)`. Drag is transient and already requires DOM geometry for target detection.
