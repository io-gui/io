---
source: webgl_points_waves
synced: d94661f706
tags: [pointer-dropped, timeline-time]
---

# PointsWaves

[`webgl_points_waves`](https://threejs.org/examples/#webgl_points_waves), converted 2026-10-17 (batch 3)

## Deviations

- **Shader:** the source's GLSL point shader is a `PointsNodeMaterial` whose position and size come from `instanceIndex` and `timeline.timeNode` (a 10π/3 s loop), with round dots by alpha test, drawn as one `InstancedMesh` of quads with the grid's bounds.
- **Camera:** the source's camera follows the pointer; the active camera rests where the pointer at the centre leaves it.

## History

- 2026-10-17: Converted (batch 3), with the pointer camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), resting where the pointer at the centre leaves it. Checked: the Scene Camera view against `examples/screenshots`.
