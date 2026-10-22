---
source: webgpu_instance_points
synced: d94661f706
tags: [per-frame-gpu, timeline-time, stand-in-framing]
---

# InstancePoints

[`webgpu_instance_points`](https://threejs.org/examples/#webgpu_instance_points), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** a compute pass writes the point sizes from `timeline.timeNode` in `onBeforeDraw` on every call, so scrubbing shows them exactly; ten pulses per loop ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Points:** an `alphaTest` of 0.5 cuts the circles in views without MSAA (the default), where `alphaToCoverage` does not; `alphaToCoverage` smooths them only in views with MSAA.
- **Dropped:** the inset view, the same camera on a dark background.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Fixed: the points' corners showed black in views without MSAA, every view by default: `alphaToCoverage` kept them, with zero alpha, through which the page behind the canvas shows. An `alphaTest` of 0.5 discards them, as in three's `webgpu_skinning_points`. Checked headlessly on the linked r187dev build `d94661f706`: no corners in the Perspective, Front and Camera views, with and without MSAA, and the circles' edges in MSAA views as before.
