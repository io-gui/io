---
source: webgl_geometry_extrude_splines
synced: d94661f706
tags: [moving-camera]
---

# GeometryExtrudeSplines

[`webgl_geometry_extrude_splines`](https://threejs.org/examples/#webgl_geometry_extrude_splines), converted 2026-10-17 (batch 3)

## Deviations

- **Camera:** `animationView` makes the `SplineCamera`, riding the tube once per 20 s loop, the active camera instead of the source's overview. Its helper comes from the camera helpers overlay; the source's `cameraHelper` toggle and eye sphere are dropped.

## History

- 2026-10-17: Converted (batch 3), with the `SplineCamera` as a scene camera to look through. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), and `animationView` is back, switching it to the `SplineCamera`. Checked: the Scene Camera view against `examples/screenshots`.
