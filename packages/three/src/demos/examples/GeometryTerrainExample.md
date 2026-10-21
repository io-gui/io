---
source: webgl_geometry_terrain
synced: d94661f706
tags: [stand-in-framing]
---

# GeometryTerrain

[`webgl_geometry_terrain`](https://threejs.org/examples/#webgl_geometry_terrain), converted 2026-10-17 (batch 3)

## Deviations

- **Camera:** the first-person controls are dropped; the active camera stands where the source's starts.
- **Noise:** the seeded replacement for `Math.random` stays local; the source replaces it globally.

## History

- 2026-10-17: Converted (batch 3), with the source's camera kept as a scene camera and views framing a stand-in ahead of it (whole-scene framing stands beyond the fog). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
