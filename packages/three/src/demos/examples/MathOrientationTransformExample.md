---
source: webgl_math_orientation_transform
synced: d94661f706
---

# MathOrientationTransform

[`webgl_math_orientation_transform`](https://threejs.org/examples/#webgl_math_orientation_transform), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** the source moves the target with `setTimeout`; here ten random targets are drawn once, one per 2 s of a 20 s loop starting from the last, and the turn derives from document time.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
