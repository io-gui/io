---
source: webgl_materials_modified
synced: d94661f706
tags: [timeline-time]
---

# MaterialsModified

[`webgl_materials_modified`](https://threejs.org/examples/#webgl_materials_modified), converted 2026-10-15 (batch 2)

## Deviations

- **Shader:** the source patches the shader with `onBeforeCompile`; here a TSL `positionNode` twists the positions and a `normalNode` the normals of a `MeshNormalNodeMaterial`.
- **Time:** the twist waves on `timeline.timeNode`, a 2π s loop.

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
