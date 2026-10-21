---
source: webgl_lod
synced: d94661f706
tags: [verify-per-view]
---

# Lod

[`webgl_lod`](https://threejs.org/examples/#webgl_lod), converted 2026-10-17 (batch 3)

## Deviations

- **Levels:** each view picks the levels for its own camera.
- **Camera:** the fly controls are dropped; the active camera stands at the source's start, inside the field.

## History

- 2026-10-17: Converted (batch 3), with the source's camera kept as a scene camera, since whole-scene framing sees the field from outside at low levels. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
