---
source: webgpu_skinning_instancing
synced: d94661f706
tags: [timeline-time, loop-jump, camera-in-scene]
---

# SkinningInstancing

[`webgpu_skinning_instancing`](https://threejs.org/examples/#webgpu_skinning_instancing), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** each instance's color and metalness oscillate on `timeline.timeNode`; the timeline takes the clip's length, so they jump at the wrap.
- **Dropped:** the depth-of-field blur post.

## Open

- `document-pipeline`: the source's blur pass.

## Upstream

- `a4642a2c70` (#34752) RenderObject: Detect missing color change for instanced meshes. Ported: `instanceColor = null` on the instanced skinned meshes.

## History

- 2026-10-15: Converted (batch 2), with the source's camera kept as a scene camera and its light at the camera's position. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34752), already ported.
