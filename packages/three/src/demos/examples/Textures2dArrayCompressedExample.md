---
source: webgpu_textures_2d-array_compressed
synced: d94661f706
---

# Textures2dArrayCompressed

[`webgpu_textures_2d-array_compressed`](https://threejs.org/examples/#webgpu_textures_2d-array_compressed), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** the layer steps with document time, ten sweeps per 5 s loop.
- **Loading:** the texture loads in `onRendererInitialized`, once `detectSupport` has picked a format; the plane joins then ([Map](../ExamplesConversion.plan.md#map)).

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
