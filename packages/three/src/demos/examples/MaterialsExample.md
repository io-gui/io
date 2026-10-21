---
source: webgpu_materials
synced: d94661f706
tags: [types]
---

# Materials

[`webgpu_materials`](https://threejs.org/examples/#webgpu_materials), converted 2026-10-13

## Deviations

- **Time:** the teapots spin on a 20 s loop of document time.
- **Camera:** the active camera stands where the source's slow orbit (a third of a turn per loop) starts.
- **Types:** casts for `@types/three` 0.186: the `wgslFn` includes and the `Loop` result.

## History

- 2026-10-13: Converted, with the orbiting camera dropped. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its orbit starts. Checked: the Scene Camera view against `examples/screenshots`.
