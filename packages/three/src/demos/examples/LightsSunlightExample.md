---
source: webgpu_lights_sunlight
synced: d94661f706
tags: [renderer-on-change, verify-per-view, types]
---

# LightsSunlight

[`webgpu_lights_sunlight`](https://threejs.org/examples/#webgpu_lights_sunlight), converted 2026-10-20 (batch 5)

## Deviations

- **Environment:** the sky environment regenerates in `onBeforeDraw` when the sun moves, from a second `SkyMesh` in a scene of its own ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Cascades:** the `SunLight`'s cascades refit to each view's camera.
- **Camera:** the first-person controls are dropped; the active camera keeps the source's start pose.
- **Types:** `SunLight.registerNode()` (r187) through a cast; `@types/three` 0.186 does not have it.

## Open

- `r187-followups`: drop the `registerNode()` cast with `@types/three` 0.187.

## Upstream

- `b85bb7fcee` (#34622) WebGPURenderer: Replace "addLight" with "lightNode" reference. Ported: `SunLight.registerNode()`, typed through a cast.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`, which had blocked it since 2026-10-15. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots`, property edits and scrubbing, all batch 5 documents in one page without errors.
