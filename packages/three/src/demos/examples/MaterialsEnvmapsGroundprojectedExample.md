---
source: webgpu_materials_envmaps_groundprojected
synced: d94661f706
tags: [renderer-on-change]
---

# MaterialsEnvmapsGroundprojected

[`webgpu_materials_envmaps_groundprojected`](https://threejs.org/examples/#webgpu_materials_envmaps_groundprojected), converted 2026-10-20 (batch 5)

## Deviations

- **Conversion:** the equirectangular HDR becomes a cube map in `onBeforeDraw`, once per renderer ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Loading:** the skybox is added once the HDR has loaded.

## History

- 2026-10-20: Converted (batch 5) with the transmission rows, once `transmission-views` stopped reproducing. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots`, property edits, playing in four views while the window resizes, all batch 5 documents in one page without errors.
