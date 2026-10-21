---
source: webgpu_morphtargets_face
synced: d94661f706
---

# MorphtargetsFace

[`webgpu_morphtargets_face`](https://threejs.org/examples/#webgpu_morphtargets_face), converted 2026-10-13

## Deviations

- **Controls:** the 52 blend shapes are the `expressions` sliders, accessors over the head's morph influences ([Properties and groups](../ExamplesConversion.plan.md#properties-and-groups)); they follow the clip while it plays and hold what you set while paused.

## Open

- `inspector-refresh`: the sliders follow the clip through a debug-only `dispatchMutation` in `onAnimate`, which bundles strip.

## History

- 2026-10-13: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
