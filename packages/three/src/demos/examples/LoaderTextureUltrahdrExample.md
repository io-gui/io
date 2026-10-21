---
source: webgl_loader_texture_ultrahdr
synced: d94661f706
---

# LoaderTextureUltrahdr

[`webgl_loader_texture_ultrahdr`](https://threejs.org/examples/#webgl_loader_texture_ultrahdr), converted 2026-10-14

## Deviations

- **Time:** while `autoRotate` is on, the knot turns once per 20 s loop of document time; it holds its angle when off.
- **Controls:** the source's exposure control is the document's `toneMappingExposure`.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
