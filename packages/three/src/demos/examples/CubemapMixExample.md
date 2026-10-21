---
source: webgpu_cubemap_mix
synced: d94661f706
tags: [timeline-time]
---

# CubemapMix

[`webgpu_cubemap_mix`](https://threejs.org/examples/#webgpu_cubemap_mix), converted 2026-10-11

## Deviations

- **Time:** the cross-fade runs on `timeline.timeNode`; the 10 s loop is one cross-fade cycle.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-13: Fixed: the reflections froze at their first time in forward views (`shared-refresh`); `Timeline.timeNode` moved to the render group.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
