---
source: webgpu_reflection
synced: d94661f706
tags: [timeline-time, loop-jump, moving-camera, stand-in-framing]
---

# Reflection

[`webgpu_reflection`](https://threejs.org/examples/#webgpu_reflection), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** the source's tween.js effectors derive from document time, a 57 s loop; the boxes' bob jumps at the wrap.
- **Camera:** the active camera turns once per loop, for the source's auto-rotation (once a minute).
- **Boxes:** they stay `Mesh.count` instances, as in the source: an `InstancedMesh`'s matrix buffers would pass WebGPU's 8 vertex buffers in TRAA views ([WebGPU notes](../ExamplesConversion.plan.md#webgpu-notes)).
- **Dropped:** the blur and vignette post.

## Open

- `document-pipeline`: the source's blur and vignette passes.

## History

- 2026-10-15: Converted (batch 2), with the auto-rotating camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), turning once per loop for its auto-rotation. Checked: the Scene Camera view against `examples/screenshots`.
