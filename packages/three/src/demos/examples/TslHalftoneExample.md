---
source: webgpu_tsl_halftone
synced: d94661f706
---

# TslHalftone

[`webgpu_tsl_halftone`](https://threejs.org/examples/#webgpu_tsl_halftone), converted 2026-10-15

## Deviations

- **Controls:** each halftone layer is a `Halftone` object (`shade`, `highlight`) with its own nested editor, which the shader reads through reference nodes ([Properties and groups](../ExamplesConversion.plan.md#properties-and-groups)).

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
