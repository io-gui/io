# NOW - Current Focus

> Prune aggressively. Only what's relevant to current work stays here.

## Current Task
Completed A4 leak/cleanup fixes (leak-fixes todo)

## Key Context
- `_children` inverse index on ReactiveNode/IoElement; dispose detaches via `detachChildParents`
- `clearNodeQueue` clears throttle/queue WeakMap entries on dispose
- VDOM: `clearNativeElementChildren` / `releaseSubtreeEventDispatchers` for orphaned native EventDispatchers
- Menus/colors: disconnect mid-gesture listener cleanup in IoContextMenu, IoColorPicker, IoMenuOptions

## Blockers / Open Questions
- None
