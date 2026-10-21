---
source: webgpu_materials_displacementmap
synced: d94661f706
tags: [camera-in-scene]
---

# MaterialsDisplacementmap

[`webgpu_materials_displacementmap`](https://threejs.org/examples/#webgpu_materials_displacementmap), converted 2026-10-15

## Deviations

- **Camera:** the source's orthographic camera is the active camera, in the scene with its pink light on it, as in the source.

## Workarounds

- `triage-cube-envmap-loading`: the head is added once its cube map has loaded too; a loading cube map as a standard material's `envMap` fails WebGPU validation. **Restore:** add the head when the model loads.

## History

- 2026-10-15: Converted with the workaround, the orthographic camera dropped and its light at the camera's position. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's orthographic camera is the active camera (ADR-0011), in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
