# NOW - Current Focus

> Prune aggressively. Only what's relevant to current work stays here.

## Current Task
Completed packaging-builds (D3, D4)

## Key Context
- Package exports now point to dist; sideEffects narrowed to elements/nodes/configs
- Root build uses `tsc -b` with composite project references; clean also removes tsbuildinfo
- Package builds use `tsc -b` without clean; `build:watch` at root for incremental dev
- markdown/three publish bundles externalize marked/dompurify and three respectively

## Blockers / Open Questions
- None
