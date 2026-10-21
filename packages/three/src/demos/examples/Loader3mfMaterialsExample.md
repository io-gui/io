---
source: webgl_loader_3mf_materials
synced: d94661f706
tags: [camera-in-scene]
---

# Loader3mfMaterials

[`webgl_loader_3mf_materials`](https://threejs.org/examples/#webgl_loader_3mf_materials), converted 2026-10-14

## Deviations

None.

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with its shadow camera and map size.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene as in the source. Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
