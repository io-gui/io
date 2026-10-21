---
source: webgpu_materials_alphahash
synced: d94661f706
---

# MaterialsAlphahash

[`webgpu_materials_alphahash`](https://threejs.org/examples/#webgpu_materials_alphahash), converted 2026-10-15

## Deviations

- **Dropped:** the SSAA pass and its `sampleLevel`, which smooth the hash noise; the TRAA views converge it instead. The source's `?amount` query is dropped too (3).

## Open

- `document-pipeline`: the source's SSAA pass.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
