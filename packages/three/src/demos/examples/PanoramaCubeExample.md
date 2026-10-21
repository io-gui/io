---
source: webgl_panorama_cube
synced: d94661f706
---

# PanoramaCube

[`webgl_panorama_cube`](https://threejs.org/examples/#webgl_panorama_cube), converted 2026-10-14

## Deviations

None. The panorama shows through the active camera at the box's center; other views see the box from outside.

## History

- 2026-10-14: Converted, with the source's camera kept as a scene camera, since the panorama shows only from inside the box. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
