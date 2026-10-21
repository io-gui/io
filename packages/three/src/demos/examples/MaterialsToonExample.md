---
source: webgpu_materials_toon
synced: d94661f706
---

# MaterialsToon

[`webgpu_materials_toon`](https://threejs.org/examples/#webgpu_materials_toon), converted 2026-10-11

## Deviations

- **Dropped:** the toon outline post-processing, which is cosmetic.

## Open

- `document-pipeline`: the source's toon outline pass.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
