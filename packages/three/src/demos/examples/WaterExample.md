---
source: webgpu_water
synced: d94661f706
---

# Water

[`webgpu_water`](https://threejs.org/examples/#webgpu_water), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** the flow derives from document time, a 5 s loop; `WaterNode` itself advances it by wall-clock delta per render, so its `updateBeforeType` is `NONE`.
- **Dropped:** the bloom of the emissive output and the FXAA pass.

## Open

- `document-pipeline`: the source's emissive bloom (an MRT output, beyond `Document.bloom`) and FXAA.

## Upstream

- `WaterNode.setup` adds a reflector target to the water each time it builds, once per view pipeline, so the water shows several unnamed children. Not triaged.

## History

- 2026-10-15: Converted (batch 2), with the source's camera kept as a scene camera. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), low over the deck and outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
