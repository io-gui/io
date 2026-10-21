---
source: webgpu_materials_basic
synced: d94661f706
tags: [pointer-dropped]
---

# MaterialsBasic

[`webgpu_materials_basic`](https://threejs.org/examples/#webgpu_materials_basic), converted 2026-10-13

## Deviations

- **Time:** the spheres move with document time on a 20π s loop.
- **Camera:** the source's camera follows the mouse; the active camera rests where the pointer at the centre leaves it.

## History

- 2026-10-13: Converted, with the mouse camera dropped. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), resting where the pointer at the centre leaves it. Checked: the Scene Camera view against `examples/screenshots`.
