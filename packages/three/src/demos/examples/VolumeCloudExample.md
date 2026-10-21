---
source: webgpu_volume_cloud
synced: d94661f706
---

# VolumeCloud

[`webgpu_volume_cloud`](https://threejs.org/examples/#webgpu_volume_cloud), converted 2026-10-15

## Deviations

- **Sky:** the source's 10-unit back-faced sky sphere is a background node that samples the same gradient by direction, so the sky does not dominate framing.
- **Depth:** the cloud does not write depth; its transparent box hid the grid and overlays behind it.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
