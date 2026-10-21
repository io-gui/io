---
source: webgpu_shadowmap_array
synced: d94661f706
---

# ShadowmapArray

[`webgpu_shadowmap_array`](https://threejs.org/examples/#webgpu_shadowmap_array), converted 2026-10-15 (batch 2)

## Deviations

- **Shadows:** the source's `BasicShadowMap` is a renderer setting; the shared renderer filters with PCF ([What fits](../ExamplesConversion.plan.md#what-fits)).
- **Dropped:** the tile helper; the light helpers overlay draws the light.

## Upstream

- `TileShadowNode` adds its tile lights next to the light, so the scene graph shows eight unnamed rows under `SunGroup`. Not triaged.

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
