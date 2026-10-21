---
source: webgpu_sandbox
synced: d94661f706
tags: [timeline-time]
---

# Sandbox

[`webgpu_sandbox`](https://threejs.org/examples/#webgpu_sandbox), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** TSL `time` is `timeline.timeNode`, a 10 s loop; the box turns at 2π/10 and 4π/10 rad/s, the source's 0.6 and 1.2 rounded to whole turns.
- **Loading:** the KTX2 plane joins once its texture loads, after `detectSupport` in `onRendererInitialized`.

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
