---
source: webgl_instancing_performance
synced: d94661f706
tags: [moving-camera]
---

# InstancingPerformance

[`webgl_instancing_performance`](https://threejs.org/examples/#webgl_instancing_performance), converted 2026-10-17 (batch 3)

## Deviations

- **Controls:** `drawCalls` and `gpuMemory` are read-only properties for the source's Performance folder.
- **Camera:** it plays a 30 s loop in which the active camera circles the heads once, for the source's `OrbitControls.autoRotate` at its default speed.

## History

- 2026-10-17: Converted (batch 3), static. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011); the document plays a 30 s loop in which it circles the heads once. Checked: the Scene Camera view against `examples/screenshots`.
