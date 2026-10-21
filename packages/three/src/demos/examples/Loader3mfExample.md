---
source: webgl_loader_3mf
synced: d94661f706
tags: [camera-in-scene]
---

# Loader3mf

[`webgl_loader_3mf`](https://threejs.org/examples/#webgl_loader_3mf), converted 2026-10-14

## Deviations

- **Up axis:** 3MF files are Z-up. The source turns its camera's up axis to z; here the model turns upright (-90° about x) for the Y-up views, and the light and the active camera with it, (x, y, z) to (x, z, -y).

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene as in the source and turned like the model. Checked: the Scene Camera view against `examples/screenshots`.
