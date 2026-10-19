---
status: accepted
---

# Redraw is a typed dirty tag consumed by one RenderScheduler

Only the `RenderScheduler` renders. It owns the shared `WebGPURenderer` (ADR-0001) and the only render rAF loop. Code that changes something calls `document.notify(change)` or `view.tag(reason)`. It never renders, and reactive `mutated()` / `[prop]Mutated()` handlers never trigger draws.

Each frame the scheduler runs fixed phases:

1. **Tick.** If playback is on, advance the active document's timeline once; the document runs its animation hook on the change.
2. **Collect.** Drain the changes queued on each shown document and tag every view whose `listens(change)` is true. Ticking first lets this frame draw what the tick changed. `listens()` only answers; it does not change view setup. Then hand the drained changes to the document's change listeners: UI that follows a document without drawing it, such as the scene graph.
3. **Evaluate.** Once per document, call `scene.updateMatrixWorld()` and later any derived-data step. Then turn off `matrixWorldAutoUpdate` while views draw.
4. **Prepare.** Once per document and renderer whose views are about to draw the document's changes (tagged `content`), run the document's `onBeforeDraw`: the frame's GPU work, such as compute passes and cube camera captures (ADR-0010).
5. **Draw.** Draw tagged, visible, non-empty views in priority order (focused, hovered, then the rest) within a frame budget. Views not reached stay tagged for the next frame, and each frame they wait raises their priority by one, so a slow focused view cannot starve the rest.
6. **Settle.** Keep `continuous` pipelines tagged until they report `converged`.

Picks are not part of the frame: they run from input handlers between frames, so pickers update the scene's world matrices first and never see positions from before the latest edit.

Dirty reasons are typed: `content`, `view`, `overlay`, `resize`, `continuous`. An `overlay`-only redraw can reuse the pipeline's cached colour and depth, which keeps hover highlights cheap in heavy scenes.

Before this, each viewport redrew on its own through io-gui `debounce` on any mutation, plus a bubbling `three-applet-needs-render` event every frame. That event reached every graph parent of the applet, inspectors included. There was no frame budget, no ordering across viewports, and N viewports traversed the scene graph N times per frame.

## Considered Options

- **Keep reactive mutation as the redraw trigger.** Rejected: it ties GPU work to io-gui's debounce tick and gives no place for budgets, priorities or progressive rendering.
- **Hook rendering into core `FrameScheduler`.** Rejected for now: core's queue runs arbitrary callbacks with no phases. The render loop is registered after core's, so reactive work queued for a frame is flushed before that frame draws.

## Consequences

- Two-way bindings and inspectors still use reactivity. Rendering only listens to document changes.
- Once document transactions exist (ADR-0008), committed patches queue document changes directly and `notify()` is only for edits outside the document.
- Plain Three.js edits made outside operators must call `notify()` or `tag()`, or nothing redraws. That is deliberate. Only the scheduler calls `renderView`, and only for tagged views.
