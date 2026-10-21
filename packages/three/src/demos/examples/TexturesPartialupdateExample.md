---
source: webgpu_textures_partialupdate
synced: d94661f706
tags: [live, per-frame-gpu]
---

# TexturesPartialupdate

[`webgpu_textures_partialupdate`](https://threejs.org/examples/#webgpu_textures_partialupdate), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** live ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)): the copies run in `onBeforeDraw`, one patch per 0.1 s of time played forward (at most ten per draw), once the carbon texture has loaded, so the patches build up while playing and stay when scrubbing back or at a loop wrap.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
