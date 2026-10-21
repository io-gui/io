---
source: webgl_buffergeometry_points_interleaved
synced: d94661f706
---

# BuffergeometryPointsInterleaved

[`webgl_buffergeometry_points_interleaved`](https://threejs.org/examples/#webgl_buffergeometry_points_interleaved), converted 2026-10-17 (batch 3)

## Deviations

- **Points:** WebGPU draws `Points` 1 px wide; a child `Sprite` named `Sprites` draws a quad per point from the same interleaved bytes. It unpacks the 8-bit color from the fourth 32-bit word, as node buffer attributes take no `normalized` flag.

## Related

- [BuffergeometryPoints](BuffergeometryPointsExample.md): the same cloud from separate buffers.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
