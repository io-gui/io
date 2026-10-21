---
source: webgl_buffergeometry_points
synced: d94661f706
---

# BuffergeometryPoints

[`webgl_buffergeometry_points`](https://threejs.org/examples/#webgl_buffergeometry_points), converted 2026-10-17 (batch 3)

## Deviations

- **Points:** WebGPU draws `Points` 1 px wide; a child `Sprite` named `Sprites` (`frustumCulled` off) draws a quad per point at the source's size. The `Points` stay for picking and framing ([WebGPU notes](../ExamplesConversion.plan.md#webgpu-notes)).

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
