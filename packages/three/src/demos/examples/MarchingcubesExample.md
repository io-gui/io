---
source: webgl_marchingcubes
synced: d94661f706
tags: [loop-jump]
watch: [examples/jsm/shaders/ToonShader.js]
---

# Marchingcubes

[`webgl_marchingcubes`](https://threejs.org/examples/#webgl_marchingcubes), converted 2026-10-17 (batch 3)

## Deviations

- **Toon materials:** the four GLSL toon shaders (`ToonShader1`, `ToonShader2`, hatching, dotted) are TSL color nodes on basic materials, with the same math; `ShaderMaterial` does not run on WebGPU.
- **Time:** the simulation integrates the timeline's `delta` times `speed`, as the source integrates its timer, so scrubbing back moves the blobs back and they jump at the 60 s wrap.
- **Controls:** `material` is a dropdown instead of a button per material.

## Workarounds

- `mesh-count`: `object.count = 1` after `update()` in `updateCubes`. `MarchingCubes` keeps its vertex count in `count`, which WebGPU draws as the instance count. **Restore:** delete the line.
- `dynamic-usage`: `staticUsage()` in the constructor and `resolutionChanged()`, and update ranges over the drawn vertices in `updateCubes`. **Restore:** the addon's `DynamicDrawUsage` buffers; delete `staticUsage()` and the range loop.
- `triage-cube-envmap-loading`: the env maps are assigned in the cube maps' load callbacks. **Restore:** `envMap: reflectionCube` in `shiny` and `chrome` and `envMap: refractionCube` in `liquid`, from the loaders' return values.

## History

- 2026-10-17: Converted (batch 3) with the three workarounds; the first port stalled the editor (`count` drawn as instances, dynamic buffers uploaded whole on every draw). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
