---
source: webgl_loader_pcd
synced: d94661f706
tags: [camera-in-scene]
---

# LoaderPcd

[`webgl_loader_pcd`](https://threejs.org/examples/#webgl_loader_pcd), converted 2026-10-14

## Deviations

- **Points:** WebGPU draws `Points` 1 px wide; a child `InstancedMesh` named `Sprites` draws a quad per point at the size, with the cloud's bounds. The `Points` stay the content that picking and framing see ([WebGPU notes](../ExamplesConversion.plan.md#webgpu-notes)).
- **Controls:** `file`, `size` and `color` keep their values across files; the source's GUI resets with each file.
- **Background:** none; the source clears to black.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused (file switches), the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene as in the source. Checked: the Scene Camera view against `examples/screenshots`.
