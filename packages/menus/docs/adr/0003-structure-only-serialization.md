# Structure-only serialization; selection is never in Option JSON

`Option.toJSON()`/`applyJSON()` carry structure only (`OptionData`: id, value, label, icon, hint, disabled, hidden, mode, nested options) — never `selected`, never `action`. Selection persists exclusively through the writable entry points (`selectedID`/`path` bindings, ADR 0001), so each concern keeps one persistence channel: JSON answers *what the menu is*, Path answers *where the user is*. Restore through the entry points also keeps selection flowing through scope enforcement (exclusivity, ancestor propagation) and stays stale-tolerant across menu restructuring, whereas raw `selected` booleans in JSON could inject invariant-violating state and are positional facts about a structure that may have changed. The clone path (`EditorConfig`: `new Menu({}).applyJSON(menu.toJSON())`) depends on this — each clone derives its own selection from its own bound value instead of inheriting another instance's navigation state.

Layout's `TabData` *does* serialize `selected`; that is not an inconsistency to fix. A layout JSON **is** a session snapshot — the selected tab is part of what "the workspace" means — while a Menu's JSON is a catalog/config. Shared mechanism (`applyJSON`, `*Data` wire types), different domain role for the field.

## Considered Options

- **Serialize `selected` per node (like `Tab.selected`)** — rejected: two persistence channels (JSON vs Path bindings) that can disagree on restore, and unguarded restore bypasses scope enforcement (already rejected in ADR 0001; this ADR records the fuller rationale).
- **Serialize `selected` for `toggle` mode only** — deferred: toggles have no scope invariants to violate, but they conventionally mirror app settings that own their own persistence via bindings.
- **Structure only (chosen)** — selection state is reconstructed through entry points or app bindings.

## Consequences

- `applyJSON` must not read `selected`; `OptionData` must not grow a `selected` field for select-mode nodes (pinned by test: injected `selected: true` in JSON is ignored).
- Authoring `OptionProps` remain a richer format than `OptionData` (initial `selected`, `action` functions) — the Props/Data type split makes this boundary explicit.
- Toggle-mode state has no menu-level persistence story; apps bind each toggle's `selected` to their own persisted property.

## Future consideration (revisit triggers)

Flagged for revisit if either case materializes:

1. **Self-contained snapshots** — saving a whole Menu including where the user was, without a separate storage binding. The right extension is *not* per-node `selected` flags but a `MenuData extends OptionData` adding tree-scoped fields (`path`, and arguably `expandedIDs`, which has the same runtime-state status today), restored **through the entry points** so guarding and stale tolerance are preserved. Tree-scoped state belongs on `Menu` (CONTEXT.md), so its serialization belongs there too.
2. **Toggle persistence pain** — if binding every toggle to an app property proves too burdensome, serializing `selected` for `mode: 'toggle'` only is defensible. Select-mode `selected` stays out of JSON regardless; that would reintroduce the dual-source-of-truth problem.
