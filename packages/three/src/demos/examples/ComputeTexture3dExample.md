---
source: webgpu_compute_texture_3d
synced: d94661f706
tags: [per-frame-gpu, timeline-time, loop-jump, stand-in-framing]
---

# ComputeTexture3d

[`webgpu_compute_texture_3d`](https://threejs.org/examples/#webgpu_compute_texture_3d), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** the noise scrolls with `timeline.timeNode` and is computed in `onBeforeDraw` on every call, so scrubbing shows it exactly ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)). It does not repeat, so the loop jumps at the wrap.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back). The source's camera, inside the cloud's box, was kept as a scene camera.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
