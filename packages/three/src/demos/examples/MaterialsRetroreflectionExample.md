---
source: webgpu_materials_retroreflection
synced: d94661f706
tags: [camera-in-scene]
---

# MaterialsRetroreflection

[`webgpu_materials_retroreflection`](https://threejs.org/examples/#webgpu_materials_retroreflection), converted 2026-10-15 (batch 2)

## Deviations

- **Lights:** the flashlight rides the active camera, in the scene as in the source; the light mirrored below the ground stays where the camera starts, where the source moves it with its orbiting camera. Look through the active camera to see the bands light up.
- **Bloom:** the source's bloom is the document's `bloom`, drawn by views that follow it (the Scene Camera view in the demo host).

## History

- 2026-10-15: Converted (batch 2) with the bloom dropped as cosmetic post, and the source's camera kept as a scene camera carrying the flashlight. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-16: Changed: the source's bloom is back as `Document.bloom`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene as in the source. Checked: the Scene Camera view against `examples/screenshots`.
