---
source: webgpu_tsl_vfx_tornado
synced: d94661f706
tags: [timeline-time, loop-jump]
---

# TslVfxTornado

[`webgpu_tsl_vfx_tornado`](https://threejs.org/examples/#webgpu_tsl_vfx_tornado), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** TSL `time` is `timeline.timeNode`, a 20 s loop of the noise; the turbulence jumps at the wrap.
- **Bloom:** the source's bloom is the document's `bloom`, drawn by views that follow it (the Scene Camera view in the demo host).

## History

- 2026-10-15: Converted (batch 2), with the bloom dropped as cosmetic post. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-16: Changed: the source's bloom is back as `Document.bloom`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
