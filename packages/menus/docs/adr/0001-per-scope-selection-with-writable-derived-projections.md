# Per-scope selection with writable derived projections

A menu tree mixes actions, toggles, and radio clusters under the same parent, so selection exclusivity cannot be a parent-wide flag or a single Menu-owned path. We decided: `Option.selected` within each **selection scope** (the `select`-mode children of one parent) is the only source of truth; `path` and `selectedID` on the Menu are *derived* projections that nevertheless stay **writable**, because they are the entry points for persistence and routing (hash/localStorage bindings) — writing a Path performs a stale-tolerant restore (deepest surviving Id wins). A scope's immediate selection is not stored at all — it is derived on demand via `Option.getSelectedIDImmediate()`, so bindings exist only for the writable entry points. Serialized Menu JSON is **structure only**; selection persists exclusively through the Path/`selectedID` bindings, so each concern has one persistence channel.

## Considered Options

- **Menu owns the selected path as source of truth** — rejected: cannot represent radio clusters under `none`-mode branches (menu-bar case).
- **Parent-declared exclusive groups (radiogroup-style)** — rejected: forces an extra Group node kind into mixed menus.
- **Persist selection inside Menu JSON (Layout does this for `Tab.selected`)** — rejected: selection would then have two persistence channels (JSON and Path bindings) that can disagree on restore.

## Consequences

- Ids must be unique per Menu and may not contain a comma (Path separator); both debug-enforced.
- Writable-but-derived properties look unusual; this is deliberate, not a sync bug to "fix" into read-only.
- Menu JSON round-trips drop selection by design (`fromJSON` must not read `selected`); authoring Props remain a richer format than JSON (initial `selected`, `action` functions).
