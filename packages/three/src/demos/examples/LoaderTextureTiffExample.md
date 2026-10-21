---
source: webgl_loader_texture_tiff
synced: d94661f706
---

# LoaderTextureTiff

[`webgl_loader_texture_tiff`](https://threejs.org/examples/#webgl_loader_texture_tiff), converted 2026-10-14

## Deviations

- **Loading:** the planes are added at once and textured as each file loads.
- **Background:** none; the source clears to black.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
