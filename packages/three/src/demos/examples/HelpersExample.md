---
source: webgl_helpers
synced: d94661f706
tags: [moving-camera]
---

# Helpers

[`webgl_helpers`](https://threejs.org/examples/#webgl_helpers), converted 2026-10-17 (batch 3)

## Deviations

- **Helpers:** the vertex normal and tangent, box, grid and polar grid helpers are content in an unselectable `Helpers` group, toggled by `showHelpers`; the point light's helper comes from the light helpers overlay.
- **Time:** the light and the active camera circle the head with document time on a 200π/3 s loop, the camera ten turns per loop.

## History

- 2026-10-17: Converted (batch 3), with the orbiting camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), circling the head with document time as the source's does. Checked: the Scene Camera view against `examples/screenshots`.
