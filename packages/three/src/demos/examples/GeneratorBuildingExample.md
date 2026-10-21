---
source: webgpu_generator_building
synced: d94661f706
tags: [renderer-on-change, timeline-time, moving-camera]
---

# GeneratorBuilding

[`webgpu_generator_building`](https://threejs.org/examples/#webgpu_generator_building), converted 2026-10-20 (batch 5)

## Deviations

- **Environment:** the sky's PMREM, without the sun disc as the source bakes it, regenerates in `onBeforeDraw` when `timeOfDay` moves the sun, once per renderer ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Camera:** the active camera turns about the tower once per 200 s loop, for the source's `OrbitControls.autoRotate`.
- **Time:** the clouds drift on the timeline (`overrideNode( time, timeline.timeNode )`).

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with `fitShadowCamera()`.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`, which had blocked it since 2026-10-15. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots`, property edits and scrubbing, all batch 5 documents in one page without errors.
