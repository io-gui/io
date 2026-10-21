---
source: webgpu_compute_particles
synced: d94661f706
tags: [live, per-frame-gpu, pointer-dropped, stand-in-framing]
---

# ComputeParticles

[`webgpu_compute_particles`](https://threejs.org/examples/#webgpu_compute_particles), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** live ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)): one compute step per source frame (60 per second) of the time played forward, so scrubbing back or a loop wrap does not rewind the particles.
- **Pointer:** the source pushes the particles away from the pointer; here the `hit` button pushes them away from the middle of the grid.
- **`alphaToCoverage`:** rounds the sprites only in views drawn with MSAA.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
