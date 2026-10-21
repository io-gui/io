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

## Workarounds

- `triage-fragment-node-mrt`: `useBasicMaterial()` gives the `LightProbeGridHelper` a `MeshBasicNodeMaterial` with the helper's `fragmentNode` as its `colorNode`; a `fragmentNode` writes only the first color output, which the TRAA views' MRT pass rejects. **Restore:** the helper's own material.

## Related

- [LightprobesComplex](LightprobesComplexExample.md) and [LightprobesSponza](LightprobesSponzaExample.md): the same grid, bake and helper workaround.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots`, property edits and scrubbing, all batch 5 documents in one page without errors.
