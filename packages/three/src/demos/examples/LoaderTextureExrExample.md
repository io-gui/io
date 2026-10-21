---
source: webgl_loader_texture_exr
synced: d94661f706
---

# LoaderTextureExr

[`webgl_loader_texture_exr`](https://threejs.org/examples/#webgl_loader_texture_exr), converted 2026-10-14

## Deviations

- **Controls:** the source's exposure control is the document's `toneMappingExposure`.

## History

- 2026-10-14: Converted, with the orthographic camera dropped. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's orthographic camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
