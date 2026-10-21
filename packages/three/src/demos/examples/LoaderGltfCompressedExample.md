---
source: webgpu_loader_gltf_compressed
synced: d94661f706
tags: [camera-in-scene]
---

# LoaderGltfCompressed

[`webgpu_loader_gltf_compressed`](https://threejs.org/examples/#webgpu_loader_gltf_compressed), converted 2026-10-15 (batch 2)

## Deviations

- **Loading:** the file loads in `onRendererInitialized`, once `detectSupport` has picked the texture format ([Map](../ExamplesConversion.plan.md#map)).
- **Camera:** the active camera, which carries the light as in the source, is in the scene.

## History

- 2026-10-15: Converted (batch 2), with the light at the source camera's position. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
