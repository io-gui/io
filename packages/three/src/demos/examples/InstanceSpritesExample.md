---
source: webgpu_instance_sprites
synced: d94661f706
tags: [pointer-dropped, loop-jump, timeline-time]
---

# InstanceSprites

[`webgpu_instance_sprites`](https://threejs.org/examples/#webgpu_instance_sprites), converted 2026-10-15 (batch 2)

## Deviations

- **Camera:** the source's camera follows the pointer; the active camera rests where the pointer at the centre leaves it.
- **Time:** the hues cycle on `timeline.timeNode` in a 20 s loop; the spin jumps at the wrap.
- **Instances:** an `InstancedMesh` with identity matrices and the cube's bounds, for the source's `Sprite` with `count`, so framing and culling see the cloud.

## History

- 2026-10-15: Converted (batch 2), with the pointer camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), resting where the pointer at the centre leaves it. Checked: the Scene Camera view against `examples/screenshots`.
