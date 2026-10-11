---
name: Core Construction Order
overview: Run ready() and the first change dispatch after the most-derived constructor instead of inside the base constructor, so handlers see fully constructed nodes. Includes the draft ADR (proposed core ADR-0005). Not scheduled.
todos:
  - id: adr
    content: "Review the draft ADR below; land it as packages/core/docs/adr/0005 when accepted"
    status: pending
  - id: audit
    content: "Inventory code that depends on reactions running inside the base constructor"
    status: pending
  - id: baseline-bench
    content: "Record construction benchmarks before the change"
    status: pending
  - id: register-wrapper
    content: "@Register returns a subclass that finishes construction when new.target is itself"
    status: pending
  - id: queue-during-construction
    content: "Queue property writes while constructing; finishing runs ready() then one dispatch"
    status: pending
  - id: register-call-sites
    content: "Function-form Register(X) call sites use the returned class"
    status: pending
  - id: debug-checks
    content: "Debug checks for unwrapped and unfinished construction"
    status: pending
  - id: core-tests
    content: "Core tests for the new order"
    status: pending
  - id: migrate-packages
    content: "Fix packages that rely on the old order; full test run and benches"
    status: pending
  - id: remove-workarounds
    content: "Remove timing-only @Field / declare workarounds, guards and duplicate handler calls"
    status: pending
  - id: docs
    content: "Update core README, SKILL, CONTEXT, io-gui.mdc and package skills"
    status: pending
isProject: false
---

<!-- Plan: @io-gui/core construction order -->

# Core Construction Order

Today `ReactiveObject` and `ReactiveElement` run `init()` → properties → `@Field`s → constructor args → `ready()` → the first change dispatch (`[prop]Changed()`, `[prop]-changed`, `mutated()`, `io-mutation`), all inside the base constructor. Only afterwards do subclass class fields initialize and subclass constructor bodies run. See core README "Construction Order" for the current rules and workarounds. Raised 2026-10-10 while building the three timeline (`Timeline._timeNode`, `Document._animatedTime`).

## Draft ADR

To land as `packages/core/docs/adr/0005-reactions-start-after-the-most-derived-constructor.md` once accepted.

```md
---
status: proposed
---

# Reactions start after the most-derived constructor

A node's constructors assign its properties, fields and constructor args, but `ready()` and the first change dispatch (`[prop]Changed()`, `[prop]-changed`, `mutated()`, `io-mutation`) run only once the most-derived constructor has finished. `@Register` returns a thin subclass of each class; its constructor finishes construction when `new.target` is itself, and until then property writes are queued, not dispatched. Construction stays synchronous: `new X(args)` returns a node whose handlers have run.

Until now these reactions ran inside the base constructor, before subclass class fields and constructor bodies. Handlers saw a partly built object: subclass fields were missing (guards in handlers, `@Field` used only for timing), a handler's write to a field without `declare` was silently reset when the subclass initialized its fields, arrow-function fields could not be passed as callbacks while `ready()` rendered, and properties set in a subclass constructor dispatched a second round of handlers.

## Considered Options

- **Keep reactions in the base constructor** and document the order and the `@Field` / `declare` workarounds. Rejected: the main failure is silent, and every package pays for it in workarounds.
- **`useDefineForClassFields: false`.** Stops the reset of fields without initializers, but fields with initializers still overwrite handler writes, and handlers still run before the subclass exists.
- **Defer the first dispatch to a microtask.** Makes construction asynchronous: code that reads derived state right after `new` breaks.
- **A static factory (`X.create(args)`).** Correct, but changes every `new X()` in every consumer.

## Consequences

- `Register` must be used for its return value. The decorator form does this; the function form becomes `X = Register(X)`. For elements the wrapper is the defined custom element, so constructing the unwrapped class throws `Illegal constructor`.
- `ready()` means "fully constructed, before the first dispatch". Handlers no longer run during construction, so constructor code that reads state derived by handlers moves into `ready()`.
- Constructor args and properties set in constructor bodies dispatch once, together.
- `@Field` keeps its meaning for values settable from constructor args, but is no longer needed only to survive construction order.
- `[prop]Mutated()` can still run during construction when a constructor mutates an already-built child node.
```

### `adr`

