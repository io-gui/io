---
source: webgpu_materials_lightmap
synced: d94661f706
---

# MaterialsLightmap

[`webgpu_materials_lightmap`](https://threejs.org/examples/#webgpu_materials_lightmap), converted 2026-10-13

## Deviations

None.

## History

- 2026-10-13: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors. Fixed: zooming in cut off the 8000-unit sky dome (`dolly-far`: the perspective far plane now moves with the eye).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
