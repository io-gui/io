---
source: webgpu_lightprobes_sponza
synced: d94661f706
tags: [renderer-on-change, per-frame-gpu, types]
---

# LightprobesSponza

[`webgpu_lightprobes_sponza`](https://threejs.org/examples/#webgpu_lightprobes_sponza), converted 2026-10-20 (batch 5)

## Deviations

- **Bake:** once the model has loaded, the grid bakes progressively in `onBeforeDraw`, 16 probes per draw and one pass per bounce, per renderer; edits to the light, `shadows` or `bounces` restart it, and the counts replace the grid ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **`shadows`:** switches the sun's `castShadow` only; the source also switches the renderer's shadow map, which the editor shares.
- **Probes:** the probe helpers overlay draws them in the editor's views, spheres an eighth of the smallest probe spacing, so the source's helper, `showProbes` and `probeSize` are dropped; the Camera view draws no helpers.
- **Camera:** the first-person controls and the Log Camera button are dropped; the active camera keeps the source's start pose.
- **Types:** `SunLight.registerNode()` (r187) through a cast; `@types/three` 0.186 does not have it.

## Open

- `r187-followups`: drop the `registerNode()` cast with `@types/three` 0.187.

## Upstream

- `b85bb7fcee` (#34622) WebGPURenderer: Replace "addLight" with "lightNode" reference. Ported: `SunLight.registerNode()`, typed through a cast.
- `c396f2000d` (#34909) LightProbeGrid: Batch probe capture with ArrayCamera. Ported: 16 probes per bake step.

## Related

- [Lightprobes](LightprobesExample.md): the same grid, baked at once.

## History

- 2026-10-20: Converted (batch 5) from the source at `d94661f706`, once `onBeforeDraw` served `renderer-on-change`. Ran on the linked r187dev build. Checked headlessly: matches the source rendered from the same sources on the same GPU (the reference screenshot is brighter); property edits and scrubbing, all batch 5 documents in one page without errors.
- 2026-10-21: Changed: the probe helpers overlay draws the probes, three's `LightProbeGridHelper` with its own material (the overlay pass has no MRT); the authored helper, `showProbes` and `probeSize` are dropped. Workaround removed: `triage-fragment-node-mrt`, with the helper. Checked headlessly on the linked r187dev build `d94661f706`: the probes in the Front (TRAA) and Perspective views, none in the Camera view, without console errors.
