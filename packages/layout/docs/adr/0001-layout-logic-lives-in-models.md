---
status: accepted (target); migration in progress
---

# Layout structure and structural logic are owned by the models, not the elements

A layout is a `Layout` root whose child is a tree of `Split`/`Panel`/`Tab` models, rendered by `IoLayout`/`IoSplit`/`IoPanel`/`IoTab` elements. Historically the models were thin data-holders and the elements carried the tree-editing logic — `addTab`/`removeTab`/`moveTab`, panel-splitting (`convertToSplit`, `moveTabToSplit`), single-child `consolidateChild`, empty-child removal, and `ensureOneHasFlexGrow` all live on the elements and mutate the models through DOM parent lookups (`this.parentElement as IoSplit`). This ties structural integrity to rendering and contradicts the project rule that a model owns *both* state and the behavior operating on it.

We decided the responsibility seam is **DOM-dependency**: every operation that only reads and writes model state (structure, selection, flex strings) belongs on the models — `Layout` for tree-scoped work, `Split`/`Panel` for local structure; only operations that genuinely need measured geometry stay on the elements — divider resize math, drawer-collapse sizing, drag hit-testing, and focus. Element event handlers become thin: they translate a user gesture into a model method call (`layout.moveTab(...)`, `panel.removeTab(tab)`) and render the result.

Chosen over the status quo ("elements own the tree because they can see geometry") because that fuzzy seam is exactly why logic leaked into views, left the tree untestable without a DOM, and made structural correctness depend on the element tree existing and matching the model. Chosen over a fully DOM-agnostic model that also does geometry, because measurement inherently requires layout and belongs with the element.

## Consequences

The pure structural operations become unit-testable without rendering. Migration is incremental — the models gain the methods first, elements are repointed to them, and the DOM-parent-walking logic is retired as it moves. Until migration completes, both locations may transiently hold structural code. Tree-wide operations consolidate on `Layout` (see ADR-0003); per-split repair stays on `Split` (see ADR-0002).

**Exception:** tab drag keeps element refs in the drag singleton for source/target panels — hit-testing and drop execution stay on `IoPanel`/`IoLayout` rather than resolving to model refs first. Acceptable because drag is transient and DOM geometry is already required for target detection; model migration applies to structural edits, not the drag gesture path.
