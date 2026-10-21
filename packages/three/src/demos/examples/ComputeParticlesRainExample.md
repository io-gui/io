---
source: webgpu_compute_particles_rain
synced: d94661f706
tags: [live, per-frame-gpu, stand-in-framing]
---

# ComputeParticlesRain

[`webgpu_compute_particles_rain`](https://threejs.org/examples/#webgpu_compute_particles_rain), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** live ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)): the colliders' heights render once per draw, then one step per source frame of the time played forward, so scrubbing back or a loop wrap does not rewind the rain. TSL `deltaTime` and `time` are uniforms the steps advance. Suzanne turns with document time (2π s loop).
- **Slab:** `boxPosition` moves it there directly; the source eases it toward its position. `boxScale` and `dropCount` complete the controls.

## Upstream

- `98833ef5a4` (#34840) Examples - Clean Up 2. Not applicable: the info text.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34840), not applicable.
