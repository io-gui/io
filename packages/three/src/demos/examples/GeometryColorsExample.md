---
source: webgl_geometry_colors
synced: d94661f706
tags: [pointer-dropped]
---

# GeometryColors

[`webgl_geometry_colors`](https://threejs.org/examples/#webgl_geometry_colors), converted 2026-10-10

## Deviations

- **Colors:** `Float32` vertex colors; 3 × `Float16` is no valid vertex stride in WebGPU ([WebGPU notes](../ExamplesConversion.plan.md#webgpu-notes)).
- **Camera:** the source's camera follows the pointer; the active camera rests where the pointer at the centre leaves it.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), resting where the pointer at the centre leaves it. Checked: the Scene Camera view against `examples/screenshots`.
