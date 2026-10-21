---
source: webgl_materials_blending_custom
synced: d94661f706
---

# MaterialsBlendingCustom

[`webgl_materials_blending_custom`](https://threejs.org/examples/#webgl_materials_blending_custom), converted 2026-10-17 (batch 3)

## Deviations

None.

## Workarounds

- `minmax-blend-factors`: `blendEquationChanged` sets `OneFactor` for `Min` and `Max`; WebGPU rejects other factors for them, which WebGL ignores, so the result is the same. **Restore:** keep each material's `src` and `dst` factors for every equation.

## History

- 2026-10-17: Converted (batch 3) with the workaround. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
