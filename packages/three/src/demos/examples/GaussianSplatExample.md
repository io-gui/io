---
source: webgpu_gaussian_splat
synced: d94661f706
tags: [verify-per-view, stand-in-framing]
---

# GaussianSplat

[`webgpu_gaussian_splat`](https://threejs.org/examples/#webgpu_gaussian_splat), converted 2026-10-15 (batch 2)

## Deviations

- **Color:** the source sets the global working color space to sRGB, which a document cannot (it would change every document). Each splat's color converts to the linear working space instead (`colorSpaceToWorking`), so the splats blend in linear: close to the source except in soft edges ([Map](../ExamplesConversion.plan.md#map)). A per-document working color space was rejected on 2026-10-16: it is global (other documents, editors and overlays), read when colors are created and shaders built, and every material would need a rebuild on each switch.
- **Sorting:** the splats sort by depth for each drawing camera before it draws them, so every view sorts its own order.
- **Dropped:** the raycast hit marker (picking selects the splat object) and the license text.

## Open

- `document-pipeline`: exact parity needs the splats drawn in a layer blended in sRGB and converted once.

## Upstream

- `c489301cf5` (#34925) Examples - Linting. Not applicable: whitespace.

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011); it refits to each loaded model as the source does (`fitCameraToSplats`). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34925), not applicable.
