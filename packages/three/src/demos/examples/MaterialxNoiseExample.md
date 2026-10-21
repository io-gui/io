---
source: webgpu_materialx_noise
synced: d94661f706
tags: [timeline-time, loop-jump, types]
---

# MaterialxNoise

[`webgpu_materialx_noise`](https://threejs.org/examples/#webgpu_materialx_noise), converted 2026-10-15

## Deviations

- **Time:** the noise scrolls on `timeline.timeNode` in an 8π s loop and jumps at the wrap; the spheres turn once per loop, where the source turns them 0.005 rad per frame.
- **Types:** the MaterialX helpers are typed loosely for `@types/three` 0.186.

## Upstream

- `5b25e98c95` Examples: Load MaterialX noise samples progressively, and its revert `82f270bfef`. Not applicable: together they add a blank line.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: two upstream commits since r186 that cancel out.
