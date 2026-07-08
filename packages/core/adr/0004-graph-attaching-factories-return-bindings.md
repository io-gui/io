# Graph-attaching factories return a Binding, not their node

`Storage(props)` is named like it would return a storage object, but it returns a `Binding`. Internally it creates (or reuses) a singleton `StorageNode` for the `key`+backend and hands back a `Binding` to that node's value. The `$`-prefixed exports (`$Theme`, `$ThemeID`) follow the same shape.

We decided this is the intended convention: a factory that needs to attach persistent/shared state to the reactive graph returns a graph-ready `Binding` carrying its node, so callers can assign it straight onto a node property to wire two-way sync. Returning the node instead would force every caller to call `bind()` themselves and would expose the node's identity when only the value handle is wanted.

Chosen over returning the `StorageNode` because the binding is the useful unit at the call site, and the node is an implementation detail kept alive by the binding.

## Consequences

The name `Storage` reads like a noun but behaves like "bind to storage"; this surprises first-time readers and must be documented. The pattern generalizes to any future graph-attaching factory.
