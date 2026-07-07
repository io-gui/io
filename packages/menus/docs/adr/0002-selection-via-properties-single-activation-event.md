# Selection via properties, a single activation event

Menus exposes no selection events. Apps observe selection reactively — by binding `selectedID`/`path` (and `expandedIDs` for tree disclosure) — because selection *is* state and Core's bindings are the idiomatic channel for state. Exactly one synthetic event remains public: `io-option-clicked`, dispatched on Activation. It exists because a `mode: 'none'` activation changes no model state by design, so it is invisible to properties — yet composing contexts need it (`IoNavigatorDrawer` collapses on menu clicks). Chrome geometry events (e.g. tree resize) are element-internal, not domain API. `value-input` on `IoOptionSelect` follows the inputs-package convention and is out of scope here.

## Considered Options

- **Three public events, uniformly `io-`-prefixed** (`option-selected-changed`, `option-selected`, click) — rejected: two easily-confused selection events, and scope-enforcement traffic exposed as app API.
- **Strict properties-only, zero events** — rejected: none-mode activations would be unobservable to composing elements; pushing `action`-callback wrapping onto every consumer was judged worse than one event.
- **Activation as a `lastActivated` property** — rejected: an event dressed as state (same-value re-activation needs artificial nudging).

## Consequences

- The old `option-selected` / `option-selected-changed` bubbling becomes internal machinery (or disappears once selection scopes enforce exclusivity directly).
- Anything an app wants to *react to* must either be reachable as bound state or be an Activation; new public events need a reason of the same strength as the none-mode case.
