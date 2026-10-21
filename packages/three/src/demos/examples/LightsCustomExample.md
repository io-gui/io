---
source: webgpu_lights_custom
synced: d94661f706
---

# LightsCustom

[`webgpu_lights_custom`](https://threejs.org/examples/#webgpu_lights_custom), converted 2026-10-15

## Deviations

- **Scene:** the source turns the whole scene; here a `Pivot` group with the lights and the points turns, on a 20π s loop.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
