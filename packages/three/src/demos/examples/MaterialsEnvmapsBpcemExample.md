---
source: webgpu_materials_envmaps_bpcem
synced: d94661f706
tags: [per-frame-gpu]
---

# MaterialsEnvmapsBpcem

[`webgpu_materials_envmaps_bpcem`](https://threejs.org/examples/#webgpu_materials_envmaps_bpcem), converted 2026-10-18 (batch 4)

## Deviations

- **Capture:** the cube map is captured in `onBeforeDraw` before the views draw any change, so it follows the textures as they arrive and every edit; the source captures once after loading ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Panels:** the glowing area-light panels are the light helpers overlay. The Scene Camera view draws no helpers, so it lacks the panels the source shows.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`; it lacks the light panels (`scene-camera-helpers`).
- 2026-10-21: Changed: `scene-camera-helpers` closed: the Scene Camera view draws no helpers, by decision, so the missing panels are a deviation.
