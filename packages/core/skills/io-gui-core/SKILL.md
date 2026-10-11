---
name: io-gui-core
description: >-
  Author ReactiveObject/ReactiveElement subclasses with Io-Gui core primitives —
  @Register, @Property, @Field, bindings, change vs mutation, VDOM, Theme, Storage.
  Use when building on @io-gui/core, defining custom elements or models, or wiring
  two-way bindings and persistence.
---

# @io-gui/core

## Defaults

- Import from `@io-gui/core`, never deep relative paths into the package.
- Every subclass: `@Register` (or `Register(Class)`) before instantiate.
- Reactive state → `@Property` / `static Properties`. Init-only non-reactive → `@Field` / `static Fields`.
- Elements: `static Style` selectors must start with `:host`.
- Handlers named `on*` / `_on*` / `*Changed` / `*Mutated` / `*Debounced` / `*Throttled` auto-bind — no `.bind(this)`.

## Gotchas

- **change ≠ mutation.** Change = property reassigned (`===`). Mutation = in-place edit of a held object/array/node. Plain objects need `dispatchMutation(obj)` after in-place edits.
- Nested plain-object mutations fire `[prop]Mutated()` locally and do **not** auto-bubble further — re-dispatching upward is usually wrong.
- `NodeArray` properties need `init: 'this'`. Only the owning node disposes the array.
- `Binding` from `bind(node, 'prop')` or `this.bind('prop')` — assign onto another property to sync. Forward sync is a graph write inside a binding wave, not a plain assignment.
- Elements have three relations: reactive graph (`_parents`/`_children`), DOM tree, VDOM children from `render()`. Cross-domain reactivity lives where graph ≠ DOM.
- `ThemeSingleton` properties become `--io_*` CSS variables; theme colors use core **`Color`**, not colors-package ColorValue.
- `Storage({key, value, storage: 'local' | 'hash' | 'none'})` returns a **Binding** to a singleton `StorageNode` — assign it onto properties for hash/local persistence.
- Arrow-function methods are not auto-bound as listeners.
- **Construction runs reactions inside `super()`:** `init()` → properties, `@Field`s → args → `ready()` → `*Changed()`, `mutated()`, `io-mutation`, all before the subclass's class fields and constructor body. State that `ready()` or handlers touch must be a `@Field` or a `declare`d field created lazily; a plain field is missing then, and without `declare` it is re-initialized after `super()`. Pass `on*` methods (not arrow fields) as callbacks rendered from `ready()`.
- A node held in a property reports mutations to `[prop]Mutated()` only; the holder's `mutated()` does not run. Use a child node to keep a per-frame value out of the parent's change handling.
- `IoGl`: properties map to uniforms. For extra uniforms, declare them in `Frag` and `setShaderProgram()` + `setUniform()` before `super.onRender()`; draw text on `this.ctx` after it. Uniforms are float32: pass pixel positions, not large values.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API tables / examples: [README.md](../../README.md)