Review the draft: wording, the open questions below, and whether the change ships in a major version for consumers (the function form of `Register` changes).

### `audit`

Find code that depends on the current order, and size each fix. Starting points (2026-10-10):

- 31 `ready()` overrides; 38 constructors that do work after `super()` (layout models `Split`, `Panel`, `Tab`, `Layout`; `IoGl` builds its canvas and shader after `super()`, so its first `mutated()` render is only debounced; `Storage`; `NodeArray`).
- 26 explicit `this.[prop]Changed()` calls in constructors and `ready()`. Most compensate for defaults never dispatching and stay; ones that re-run handlers already run for args become duplicates.
- Constructors that set a property, then read state its handler derived (after the change they read stale state until `ready()`). Example: `Editor` calls `this.isPlayingChanged()` after `super()`.
- Timing workarounds: comments "inside the base constructor" (`Editor._selections`, `Document._changes`, `Document._animatedTime`, `Timeline._timeNode`, `IoEditorExample._documents`), the `ThreeViewport` handlers that skip input routing before `inputRouter` exists, `ThreeEditorStatus` assigning `this.editor` again after `super()`.
- 22 function-form `Register(X)` calls in non-test source, 5 in tests and benches.

Useful searches: `rg "base constructor" packages/*/src`, `rg "^\s*Register\(" packages/*/src`, `rg "this\.\w+Changed\(\)" packages/*/src`.

### `baseline-bench`

Run `pnpm bench` (construction cases in `ReactiveObject.bench.ts` and element benches) and keep `benchmarks/results-baseline.json` for comparison. The wrapper adds one constructor frame per registered class in the chain.

### `register-wrapper`

Sketch:

```ts
export function Register<T extends ReactiveNodeConstructor>(Base: T): T {
  const Registered = class extends (Base as any) {
    constructor(...args: unknown[]) {
      super(...args)
      if (new.target === Registered) finishConstruction(this)
    }
  }
  Object.defineProperty(Registered, 'name', {value: Base.name})
  Registered.prototype.Register(Registered)   // protochain, localName, customElements.define, vConstructor
  return Registered as T
}
```

Check: the ProtoChain walk sees wrappers between classes and must ignore them (they have no own statics or decorator metadata; decorator maps are keyed by the original class). `customElements.define`, `window[name]` and the `vConstructor` debug check use the wrapper. `constructor.name` stays readable in errors.

### `queue-during-construction`

The base constructor sets a constructing flag; while it is set, `dispatchQueue()` only queues. `finishConstruction(node)` clears it, calls `ready()`, then dispatches once. Elements created by the HTML parser or `document.createElement` run the wrapper constructor too, so they finish the same way; props applied later by the VDOM dispatch as usual.

### `register-call-sites`

Replace `Register(X)` statements with `X = Register(X)` (or decorate). Consider a codemod. Consumers using the function form must do the same.

### `debug-checks`

- Constructing an unwrapped class: objects warn (elements already throw).
- A node whose construction never finished (most-derived class not registered): warn from a microtask.

### `core-tests`

Handlers see subclass class fields and constructor-body state; a handler's write to a field without `declare` survives; arrow-function fields work as callbacks rendered from `ready()`; args plus constructor-body writes dispatch once; nested construction (`init: null` children, VDOM children) finishes inner nodes first; elements from `new`, VDOM and `document.createElement`; bindings passed as args.

### `migrate-packages`

Fix what the audit found, then `pnpm test` (all packages), `tsc -b`, `pnpm lint:check`, and compare benches with the baseline.

### `remove-workarounds`

Turn timing-only `@Field`s and `declare`d lazy fields back into class fields where nothing sets them from args, drop guards and duplicate handler calls, and update the "inside the base constructor" comments.

### `docs`

Core README "Construction Order" and lifecycle table, core SKILL gotcha, core CONTEXT `Field` entry (its definition cites handlers running inside `super()`), io-gui.mdc, and package skills that mention the order.

## Open questions

- Should `[prop]Mutated()` caused by a constructor mutating its own child also wait for `finishConstruction`?
- Does `init()` keep running first inside the base constructor (before properties exist)?
- Release: a major version for consumers, or a deprecation period where unwrapped classes keep the old order and warn?
