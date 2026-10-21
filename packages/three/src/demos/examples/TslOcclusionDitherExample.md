---
source: webgpu_tsl_occlusion_dither
synced: d94661f706
tags: [loop-jump, verify-per-view]
---

# TslOcclusionDither

[`webgpu_tsl_occlusion_dither`](https://threejs.org/examples/#webgpu_tsl_occlusion_dither), converted 2026-10-20 (batch 5)

## Deviations

- **Time:** the walk derives from document time, one circle per 2π / 0.35 s loop; the stride jumps at the wrap.
- **Controls:** the source's `paused` is the editor's transport.
- **Cone:** each view cuts it from its own camera.

## History

- 2026-10-20: Converted (batch 5) from the source at `d94661f706`, which is newer than r186. Ran on the linked r187dev build. Checked headlessly: the active view against `examples/screenshots`, property edits and scrubbing, all batch 5 documents in one page without errors.
