---
source: webgl_loader_gltf_instancing
synced: d94661f706
---

# LoaderGltfInstancing

[`webgl_loader_gltf_instancing`](https://threejs.org/examples/#webgl_loader_gltf_instancing), converted 2026-10-14

## Deviations

- **Loading:** the environment and the model load together; the source loads the model after the environment.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
