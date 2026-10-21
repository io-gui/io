---
source: webgpu_compute_water
synced: d94661f706
tags: [live, per-frame-gpu, pointer-dropped]
---

# ComputeWater

[`webgpu_compute_water`](https://threejs.org/examples/#webgpu_compute_water), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** live ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)): source frames of the time played forward are counted per renderer, with a step every `7 - speed` of them, so scrubbing back or a loop wrap does not rewind the water or the ducks.
- **Pointer:** the ripples under the pointer and their `mouseSize` and `mouseDeep` controls are dropped; the waves are the initial noise settling.

## Upstream

- `b0ff5d0783` (#34813) WebGPURenderer: Throw an error if "count" and "dispatchSize" are used together. Ported: `computeKernel( [ 16, 16 ] )`.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34813), already ported.
