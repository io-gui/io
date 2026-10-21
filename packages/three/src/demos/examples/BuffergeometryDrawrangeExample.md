---
source: webgl_buffergeometry_drawrange
synced: d94661f706
tags: [loop-jump]
---

# BuffergeometryDrawrange

[`webgl_buffergeometry_drawrange`](https://threejs.org/examples/#webgl_buffergeometry_drawrange), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** the particles move by `delta`, so scrubbing back moves them back along their paths and they jump at the 20π s wrap.
- **Points:** WebGPU draws `Points` 1 px wide; a child `Sprite` draws the dots at the source's 3 px.

## Workarounds

- `dynamic-usage`: the line `position` and `color` buffers are created without `DynamicDrawUsage`, and `connect()` marks update ranges over the drawn segments. **Restore:** `.setUsage( DynamicDrawUsage )` on both, and `needsUpdate` only.

## History

- 2026-10-17: Converted (batch 3) with the workaround; the line buffers hold a million segments. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
