---
source: webgpu_shadowmap
synced: d94661f706
---

# Shadowmap

[`webgpu_shadowmap`](https://threejs.org/examples/#webgpu_shadowmap), converted 2026-10-11

## Deviations

None.

## Open

- `framing-scenery`: the 600-unit ground dwarfs the knot in first-show framing; with the 50 to 100 fog the perspective view opens on fog color.

## History

- 2026-10-11: Converted, with the source's camera kept as a scene camera. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
