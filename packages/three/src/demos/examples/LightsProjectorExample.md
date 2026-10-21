---
source: webgpu_lights_projector
synced: d94661f706
tags: [loop-jump, timeline-time]
---

# LightsProjector

[`webgpu_lights_projector`](https://threejs.org/examples/#webgpu_lights_projector), converted 2026-10-15

## Deviations

- **Time:** the caustics run on `timeline.timeNode` in a 6π s loop and jump at the wrap.
- **`shadows`:** turns the light's shadow off; the source switches the renderer's shadow map, which the editor shares.
- **Dropped:** the `video` projection; a document reads no DOM.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
