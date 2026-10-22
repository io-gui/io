---
source: webgpu_custom_fog
synced: d94661f706
tags: [renderer-on-change, timeline-time, loop-jump, camera-in-scene]
---

# CustomFog

[`webgpu_custom_fog`](https://threejs.org/examples/#webgpu_custom_fog), converted 2026-10-20 (batch 5)

## Deviations

- **Time:** the fog noise runs on `timeline.timeNode` instead of the renderer's frame time. It does not repeat, so the 60 s loop jumps at the wrap.
- **Environment:** the sky's PMREM regenerates in `onBeforeDraw` after the sun moves, once per renderer, reusing its target as the source does ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)). The source regenerates it in `updateSun()`.
- **Forest cull:** centred on the active camera's world position, so every view draws the same trees and the shadow map matches them. `onBeforeDraw` re-centres it when the camera has moved and refreshes the shadow map; the source copies its camera's position every frame while first-person controls fly it. Following each view would need `view-camera`, and the shadow map would keep one view's trees.
- **Camera:** the active camera is in the scene (the source keeps it out), so views draw it and tools can move it; the forest and its shadows follow.

## Related

- CustomFogBackground and CustomFogScattering, the other custom fog sources, are not converted yet. Both draw their fog in a `RenderPipeline` over a scene pass, and a document cannot bring its own post-processing until the `document-pipeline` blocker is done.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`, which had blocked it since 2026-10-15. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots/webgpu_custom_fog.jpg`, property edits and scrubbing, all batch 5 documents in one page without errors.
- 2026-10-21: Changed: the active camera added to the scene, to see whether the forest follows it. It did not (`cull-follows-camera`).
- 2026-10-21: Fixed: the cull follows the active camera: `followActiveCamera()` in `onBeforeDraw` re-centres it on the camera's world position when that changed, and refreshes the shadow map (`cull-follows-camera`). Checked headlessly on the linked build: moving the camera from (-50, 88, 230) to (100, 88, 230) re-centres the cull once, without console errors.
