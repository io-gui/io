---
source: webgpu_lightprobe_cubecamera
synced: d94661f706
---

# LightprobeCubecamera

[`webgpu_lightprobe_cubecamera`](https://threejs.org/examples/#webgpu_lightprobe_cubecamera), converted 2026-10-15

## Deviations

- **Capture:** the cube camera renders once, with the first renderer, in `onRendererInitialized` after the background has loaded.
- **Helper:** the light probe helper is the content, the source's subject; in the editor's views the probe helpers overlay's small sphere for the same probe sits inside it.

## Workarounds

- `triage-fragment-node-mrt`: `useBasicMaterial()` gives the probe helper a `MeshBasicNodeMaterial` whose `colorNode` is the same irradiance; the helper's `fragmentNode` writes only the first color output, which the TRAA views' MRT pass rejects. **Restore:** the helper's own material.

## Related

- [Lightprobe](LightprobeExample.md): a probe from a cube map, drawn by the probe helpers overlay instead of a content helper.

## History

- 2026-10-15: Converted with the workaround. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Changed: the probe helpers overlay also draws the probe in the editor's views, hidden inside the content helper, which stays with its workaround. Checked headlessly on the linked r187dev build `d94661f706`: the content helper in every view, without console errors.
