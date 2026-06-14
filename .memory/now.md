# NOW - Current Focus

> Prune aggressively. Only what's relevant to current work stays here.

## Current Task
None — A1 node/element unification completed

## Key Context
- `ReactiveCore.ts`: shared internals init, `isReactiveOwner`/`isIoValue`, parent graph (`addParent`/`removeParent`/`detachChildParents`)
- IoElement now has `_parents`; both node and element property values wire parent graph
- ChangeQueue invokes `dispatchMutation` for all reactive owners (not just `_isNode`)

## Blockers / Open Questions
- None
