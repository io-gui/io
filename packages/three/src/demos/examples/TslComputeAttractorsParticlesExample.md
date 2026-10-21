---
source: webgpu_tsl_compute_attractors_particles
synced: d94661f706
tags: [live, per-frame-gpu, pointer-dropped]
---

# TslComputeAttractorsParticles

[`webgpu_tsl_compute_attractors_particles`](https://threejs.org/examples/#webgpu_tsl_compute_attractors_particles), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** live ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)): one fixed 1/60 s step per source frame of the time played forward, so scrubbing back or a loop wrap does not rewind the particles.
- **Attractors:** selectable `Attractor 1` to `Attractor 3` objects, moved and turned with the editor's tools and read before each step, for the source's `TransformControls`; its `controlsMode` is dropped.
- **Controls:** the masses are powers of ten (`attractorMassExp`, `particleMassExp`); `reset` is a button, and the instance bounds follow `bounds`.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
