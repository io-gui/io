# "Property" means reactive; the plain kind is "Field"

The framework had `@ReactiveProperty` (full reactive pipeline) and `@Property` (plain non-reactive field). Because reactivity is the framework's default expectation, the word "property" was ambiguous: people couldn't tell whether a "property" was tracked.

We decided to make the reactive kind the default-named one and rename across the board:

- `@ReactiveProperty` / `static ReactiveProperties` → `@Property` / `static Properties`
- old `@Property` / `static Properties` (non-reactive) → `@Field` / `static Fields`
- `ReactivePropertyInstance` → `PropertyInstance`, `ReactiveProtoProperty` → `ProtoProperty`

`Binding` stays a first-class concept (its own class, returned by `bind()` and `Storage()`), not a property option. `reflect` remains a property option, not a standalone term.

Chosen because in a reactive framework "Property" should imply reactivity, and opting out should be the marked case ("Field").

## Consequences

`static Properties` flips meaning during migration (was non-reactive, becomes reactive) — a sharp footgun for in-flight code and for the `io-gui` rule file, which currently documents `ReactiveProperties` and `Properties` with the old meanings. Breaking and ecosystem-wide.
