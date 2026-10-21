---
source: webgpu_pmrem_scene
synced: d94661f706
---

# PmremScene

[`webgpu_pmrem_scene`](https://threejs.org/examples/#webgpu_pmrem_scene), converted 2026-10-15

## Deviations

- **Capture:** the PMREM of the scene is generated once, with the first renderer, in `onRendererInitialized` after the background has loaded; the center sphere appears then.
- **Dropped:** the `forceWebGL` option.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
