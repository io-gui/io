---
source: webgpu_lightprobes
synced: d94661f706
tags: [renderer-on-change]
---

# Lightprobes

[`webgpu_lightprobes`](https://threejs.org/examples/#webgpu_lightprobes), converted 2026-10-20 (batch 5)

## Deviations

- **Bake:** the grid bakes in `onBeforeDraw`, once per renderer and grid ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)); `resolution` replaces the grid at once, without the source's 250 ms debounce.
- **Controls:** `gi` for the source's `enabled`.
- **Probes:** the probe helpers overlay draws them in the editor's views, so the source's helper and `showProbes` are dropped; the Camera view draws no helpers.

## Related

- [LightprobesComplex](LightprobesComplexExample.md) and [LightprobesSponza](LightprobesSponzaExample.md): the same grid and bake.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots`, property edits and scrubbing, all batch 5 documents in one page without errors.
- 2026-10-21: Changed: the probe helpers overlay draws the probes, three's `LightProbeGridHelper` with its own material (the overlay pass has no MRT); the authored helper and `showProbes` are dropped. Workaround removed: `triage-fragment-node-mrt`, with the helper. Checked headlessly on the linked r187dev build `d94661f706`: the probes in the Front (TRAA) and Perspective views, none in the Camera view, without console errors.
