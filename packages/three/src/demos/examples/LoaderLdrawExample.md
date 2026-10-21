---
source: webgl_loader_ldraw
synced: d94661f706
---

# LoaderLdraw

[`webgl_loader_ldraw`](https://threejs.org/examples/#webgl_loader_ldraw), converted 2026-10-17 (batch 3)

## Deviations

- **Controls:** `buildingStep` is clamped to `buildingSteps`; the progress bar is dropped.

## Workarounds

- `triage-fragment-node-mrt`: `ConditionalLineMaterial`, a subclass of `LDrawConditionalLineNodeMaterial`, moves its `fragmentNode` to `outputNode`; a `fragmentNode` writes only the first color output, which the TRAA views' MRT pass rejects. **Restore:** `setConditionalLineMaterial( LDrawConditionalLineMaterial )`.

## History

- 2026-10-17: Converted (batch 3) with the workaround. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
