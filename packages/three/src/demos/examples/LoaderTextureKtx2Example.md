---
source: webgpu_loader_texture_ktx2
synced: d94661f706
---

# LoaderTextureKtx2

[`webgpu_loader_texture_ktx2`](https://threejs.org/examples/#webgpu_loader_texture_ktx2), converted 2026-10-15 (batch 2)

## Deviations

- **Layout:** the source draws one scene per file in a scissor grid, each through its own camera, with labels; here each file is a plane named after it, in a row per section, and the document names no active camera.
- **Loading:** the textures load in `onRendererInitialized`, once `detectSupport` has picked the formats ([Map](../ExamplesConversion.plan.md#map)).

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors; all 16 files load on the Apple GPU.
- 2026-10-19: Checked: no active camera, as the source has none for the whole; the views frame the rows.
