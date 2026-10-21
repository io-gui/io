---
source: webgl_materials_cubemap_refraction
synced: d94661f706
tags: [pointer-dropped]
---

# MaterialsCubemapRefraction

[`webgl_materials_cubemap_refraction`](https://threejs.org/examples/#webgl_materials_cubemap_refraction), converted 2026-10-14

## Deviations

- **Camera:** the source's camera follows the mouse; the active camera rests where the pointer at the centre leaves it.

## History

- 2026-10-14: Converted, with the mouse camera dropped. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), resting where the pointer at the centre leaves it. Checked: the Scene Camera view against `examples/screenshots`.
