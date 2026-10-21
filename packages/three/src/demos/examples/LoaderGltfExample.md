---
source: webgpu_loader_gltf
synced: d94661f706
---

# LoaderGltf

[`webgpu_loader_gltf`](https://threejs.org/examples/#webgpu_loader_gltf), converted 2026-10-15

## Deviations

- **Controls:** `asset` lists the Khronos sample index, fetched with a top-level `await` in the module ([Properties and groups](../ExamplesConversion.plan.md#properties-and-groups)), for the source's `model` dropdown.
- **Time:** the animations follow document time and the timeline takes the longest clip's length. The default model has no clips, so the document is static; animated ones play with the transport.
- **Dropped:** `compileAsync`, which needs the renderer, so the first frame with a new model may stall.

## Open

- `upstream-port`: the camera fit's `Math.tan` (Upstream).

## Upstream

- `2f804021be` (#34585) PMREMGenerator: Replace the CubeUV atlas with cube render targets. Not ported yet: its fix to the camera fit, `Math.tan` for `Math.atan` in `fitHeightDistance` (`upstream-port`).

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011); it refits to each loaded model as the source does (`fitCameraToSelection`). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34585), not ported yet.
