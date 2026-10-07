---
status: accepted
---

# Redraw is a typed dirty tag consumed by one RenderScheduler

Only the `RenderScheduler` renders. It owns the shared `WebGPURenderer` (ADR-0001) and the only render rAF loop. Code that changes something calls `document.notify(change)` or `view.tag(reason)`. It never renders, and reactive `mutated()` / `[prop]Mutated()` handlers never trigger draws.

Each frame the scheduler runs fixed phases:

1. **Collect.** Drain the editor's change bus and tag every view whose `listens(change)` is true.
2. **Tick.** If playback is on, advance the clock once and run animation hooks.
3. **Evaluate.** Once per document, call `scene.updateMatrixWorld()` and later any derived-data step. Then turn off `matrixWorldAutoUpdate` while views draw.
4. **Draw.** Draw tagged, visible, non-empty views in priority order (focused, hovered, then the rest) within a frame budget. Views not reached stay tagged for the next frame.
5. **Settle.** Resolve pick readbacks. Keep `continuous` pipelines tagged until they report `converged`.

Dirty reasons are typed: `content`, `view`, `overlay`, `resize`, `continuous`. An `overlay`-only redraw can reuse the pipeline's cached colour and depth, which keeps hover highlights cheap in heavy scenes.

Before this, each viewport redrew on its own through io-gui `debounce` on any mutation, plus a bubbling `three-applet-needs-render` event every frame. That event reached every graph parent of the applet, inspectors included. There was no frame budget, no ordering across viewports, and N viewports traversed the scene graph N times per frame.

## Considered Options

- **Keep reactive mutation as the redraw trigger.** Rejected: it ties GPU work to io-gui's debounce tick and gives no place for budgets, priorities or progressive rendering.
- **Hook rendering into core `FrameScheduler`.** Rejected for now: core's queue runs arbitrary callbacks with no phases. The render loop is registered after core's, so reactive work queued for a frame is flushed before that frame draws.

## Consequences

- Two-way bindings and inspectors still use reactivity. Rendering only listens to the change bus.
- Once document transactions exist (ADR-0008), committed patches feed the change bus directly and `notify()` is only for edits outside the document.
- Plain Three.js edits made outside operators must call `notify()` or `tag()`, or nothing redraws. That is deliberate. In debug builds, a view that renders while untagged is an error.
