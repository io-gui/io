---
status: accepted
---

# Navigation is view state; the draw camera is built per frame

Each `ThreeView` stores navigation as numbers, modelled on Blender's `RegionView3D`: `target` (orbit pivot), `rotation`, `distance`, `projection`, `fov`, `axisView`, `cameraSource` (a scene camera by object id) and `lockCameraToView`. At draw and pick time the view builds a private camera from this state, the viewport size and the overscan. Scene cameras are never mutated to fit a viewport.

Before this, `ViewCameras` kept seven `Camera` objects plus `OrbitControls`. Overscan changed the active camera's projection during draw and raycast and then restored it, so a scene camera shown in a viewport was briefly mutated where inspectors and other viewports could see it. Scene cameras were picked by name (`cameraSelect = 'scene:<name>'`), which breaks on duplicates and renames.

## Consequences

- Looking through a scene camera with a different aspect draws a passepartout overlay instead of changing the camera's aspect.
- With `lockCameraToView`, navigating moves the real camera object through an undoable operator that notifies the document.
- Orbit, pan, dolly, fly, frame selected and axis snap change only this view's state and tag only this view (`view` reason).
- 2D view kinds (`uv`, `image`) use the same state limited to pan and zoom with a fixed orthographic projection.
- Views can be linked through a `lockGroup` (quad-view style ortho views sharing pivot and zoom).
- The `frameObject` and `clipPlanesFromBox` maths carry over unchanged.
