---
source: webgpu_materials_matcap
synced: d94661f706
---

# MaterialsMatcap

[`webgpu_materials_matcap`](https://threejs.org/examples/#webgpu_materials_matcap), converted 2026-10-15

## Deviations

- **Dropped:** loading a matcap by drag and drop; a document reads no DOM.
- **Controls:** the source's exposure control is the document's `toneMappingExposure`.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
