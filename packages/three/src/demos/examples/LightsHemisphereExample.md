---
source: webgl_lights_hemisphere
synced: d94661f706
---

# LightsHemisphere

[`webgl_lights_hemisphere`](https://threejs.org/examples/#webgl_lights_hemisphere), converted 2026-10-17 (batch 3)

## Deviations

- **Sky:** the sky dome's `ShaderMaterial` is a background node with the same gradient, so the 4000-unit dome does not dominate framing.
- **Controls:** `hemisphereLight` and `directionalLight` are toggles for the source's toggle buttons.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
