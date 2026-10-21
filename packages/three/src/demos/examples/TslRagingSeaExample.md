---
source: webgpu_tsl_raging_sea
synced: d94661f706
tags: [timeline-time]
---

# TslRagingSea

[`webgpu_tsl_raging_sea`](https://threejs.org/examples/#webgpu_tsl_raging_sea), converted 2026-10-13

## Deviations

- **Time:** TSL `time` is `timeline.timeNode`, a 20 s loop.

## History

- 2026-10-13: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
