---
name: binding generic hardening
overview: Introduce generic Binding typing and key-aware bind() inference in core while keeping runtime binding behavior unchanged. Harden all direct Binding type surfaces and then update core call sites to use inferred property-bound types.
todos:
  - id: generic-binding-class
    content: Convert Binding to generic Binding<T> with typed value getter/setter.
    status: completed
  - id: typed-bind-apis
    content: Add key-based generic bind/unbind typing in ReactiveNode and IoElement plus helper overloads.
    status: completed
  - id: internal-binding-types
    content: Harden internal metadata holders to Binding<unknown> where property type is dynamic.
    status: completed
  - id: props-and-storage
    content: Update IoSpan and StorageNode/Storage type surfaces to use typed Binding unions/returns.
    status: completed
  - id: core-validation
    content: Run core tests/type checks and fix any compile regressions from stricter binding types.
    status: completed
isProject: false
---

# Binding Generic Refactor Plan

## Scope
- Keep runtime behavior unchanged (decorators remain runtime-driven, `instanceof Binding` checks unchanged).
- Improve compile-time typing so property bindings are typed as `Binding<propertyType>`.

## Classes That Can Be Type-Hardened
- **Directly hardened (source changes):**
  - `Binding` in [`/Users/aki/Projects/io/packages/core/src/core/Binding.ts`](/Users/aki/Projects/io/packages/core/src/core/Binding.ts)
  - `ReactiveNode` in [`/Users/aki/Projects/io/packages/core/src/nodes/ReactiveNode.ts`](/Users/aki/Projects/io/packages/core/src/nodes/ReactiveNode.ts)
  - `IoElement` in [`/Users/aki/Projects/io/packages/core/src/elements/IoElement.ts`](/Users/aki/Projects/io/packages/core/src/elements/IoElement.ts)
  - `ReactiveProtoProperty` in [`/Users/aki/Projects/io/packages/core/src/core/ReactiveProperty.ts`](/Users/aki/Projects/io/packages/core/src/core/ReactiveProperty.ts)
  - `ReactivePropertyInstance` in [`/Users/aki/Projects/io/packages/core/src/core/ReactiveProperty.ts`](/Users/aki/Projects/io/packages/core/src/core/ReactiveProperty.ts)
  - `StorageNode` in [`/Users/aki/Projects/io/packages/core/src/nodes/Storage.ts`](/Users/aki/Projects/io/packages/core/src/nodes/Storage.ts)
  - `IoSpan` (via `IoSpanProps`) in [`/Users/aki/Projects/io/packages/core/src/elements/IoSpan.ts`](/Users/aki/Projects/io/packages/core/src/elements/IoSpan.ts)
- **Hardened via inherited `bind()` typing (no or minimal class-local edits):**
  - `Theme` in [`/Users/aki/Projects/io/packages/core/src/nodes/Theme.ts`](/Users/aki/Projects/io/packages/core/src/nodes/Theme.ts)
  - `IoOverlay` in [`/Users/aki/Projects/io/packages/core/src/elements/IoOverlay.ts`](/Users/aki/Projects/io/packages/core/src/elements/IoOverlay.ts)
  - `IoGl` in [`/Users/aki/Projects/io/packages/core/src/elements/IoGL.ts`](/Users/aki/Projects/io/packages/core/src/elements/IoGL.ts)
  - `IoThemeEditor` in [`/Users/aki/Projects/io/packages/core/src/demos/IoThemeEditor.ts`](/Users/aki/Projects/io/packages/core/src/demos/IoThemeEditor.ts)
  - `IoStyleContainer` in [`/Users/aki/Projects/io/packages/core/src/demos/IoStyleContainer.ts`](/Users/aki/Projects/io/packages/core/src/demos/IoStyleContainer.ts)
  - `IoElementInspectorDemo` in [`/Users/aki/Projects/io/packages/core/src/demos/IoElementInspectorDemo.ts`](/Users/aki/Projects/io/packages/core/src/demos/IoElementInspectorDemo.ts)
  - `IoChangeVisualization` in [`/Users/aki/Projects/io/packages/core/src/demos/IoChangeVisualization.ts`](/Users/aki/Projects/io/packages/core/src/demos/IoChangeVisualization.ts)

## Refactor Steps
1. Make `Binding` generic (`Binding<T = unknown>`) and type its `value` accessor as `T` in [`/Users/aki/Projects/io/packages/core/src/core/Binding.ts`](/Users/aki/Projects/io/packages/core/src/core/Binding.ts).
2. Update shared helper aliases in [`/Users/aki/Projects/io/packages/core/src/nodes/ReactiveNode.ts`](/Users/aki/Projects/io/packages/core/src/nodes/ReactiveNode.ts):
   - `WithBinding<T>` -> `T | Binding<T>`
   - add key-constrained generic overloads for `bind()` / `unbind()` using `K extends keyof this` and return `Binding<this[K]>`.
3. Mirror the same method typing on `IoElement.bind()` / `IoElement.unbind()` in [`/Users/aki/Projects/io/packages/core/src/elements/IoElement.ts`](/Users/aki/Projects/io/packages/core/src/elements/IoElement.ts) so element subclasses infer typed bindings.
4. Harden internal binding holder types in [`/Users/aki/Projects/io/packages/core/src/core/ReactiveProperty.ts`](/Users/aki/Projects/io/packages/core/src/core/ReactiveProperty.ts) and [`/Users/aki/Projects/io/packages/core/src/nodes/ReactiveNode.ts`](/Users/aki/Projects/io/packages/core/src/nodes/ReactiveNode.ts) to `Binding<unknown>` where property value type is heterogeneous.
5. Update direct call-site props:
   - `IoSpanProps.value` to `WithBinding<string>` (or `string | Binding<string>`) in [`/Users/aki/Projects/io/packages/core/src/elements/IoSpan.ts`](/Users/aki/Projects/io/packages/core/src/elements/IoSpan.ts)
   - `StorageNode.binding` / `Storage` return typing in [`/Users/aki/Projects/io/packages/core/src/nodes/Storage.ts`](/Users/aki/Projects/io/packages/core/src/nodes/Storage.ts).
6. Run targeted type-check/tests for `core` and adjust only necessary casts at call sites that currently rely on untyped binding flows.

## Validation
- Verify typed inference examples compile:
  - `ThemeSingleton.bind('fontSize')` -> `Binding<number>`
  - `ThemeSingleton.bind('borderColor')` -> `Binding<Color>`
  - `this.bind('selected')` in element demos resolves to the declared property type.
- Run `pnpm test:core` and fix any typing-driven fallout in existing tests.

## Unresolved Questions
- None at this stage.