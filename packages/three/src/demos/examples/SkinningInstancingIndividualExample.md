---
source: webgpu_skinning_instancing_individual
synced: d94661f706
tags: [per-frame-gpu, stand-in-framing]
---

# SkinningInstancingIndividual

[`webgpu_skinning_instancing_individual`](https://threejs.org/examples/#webgpu_skinning_instancing_individual), converted 2026-10-18 (batch 4)

## Deviations

- **Poses:** the thirty skeletons are posed from document time in `onAnimate`, so scrubbing shows them exactly; the compute pass that skins them runs in `onBeforeDraw` ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)). The timeline takes the clip's length.

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with its shadow camera.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
