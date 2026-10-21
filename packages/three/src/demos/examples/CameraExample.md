---
source: webgpu_camera
synced: d94661f706
---

# Camera

[`webgpu_camera`](https://threejs.org/examples/#webgpu_camera), converted 2026-10-10

## Deviations

- **Cameras:** the active camera is the source's overview, its right half (aspect `0.5 * 400 / 250`). The rig's perspective and orthographic cameras, which the source shows in its left half and switches with O and P, are scene cameras to look through, both updated every frame.
- **Controls:** the two cameras' projections are in the Document tab.

## Open

- `inspector-refresh`: the Document tab follows the cameras' matrices through a debug-only `dispatchMutation` in `onAnimate`, which bundles strip.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless).
- 2026-10-13: Changed: the frustums come from the camera helpers overlay, which skips the camera a view looks through (`camera-helper-view`); the authored `CameraHelper`s are gone.
- 2026-10-19: Changed: the active camera is the source's overview (ADR-0011); the rig's cameras stay scene cameras. Checked: the Scene Camera view against `examples/screenshots`.
