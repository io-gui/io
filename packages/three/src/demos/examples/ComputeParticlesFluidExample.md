---
source: webgpu_compute_particles_fluid
synced: d94661f706
tags: [live, per-frame-gpu, pointer-dropped, stand-in-framing, types]
---

# ComputeParticlesFluid

[`webgpu_compute_particles_fluid`](https://threejs.org/examples/#webgpu_compute_particles_fluid), converted 2026-10-18 (batch 4)

## Deviations

- **Time:** live ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)): one step per draw by the time played forward, up to 1/60 s as in the source, so scrubbing back or a loop wrap does not rewind the fluid.
- **Pointer:** the force that stirs the fluid is zero.
- **Types:** the struct buffers and named loops are typed through `any` (`@types/three` 0.186).

## Upstream

- `b0ff5d0783` (#34813) WebGPURenderer: Throw an error if "count" and "dispatchSize" are used together. Ported: the kernels run with `count`, without indirect workgroup buffers.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34813), already ported.
