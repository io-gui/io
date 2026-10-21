---
source: webgpu_tsl_galaxy
synced: d94661f706
tags: [timeline-time, loop-jump]
---

# TslGalaxy

[`webgpu_tsl_galaxy`](https://threejs.org/examples/#webgpu_tsl_galaxy), converted 2026-10-13

## Deviations

- **Time:** TSL `time` is `timeline.timeNode`, a 60 s loop; each particle turns at its own rate, so the swirl jumps at the wrap.

## History

- 2026-10-13: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
