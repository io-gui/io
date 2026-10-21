---
source: webgl_animation_multiple
synced: d94661f706
tags: [loop-jump]
---

# AnimationMultiple

[`webgl_animation_multiple`](https://threejs.org/examples/#webgl_animation_multiple), converted 2026-10-13

## Deviations

- **Time:** a 7 s loop of ten run cycles; idle and walk jump at the wrap.
- **`sharedSkeleton`:** the shared bones keep the glTF's transform in a `Skeleton` group instead of the meshes, so the skeleton helpers overlay draws them at size.

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with its shadow camera.

## History

- 2026-10-13: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
