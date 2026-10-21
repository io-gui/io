---
source: webgl_loader_amf
synced: d94661f706
tags: [camera-in-scene]
---

# LoaderAmf

[`webgl_loader_amf`](https://threejs.org/examples/#webgl_loader_amf), converted 2026-10-13

## Deviations

- **Up axis:** the file is Z-up like the source's camera; here the rook turns upright for the Y-up views, and the active camera with the light on it turns with it, (x, y, z) to (x, z, -y).

## History

- 2026-10-13: Converted, with the camera light at the turned camera position. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), turned like the model and in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
