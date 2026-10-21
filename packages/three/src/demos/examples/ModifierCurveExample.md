---
source: webgpu_modifier_curve
synced: d94661f706
tags: [pointer-dropped]
---

# ModifierCurve

[`webgpu_modifier_curve`](https://threejs.org/examples/#webgpu_modifier_curve), converted 2026-10-15 (batch 2)

## Deviations

- **Handles:** the source's `TransformControls` are dropped; the handles move with the editor's translate tool, which rebuilds the curve on `commit`, or in the Inspector, picked up while playing.
- **Time:** the text moves along the curve with document time, a 50/3 s loop.

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls and a handle moved by a committed transaction, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
