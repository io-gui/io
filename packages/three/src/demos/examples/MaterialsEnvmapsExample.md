---
source: webgpu_materials_envmaps
synced: d94661f706
---

# MaterialsEnvmaps

[`webgpu_materials_envmaps`](https://threejs.org/examples/#webgpu_materials_envmaps), converted 2026-10-13

## Deviations

- **Time:** while `rotateX`, `rotateY` or `rotateZ` is on, the background turns about that axis with document time, once per 100 s loop, and it snaps back when off; the source accumulates the rotation.

## History

- 2026-10-13: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
