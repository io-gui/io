---
source: webgl_loader_fbx
synced: d94661f706
---

# LoaderFbx

[`webgl_loader_fbx`](https://threejs.org/examples/#webgl_loader_fbx), converted 2026-10-14

## Deviations

- **Controls:** the source's clip dropdown is `clips`, a button per clip, and its morph folders one flat `morphs` record, a slider per morph target, with a mesh-name prefix only where names repeat ([Properties and groups](../ExamplesConversion.plan.md#properties-and-groups)).
- **Time:** the timeline takes the playing clip's length.

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with its shadow box.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused (asset switches, clip buttons, morph sliders), the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
