---
source: webgl_materials_envmaps_fasthdr
synced: d94661f706
tags: [types]
---

# MaterialsEnvmapsFasthdr

[`webgl_materials_envmaps_fasthdr`](https://threejs.org/examples/#webgl_materials_envmaps_fasthdr), converted 2026-10-20 (batch 5)

## Deviations

- **Assets:** the prefiltered KTX2 cubemaps load from the dev branch on raw.githubusercontent.com; they reach threejs.org with r187.
- **Loading:** a KTX2 loader per load, set up from the first renderer in `onRendererInitialized` (`detectSupport`).
- **Types:** `isPMREMTexture` is set through a cast; `@types/three` 0.186 does not have it.

## Open

- `r187-followups`: load the cubemaps from threejs.org and drop the cast once r187 and its typings are out.

## Upstream

- `2f804021be` (#34585) PMREMGenerator: Replace the CubeUV atlas with cube render targets. Ported: converted from this version (prefiltered KTX2 cube maps with `isPMREMTexture`); r186 loaded CubeUV atlases.

## Related

- [LoaderTextureDds](LoaderTextureDdsExample.md): compressed cube textures, which WebGPU uploads since #35083.

## History

- 2026-10-20: Converted (batch 5) from the source at `d94661f706`, with the transmission rows. Ran on the linked r187dev build. Checked headlessly: the active view against `examples/screenshots`, property edits, playing in four views while the window resizes, all batch 5 documents in one page without errors.
