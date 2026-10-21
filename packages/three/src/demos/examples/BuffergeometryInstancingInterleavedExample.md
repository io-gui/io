---
source: webgl_buffergeometry_instancing_interleaved
synced: d94661f706
---

# BuffergeometryInstancingInterleaved

[`webgl_buffergeometry_instancing_interleaved`](https://threejs.org/examples/#webgl_buffergeometry_instancing_interleaved), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** each crate spins about (1, 1, 1) at 0.4 rad/s from document time, on a 40π s loop; the source multiplies in a small rotation every frame.

## Workarounds

- `instanced-mesh-instance-count`: `geometry.instanceCount = instances`, since WebGPU draws the `InstancedBufferGeometry`'s instance count (Infinity by default) rather than the mesh's. **Restore:** delete the line.

## History

- 2026-10-17: Converted (batch 3) with the workaround. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors. The source's camera, in the middle of the cloud, was kept as a scene camera.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
