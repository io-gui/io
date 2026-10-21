---
source: webgpu_refraction
synced: d94661f706
tags: [verify-per-view]
---

# Refraction

[`webgpu_refraction`](https://threejs.org/examples/#webgpu_refraction), converted 2026-10-15 (batch 2)

## Deviations

- **Refraction:** the pane samples each view's own frame (`viewportSharedTexture`), so every view refracts what it drew behind the pane.

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
