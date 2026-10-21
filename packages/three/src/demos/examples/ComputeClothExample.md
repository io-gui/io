---
source: webgpu_compute_cloth
synced: d94661f706
tags: [live, per-frame-gpu, timeline-time, stand-in-framing]
---

# ComputeCloth

[`webgpu_compute_cloth`](https://threejs.org/examples/#webgpu_compute_cloth), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** live ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)): 360 steps per second of the time played forward, at most 1/60 s per draw as in the source, so scrubbing back or a loop wrap does not rewind the cloth.
- **Sphere:** its path follows document time on a 20π s loop; the substeps of a draw move the collision sphere toward it.
- **Wind:** the noise runs on `timeline.timeNode`.

## Upstream

- `e4b7613962` (#35063) TSL: More usage of `EPSILON`. Ported.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#35063), already ported.
