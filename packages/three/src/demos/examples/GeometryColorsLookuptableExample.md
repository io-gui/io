---
source: webgl_geometry_colors_lookuptable
synced: d94661f706
tags: [camera-in-scene]
---

# GeometryColorsLookuptable

[`webgl_geometry_colors_lookuptable`](https://threejs.org/examples/#webgl_geometry_colors_lookuptable), converted 2026-10-17 (batch 3)

## Deviations

- **Legend:** the source draws the color scale in a second, orthographic scene over the view; here it is a `Legend` sprite beside the model, painted on an `OffscreenCanvas`.
- **Camera:** the active camera, which carries the light as in the source, is in the scene.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors. The light stood at the source camera's position.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
