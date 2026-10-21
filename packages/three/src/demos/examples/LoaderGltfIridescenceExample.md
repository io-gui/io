---
source: webgpu_loader_gltf_iridescence
synced: d94661f706
---

# LoaderGltfIridescence

[`webgpu_loader_gltf_iridescence`](https://threejs.org/examples/#webgpu_loader_gltf_iridescence), converted 2026-10-11

## Deviations

- **Camera:** the active camera stands where the source's auto-rotation starts.

## History

- 2026-10-11: Converted, with the camera's auto-rotation dropped. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its auto-rotation starts. Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-20: Checked: `transmission-views` does not reproduce; playing in four views while the window resizes logs no errors.
