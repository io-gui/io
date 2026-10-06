# ReactiveNode names the reactive-graph union, not the Object base class

The reactive system has two concrete bases — one extending `Object`, one extending `HTMLElement` — that are siblings, not parent/child, and both participate in a shared `_parents`/`_children` graph. We had three overlapping names for "either of them" (`ReactiveOwner`, `isIoValue`, informal "Node") and used "Node"/"ReactiveNode" for the `Object` base class.

We decided the union concept is primarily a **graph vertex**, so it takes the name **`ReactiveNode`** (predicate `isReactiveNode`). The two concrete bases are renamed for consistency: the `Object`-based class becomes **`ReactiveObject`** and the `HTMLElement`-based `IoElement` becomes **`ReactiveElement`**. `ReactiveOwner` and `isIoValue`/`IoValue` are removed — the latter was an accident of reactive nodes often being assigned to a `.value` property, not a real concept.

Chosen over keeping `ReactiveOwner` (which avoided base-class churn) because "node" truthfully names a graph vertex and the graph is the defining trait of the union, whereas "owner" only describes property ownership.

## Consequences

Cross-package rename: `ReactiveNode`(class) → `ReactiveObject`, `IoElement` → `ReactiveElement`, `ReactiveOwner` → `ReactiveNode`, `isReactiveOwner` → `isReactiveNode`, delete `isIoValue`; internal flags `_isNode` → `_isReactiveObject` and `_isIoElement` → `_isReactiveElement`. Informal pairing in docs is **objects and elements**; **node** is reserved for a graph vertex (`ReactiveNode`).
