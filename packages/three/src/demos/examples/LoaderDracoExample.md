---
source: webgl_loader_draco
synced: d94661f706
---

# LoaderDraco

[`webgl_loader_draco`](https://threejs.org/examples/#webgl_loader_draco), converted 2026-10-13

## Deviations

- **Camera:** the active camera stands where the source's orbit starts.

## History

- 2026-10-13: Converted, with the orbiting camera dropped. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its orbit starts. Checked: the Scene Camera view against `examples/screenshots`.
