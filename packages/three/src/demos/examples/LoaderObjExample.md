---
source: webgl_loader_obj
synced: d94661f706
tags: [camera-in-scene]
---

# LoaderObj

[`webgl_loader_obj`](https://threejs.org/examples/#webgl_loader_obj), converted 2026-10-13

## Deviations

None.

## History

- 2026-10-13: Converted, with the light at the source camera's position. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
