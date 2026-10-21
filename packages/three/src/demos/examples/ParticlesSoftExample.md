---
source: webgpu_particles_soft
synced: d94661f706
tags: [timeline-time, loop-jump]
---

# ParticlesSoft

[`webgpu_particles_soft`](https://threejs.org/examples/#webgpu_particles_soft), converted 2026-10-15 (batch 2)

## Deviations

- **Controls:** `soft` toggles the soft fade, for the source's `mode`.
- **Instances:** an `InstancedMesh` with identity matrices and the plume's bounds, for the source's `Sprite` with `count`, so framing and culling see it.
- **Time:** TSL `time` is `timeline.timeNode`, a 20 s loop; each life jumps at the wrap.
- **Orthographic views:** the fade converts depth with the perspective formula, so they fade wrong.

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
