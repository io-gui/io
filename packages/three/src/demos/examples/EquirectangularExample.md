---
source: webgpu_equirectangular
synced: d94661f706
---

# Equirectangular

[`webgpu_equirectangular`](https://threejs.org/examples/#webgpu_equirectangular), converted 2026-10-15

## Deviations

- **Camera:** the active camera stands where the source's auto-rotation starts.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors. The auto-rotating camera was dropped.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its auto-rotation starts. Checked: the Scene Camera view against `examples/screenshots`.
