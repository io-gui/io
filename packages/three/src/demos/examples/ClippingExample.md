---
source: webgpu_clipping
synced: d94661f706
---

# Clipping

[`webgpu_clipping`](https://threejs.org/examples/#webgpu_clipping), converted 2026-10-15

## Deviations

- **`alphaToCoverage`:** smooths the cut edges only in views drawn with MSAA (`View.msaa`); TRAA views ignore it ([WebGPU notes](../ExamplesConversion.plan.md#webgpu-notes)).

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with its shadow camera and map size.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-16: Changed: `alphaToCoverage` works in views with `View.msaa`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
