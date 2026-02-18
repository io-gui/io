# Archive - Complete Memory Log

> Commit aggressively. This log serves as proxy for memory access frequency.
> Later analysis of patterns here informs working memory pruning.

## Log Format

```
## YYYY-MM-DD
### [category] Title
Content...
```

---

## 2026-02-02

### [meta] Memory system initialized

Created three-tier memory architecture for io-gui development:

- `now.md` - hot context, aggressive pruning, current focus only
- `working.md` - persistent curated memory
- `archive.md` - complete log for access pattern analysis

### [meta] Memory strategy derived from Moltbook experiments

Key patterns adapted from agent memory research (Moltbook Memory Canon):

- Three-tier architecture (hot/curated/archive)
- Aggressive pruning of hot context
- Archive as proxy for access frequency analysis
- "Memory without structure becomes noise"
- Write immediately, don't rely on mental notes
- Checkpoint decisions (reasoning), not just state (conclusions)

### [architecture] Considered but rejected: tiered storage in io-gui runtime

Initially confused project memory with framework runtime patterns.
StorageNode handles runtime persistence (localStorage/hash).
Memory architecture is for development context, not app state.

### [meta] Memory commit guidelines clarified

- Archive: extremely aggressive, after every response, never ask permission
- Now: aggressive, updated frequently, pruned often
- Working: conservative, only what feels important and persistent
- Archive never loaded into context unless explicitly asked
- Working memory pruning based on archive patterns is future work

### [meta] Created io-gui memory system

memory patterns to io-gui development context.
Three files: now.md, working.md, archive.md
Added to .gitignore (can be tracked later if desired)

## 2026-02-07

### [pattern] Io events: bubbling + Listeners, not listener wrangling

User refactored Game event consumer code: use `dispatch(..., true)` from source node; consumers declare `static get Listeners()` mapping event names to handler methods. Avoid manual addEventListener in ready(), \_gameForListeners, \_wireGameCallbacks, and add/remove when game instance changes. Promoted to working memory.

## 2026-02-14

### [fix] Core synthetic bubbling dedupe for shared ancestors

Patched `packages/core/src/core/EventDispatcher.ts` to prevent duplicate event delivery when one bubbling dispatch reaches the same ancestor through multiple parent branches (diamond graph / cross-tree links). Added a per-dispatch `visited` set in `dispatchEvent()` and skipped recursion to parents already visited. Added regression test in `packages/core/src/core/EventDispatcher.test.ts` that asserts a shared root only receives one bubbling event hit.

### [fix] Core dedupe for synthetic+DOM overlap on EventTarget boundary

Extended `EventDispatcher` dedupe so a synthetic dispatch converted to native `CustomEvent` on an `IoElement` does not re-hit ancestors already reached via the synthetic graph in the same dispatch. Added `hasVisitedDomAncestor()` and set native event `bubbles` to false when a visited DOM ancestor exists. Added regression test covering overlap case (`ReactiveNode` bubbling via direct parent + child `IoElement` DOM bubble) to ensure one delivery.
