---
source: webgl_geometries
synced: d94661f706
tags: [camera-in-scene]
---

# Geometries

[`webgl_geometries`](https://threejs.org/examples/#webgl_geometries), converted 2026-10-10

## Deviations

- **Time:** the objects spin at 0.63 and 0.31 rad/s from document time, whole turns per 20 s loop; the source's wall clock gives 0.5 and 0.25.
- **Camera:** the active camera, with the point light on it, stands where the source's orbit starts.
- **`wireframe`:** an io addition.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless). The point light stood fixed above, since the orbiting camera was dropped.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the point light on it again, standing where its orbit starts. Checked: the Scene Camera view against `examples/screenshots`.
