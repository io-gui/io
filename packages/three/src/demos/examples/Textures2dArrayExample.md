---
source: webgpu_textures_2d-array
synced: d94661f706
tags: [timeline-time]
---

# Textures2dArray

[`webgpu_textures_2d-array`](https://threejs.org/examples/#webgpu_textures_2d-array), converted 2026-10-13

## Deviations

- **Time:** TSL `time` is `timeline.timeNode`; the 2 s loop is one sweep through the layers and back.

## History

- 2026-10-13: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
