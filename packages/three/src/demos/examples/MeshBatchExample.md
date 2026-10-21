---
source: webgpu_mesh_batch
synced: d94661f706
tags: [moving-camera, verify-per-view]
---

# MeshBatch

[`webgpu_mesh_batch`](https://threejs.org/examples/#webgpu_mesh_batch), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** the source turns the dynamic instances by a small random rotation per frame; here each spins with document time about that rotation's axis, at a rate rounded to whole turns per 20π s loop.
- **Camera:** the active camera turns once per loop, for the source's auto-rotation (once a minute).
- **Sorting and culling:** run for each drawing camera.
- **Dropped:** the `webgpu` toggle, the source's WebGL fallback.

## Upstream

- `b132d67734` (#34839) Examples - Clean Up. Not applicable: the info text.

## History

- 2026-10-15: Converted (batch 2), with the auto-rotating camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), turning once per loop for its auto-rotation. Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34839), not applicable.
