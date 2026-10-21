---
source: webgl_loader_texture_dds
synced: d94661f706
---

# LoaderTextureDds

[`webgl_loader_texture_dds`](https://threejs.org/examples/#webgl_loader_texture_dds), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** the meshes turn with document time (1 rad/s, a 2π s loop) instead of the wall clock.

## Workarounds

- `#35084`: `cubeTexture()` wraps each cube map's six faces in a `CompressedCubeTexture`, and `loadCubemap()` assigns it as `envMap` once loaded (materials 1, 5 and 6). **Restore:** if #35084 lands as reworked, the updated source's `loadAsync()` cube maps, deleting `cubeTexture()`; otherwise `cubemap1` to `cubemap3` from `load()` as `envMap` at material creation, with the source's callbacks.

## Upstream

- #35081 CompressedTexture: Default `mipmaps` to an empty array. Filed 2026-10-18, merged 2026-10-19 (`db1ef0781a`).
- #35082 WebGPURenderer: Support uncompressed data in compressed textures. Filed 2026-10-18, merged 2026-10-19 (`bc88736756`).
- #35083 WebGPURenderer: Support `CompressedCubeTexture`. Filed 2026-10-18, merged 2026-10-19 (`f9ba4abd3d`).
- #35084 CompressedTextureLoader: Return cube maps as cube textures. Filed 2026-10-18, open. Reworked 2026-10-19 after review: `loadAsync()` resolves cube maps as `CompressedCubeTexture`s and `load()` warns once; the rework moves this source's cube maps to `loadAsync()`.

## Related

- [MaterialsEnvmapsFasthdr](MaterialsEnvmapsFasthdrExample.md): its prefiltered KTX2 cube maps are `CompressedCubeTexture`s, which WebGPU uploads since #35083.

## History

- 2026-10-17: Converted (batch 3) with three workarounds, as WebGPU could not take the files the way the source uses them: the maps assigned in their load callbacks (a compressed texture still loading broke binding), uncompressed files converted to `DataTexture`s (`uncompressed()`), and the three cube maps dropped (uploaded as 1 × 1), with the `ARGB Cube Mip` and `ARGB Cube` boxes. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-18: Filed #35081 to #35084 for the four bugs behind the workarounds (`three_upstream_fixes.plan.md`, Compressed textures).
- 2026-10-19: Workaround removed: #35081 and #35082, merged and in `../three.js` dev `ad4f951a86`: the maps come from `load()` at material creation again, and `uncompressed()` is gone. Workaround added: #35084: the cube maps and the two ARGB cube boxes are back, the maps wrapped as `CompressedCubeTexture`s (uploaded since #35083) and assigned once loaded. Checked headlessly: the frame at time 0 matches the reference screenshot, without errors or warnings.
