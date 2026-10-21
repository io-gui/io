---
source: webgpu_particles
synced: d94661f706
tags: [timeline-time, loop-jump]
---

# Particles

[`webgpu_particles`](https://threejs.org/examples/#webgpu_particles), converted 2026-10-15

## Deviations

- **Time:** TSL `time` is `timeline.timeNode`, a 20 s loop; each life jumps at the wrap.
- **Instances:** `InstancedMesh`es with identity matrices and the plumes' bounds, for the source's `Mesh.count` instances, so framing and culling see them.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
