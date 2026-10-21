---
source: webgpu_lights_rectarealight
synced: d94661f706
tags: [stand-in-framing]
---

# LightsRectarealight

[`webgpu_lights_rectarealight`](https://threejs.org/examples/#webgpu_lights_rectarealight), converted 2026-10-11

## Deviations

- **Panels:** the glowing light panels are the light helpers overlay, which the Scene Camera view does not draw (Open).

## Open

- `scene-camera-helpers`: the Scene Camera view lacks the light panels the source shows.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-13: Changed: the light panels come from the light helpers overlay.
- 2026-10-19: Fixed: views framed the 2000-unit floor (`framing-scenery`); they frame a stand-in for the knot and the turning panels (`getEditorFrameTarget`, ADR-0012).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
