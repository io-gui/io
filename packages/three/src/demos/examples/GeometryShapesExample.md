---
source: webgl_geometry_shapes
synced: d94661f706
tags: [pointer-dropped, camera-in-scene]
---

# GeometryShapes

[`webgl_geometry_shapes`](https://threejs.org/examples/#webgl_geometry_shapes), converted 2026-10-17 (batch 3)

## Deviations

- **Points:** WebGPU draws `Points` 1 px wide; each point set has a child `Sprite` that draws its dots at the source's size.
- **Pointer:** the drag that turned the group is dropped.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors. The light stood at the source camera's position.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
