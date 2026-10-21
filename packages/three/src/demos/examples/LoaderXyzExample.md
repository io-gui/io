---
source: webgl_loader_xyz
synced: d94661f706
tags: [camera-in-scene]
---

# LoaderXyz

[`webgl_loader_xyz`](https://threejs.org/examples/#webgl_loader_xyz), converted 2026-10-14

## Deviations

- **Points:** WebGPU draws `Points` 1 px wide; a child `InstancedMesh` named `Sprites` draws a quad per point at the source's size.
- **Time:** the helix tumbles with document time on a 20π s loop, two and five turns.
- **Background:** none; the source clears to black.

## Related

- [LoaderPcd](LoaderPcdExample.md): the same sized points over a loaded cloud.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene as in the source. Checked: the Scene Camera view against `examples/screenshots`.
