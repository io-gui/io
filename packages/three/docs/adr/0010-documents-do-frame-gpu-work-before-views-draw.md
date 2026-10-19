---
status: accepted
---

# Documents do a frame's GPU work in `onBeforeDraw`, before views draw

Some content needs the renderer every frame, not only at setup: compute simulations (`renderer.compute`), dynamic reflections (`CubeCamera.update`), renders into targets that the scene samples (contact shadows, progressive light maps). `onRendererInitialized` runs once and `onAnimate` gets no renderer, and only the `RenderScheduler` renders (ADR-0003). So the scheduler runs `Document.onBeforeDraw(renderer, delta)` as a frame phase: after it evaluates the scenes and before it draws, once per document and renderer whose views are about to draw the document's changes (a view tagged `content`: the document changed, or the view draws it for the first time). Redraws that change only a view (navigation, resize, overlays) do not run it, so orbiting a paused simulation does no GPU work.

`delta` is the timeline time played forward since the hook last ran for that renderer: the sum of the positive changes of `currentTime`. GPU simulations are live content (ADR-0009). Scrubbing back and loop wraps add nothing, so they never rewind; pausing stops them; stepping a frame forward steps them. A change that is not time (a property edit) runs the hook with `delta` 0, which is when re-captures and re-bakes happen. Calling `notify()` from the hook runs it again next frame, for work that converges over frames.

## Considered Options

- **Pass the renderer to `onAnimate`.** Rejected: `onAnimate` runs on every timeline change, including scrubbing back, before the scene is evaluated, and once per document, while GPU state lives per renderer.
- **Run the hook from `renderView`, per view.** Rejected: N views would step a simulation N times a frame. CubeCamera captures would also repeat per view.
- **Run it every frame while the document is shown.** Rejected: a paused document would keep the GPU busy, and simulations would run on the wall clock instead of the timeline.
- **Re-simulate from the start when time goes back** (ADR-0009, Niagara's Desired Age). Rejected for the same reasons as for live documents, and GPU simulations are too costly to replay.

## Consequences

- Each renderer that draws a document keeps its own GPU state (buffers, targets), so each steps its own copy of a simulation. Views of one renderer share it.
- `delta` is large after scrubbing forward or after the document was hidden while playing: content clamps or substeps it.
- The hook runs while scene world matrices are frozen (ADR-0003, evaluate). Objects move in `onAnimate`; the hook only renders and computes, and leaves the renderer's target as it found it.
- Views that wait past the frame budget keep their `content` tag, so the hook can run again the next frame with `delta` 0.
- A property handler that needs GPU work (rebake an environment, regenerate a sky) marks it and notifies; the hook does it. This also serves `renderer-on-change`.
