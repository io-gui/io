---
source: webgl_loader_gltf_variants
synced: d94661f706
---

# LoaderGltfVariants

[`webgl_loader_gltf_variants`](https://threejs.org/examples/#webgl_loader_gltf_variants), converted 2026-10-14

## Deviations

- **Controls:** the `variant` names (`midnight`, `beach`, `street`) are listed before the model loads, since editor configs are per class; the source reads them from the file.
- **Loading:** the environment and the model load together; the source loads the model after the environment.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused (variants), the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
