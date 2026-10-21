---
source: webgpu_compute_points
synced: d94661f706
tags: [live, per-frame-gpu, pointer-dropped, stand-in-framing]
---

# ComputePoints

[`webgpu_compute_points`](https://threejs.org/examples/#webgpu_compute_points), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** live ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)): the velocities scale by the source frames played (60 per second, at most 1/15 s per draw), so scrubbing back or a loop wrap does not rewind the particles.
- **Pointer:** the source resets particles at the pointer; dropped.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
