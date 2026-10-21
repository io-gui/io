---
source: webgpu_parallax_uv
synced: d94661f706
---

# ParallaxUv

[`webgpu_parallax_uv`](https://threejs.org/examples/#webgpu_parallax_uv), converted 2026-10-15

## Deviations

- **Camera:** the active camera stands where the source's auto-rotation starts.

## History

- 2026-10-15: Converted, with the auto-rotating camera dropped. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its auto-rotation starts. Checked: the Scene Camera view against `examples/screenshots`.
