# Io-Gui

Io-Gui is a multi-paradigm reactive web UI framework. Its domain is the small set of primitives that give DOM elements and plain data models a single, shared reactive system: properties, change/mutation propagation, bindings, and rendering.

## Language

### Reactive entities

**ReactiveNode**:
A vertex in Io-Gui's reactive graph — any participant linked through `_parents`/`_children`. The union of `ReactiveObject` and `ReactiveElement`; the predicate is `isReactiveNode`. The graph (not property ownership) is the defining trait.

**ReactiveObject**:
The non-DOM base class for reactive models and state containers; extends `Object`. One of the two concrete kinds of `ReactiveNode`.

**ReactiveElement**:
The DOM-backed base class for reactive custom elements; extends `HTMLElement`. The other concrete kind of `ReactiveNode`. Adds virtual DOM rendering, inherited CSS, and DOM event bridging on top of the shared reactive system.

### Data flow

**change**:
A reactive property is reassigned to a different value, decided by strict `===` identity. Property-level and trunk→leaf: drives a node's own responsive logic. A same-value write, or a write that nets back to the original within one dispatch cycle, is not a change.

**mutation**:
A container changed internally rather than being replaced. A `ReactiveNode` mutates when any of its properties *change* — this is the node mutating, handled by `mutated()`, and it bubbles up the graph via `io-object-mutation`. A plain object or nested node held at a property mutating in place surfaces locally as `[prop]Mutated()` and, by design, does **not** auto-bubble further; re-dispatching it upward is opt-in and usually an anti-pattern. Routing is by object **identity**, so one object held at two properties fires both handlers.

### Property model

**Property**:
A reactive value on a `ReactiveNode`, carrying the full pipeline: change tracking, mutation observation, optional two-way `Binding`, and an optional `reflect` to a host attribute. Declared via `@Property` / `static Properties`. The default way to hold state — reactivity is assumed.

**Field**:
A non-reactive value that must still be initialized *during* construction — early enough that reactive change/mutation handlers running inside `super()` can rely on it — and/or be settable from the constructor `args`. Declared via `@Field` / `static Fields`. Unlike a plain class field (assigned only after the constructor finishes), a `Field` is wired up early and never triggers reactivity. Reach for it only for that lifecycle/init reason, not as a default.

**reflect**:
A `Property` option that mirrors the property's value to a matching attribute on the host element, typically to bridge state into CSS selectors.

### Bindings & persistence

**Binding**:
A graph-tethered handle to one property of one owner `ReactiveNode`, kept in two-way sync with target properties on other nodes. It cannot exist without an owner node and is always used through one so it stays part of the graph. Created via `bind(node, 'prop')`; assigning a `Binding` onto another node's property registers that property as a sync target. Not a property option — a property's `binding` field merely references one.

**Storage**:
A factory that creates (or reuses) a singleton persistent `StorageNode` for a `key` + backend (`local` | `hash` | `none`) and returns a `Binding` to its value — a graph-ready handle you assign onto node properties to bind state to `localStorage` or the location hash. The `$`-prefixed exports (`$Theme`, `$ThemeID`) are such bindings.

### Class setup

**Register**:
The one-time class setup every `ReactiveNode`/`ReactiveElement` subclass needs. Applied via the `@Register` decorator (sugar) which calls the overridable `prototype.Register()` that does the work: builds the `ProtoChain` (merges inherited properties, fields, listeners, styles; auto-binds handlers) and sets reactive flags. For `ReactiveElement` it additionally defines the custom element in the browser `customElements` registry with its tag name. Subclasses extend it with `super.Register()`.
