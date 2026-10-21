---
source: webgpu_tsl_angular_slicing
synced: d94661f706
---

# TslAngularSlicing

[`webgpu_tsl_angular_slicing`](https://threejs.org/examples/#webgpu_tsl_angular_slicing), converted 2026-10-15

## Deviations

None.

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with its shadow camera.

## History

- 2026-10-15: Converted, with the source's camera kept as a scene camera, since the cut faces it and default framing looks at the far side. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
