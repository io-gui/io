# NOW - Current Focus

> Prune aggressively. Only what's relevant to current work stays here.

## Current Task
Style mixin polyfill tests added in `packages/core/src/core/Style.test.ts`

## Key Context
- Extracted `processElementStyle()` from `applyElementStyleToDocument()` for testability
- Mixin `--name` declarations become `.name` class rules; `@apply --name` inlines mixin body
- Global `mixinRecord` shares mixins across subsequent style processing calls
- Removed stray `console.log` from mixin apply loop

## Blockers / Open Questions
- None
