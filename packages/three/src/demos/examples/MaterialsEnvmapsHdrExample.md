---
source: webgl_materials_envmaps_hdr
synced: d94661f706
---

# MaterialsEnvmapsHdr

[`webgl_materials_envmaps_hdr`](https://threejs.org/examples/#webgl_materials_envmaps_hdr), converted 2026-10-14

## Deviations

- **Dropped:** the `debug` plane, which shows the PMREM as a 2D atlas; WebGPU's PMREM is a cube texture ([WebGPU notes](../ExamplesConversion.plan.md#webgpu-notes)).
- **Controls:** the source's exposure control is the document's `toneMappingExposure`.
- **Time:** the knot turns once per 20 s loop of document time.

## Related

- [MaterialsEnvmapsExr](MaterialsEnvmapsExrExample.md): the same knot and controls from equirectangular images.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused (envMap switches), the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
