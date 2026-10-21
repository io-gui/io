---
source: webgpu_compute_birds
synced: d94661f706
tags: [live, per-frame-gpu, pointer-dropped]
---

# ComputeBirds

[`webgpu_compute_birds`](https://threejs.org/examples/#webgpu_compute_birds), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** live ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)): the compute passes step in `onBeforeDraw` by the time played forward, capped at 1 s as in the source, so scrubbing back or a loop wrap does not rewind the flock.
- **Pointer:** the ray that scatters the birds is parked far from the flock.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
