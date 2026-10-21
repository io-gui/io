---
source: webgpu_lensflares
synced: d94661f706
tags: [verify-per-view]
---

# Lensflares

[`webgpu_lensflares`](https://threejs.org/examples/#webgpu_lensflares), converted 2026-10-15 (batch 2)

## Deviations

- **Boxes:** one `InstancedMesh` for the source's 3000 meshes.
- **Flares:** each view draws them in screen space at its own size, hidden where the boxes occlude the lights.
- **Camera:** the fly controls are dropped; the active camera stands where the source's starts, inside the field.

## History

- 2026-10-15: Converted (batch 2), with the source's camera kept as a scene camera, since whole-scene framing sees the 16000-unit field from outside. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
