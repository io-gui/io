---
source: webgpu_loader_materialx
synced: d94661f706
tags: [stand-in-framing]
---

# LoaderMaterialx

[`webgpu_loader_materialx`](https://threejs.org/examples/#webgpu_loader_materialx), converted 2026-10-20 (batch 5)

## Deviations

- **Loading:** the handlers for the samples' `.exr`, `.tif` and `.hdr` images are on the loader's own `LoadingManager`; the source adds them to the global `DefaultLoadingManager`.
- **Dropped:** the `compileAsync` precompilation.
- **Assets:** the three.js test samples load from the dev branch on raw.githubusercontent.com; four of them are r187.

## Open

- `r187-followups`: load the local samples from threejs.org once r187 is released.

## Upstream

- Seven commits after r186 (#34439, #34575, #34576, #34623, #35016 and two without a PR: MaterialX loading, MikkTSpace in JavaScript, shader precompilation). In: the example was converted from `d94661f706`.
- `triage-materialx-compile-async`: the source, rendered from `src`, logs about 360 WebGPU validation errors while it loads, likely from `compileAsync` during its animation loop. The conversion does not precompile.

## History

- 2026-10-20: Converted (batch 5) from the source at `d94661f706`. Ran on the linked r187dev build. Checked headlessly: matches the source rendered from the same sources on the same GPU; all batch 5 documents in one page without errors, apart from the samples' own logs. One `tangent` attribute warning appears in some runs, origin unknown (all visible ball meshes have tangents).
