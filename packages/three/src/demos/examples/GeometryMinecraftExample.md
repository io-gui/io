---
source: webgl_geometry_minecraft
synced: d94661f706
---

# GeometryMinecraft

[`webgl_geometry_minecraft`](https://threejs.org/examples/#webgl_geometry_minecraft), converted 2026-10-17 (batch 3)

## Deviations

- **Camera:** the first-person controls are dropped; the active camera stands where the source's starts, above the middle of the world.

## History

- 2026-10-17: Converted (batch 3), with the source's camera kept as a scene camera. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
