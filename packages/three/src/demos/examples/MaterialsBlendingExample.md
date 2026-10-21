---
source: webgl_materials_blending
synced: d94661f706
---

# MaterialsBlending

[`webgl_materials_blending`](https://threejs.org/examples/#webgl_materials_blending), converted 2026-10-14

## Deviations

- **Time:** the background scrolls with document time on a 12.5 s loop.
- **`NoBlending`:** the alpha flare row draws the texture's raw color, where WebGL draws it premultiplied (black) ([WebGPU notes](../ExamplesConversion.plan.md#webgpu-notes)).

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
