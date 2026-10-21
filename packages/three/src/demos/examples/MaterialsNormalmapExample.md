---
source: webgl_materials_normalmap
synced: d94661f706
---

# MaterialsNormalmap

[`webgl_materials_normalmap`](https://threejs.org/examples/#webgl_materials_normalmap), converted 2026-10-14

## Deviations

- **Dropped:** the bleach bypass, color correction and FXAA post passes.

## Open

- `document-pipeline`: the source's bleach bypass and color correction passes.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
