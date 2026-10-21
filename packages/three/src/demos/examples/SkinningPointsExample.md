---
source: webgpu_skinning_points
synced: d94661f706
---

# SkinningPoints

[`webgpu_skinning_points`](https://threejs.org/examples/#webgpu_skinning_points), converted 2026-10-15 (batch 2)

## Deviations

- **Instances:** an `InstancedMesh` of quads with the model's bounds, for the source's `Sprite` with `count`, so framing and culling see the points.
- **Compute:** the passes in the points' `positionNode` are built once outside the views' draws (`buildComputes`); built inside a TRAA view's pass, the skinning would refer to `positionPrevious`, which compute shaders lack ([WebGPU notes](../ExamplesConversion.plan.md#webgpu-notes)).

## History

- 2026-10-15: Converted (batch 2), with the source's camera kept as a scene camera, since the model lies on the ground. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
