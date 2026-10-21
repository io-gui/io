---
source: webgl_materials_normalmap_object_space
synced: d94661f706
tags: [camera-in-scene]
---

# MaterialsNormalmapObjectSpace

[`webgl_materials_normalmap_object_space`](https://threejs.org/examples/#webgl_materials_normalmap_object_space), converted 2026-10-14

## Deviations

None.

## History

- 2026-10-14: Converted, with the point light at the source camera's position. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
