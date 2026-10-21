---
source: webgpu_tsl_wood
synced: d94661f706
---

# TslWood

[`webgpu_tsl_wood`](https://threejs.org/examples/#webgpu_tsl_wood), converted 2026-10-15

## Deviations

- **Loading:** the blocks are built at once; the source adds them one per task to keep the page responsive.
- **Controls:** the custom wood's parameters are the `custom` record, a slider per parameter.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
