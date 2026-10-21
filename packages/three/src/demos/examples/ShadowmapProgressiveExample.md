---
source: webgpu_shadowmap_progressive
synced: d94661f706
tags: [per-frame-gpu, pointer-dropped]
---

# ShadowmapProgressive

[`webgpu_shadowmap_progressive`](https://threejs.org/examples/#webgpu_shadowmap_progressive), converted 2026-10-18 (batch 4)

## Deviations

- **Accumulation:** runs in `onBeforeDraw` for two blend windows after any change, then stops; the source accumulates every frame ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Tools:** `Light Origin` and the model move with the editor's tools, for the source's `TransformControls`; moving either restarts the accumulation.
- **Renderers:** the light map is bound to the first renderer.
- **Helpers:** none; the lights live in the light map's own scene, as in the source.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
