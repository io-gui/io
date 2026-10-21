---
source: webgpu_instance_points
synced: d94661f706
tags: [per-frame-gpu, timeline-time, stand-in-framing]
---

# InstancePoints

[`webgpu_instance_points`](https://threejs.org/examples/#webgpu_instance_points), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** a compute pass writes the point sizes from `timeline.timeNode` in `onBeforeDraw` on every call, so scrubbing shows them exactly; ten pulses per loop ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **`alphaToCoverage`:** shows only in views drawn with MSAA.
- **Dropped:** the inset view, the same camera on a dark background.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
