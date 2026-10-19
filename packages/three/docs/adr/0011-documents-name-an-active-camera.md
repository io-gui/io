---
status: accepted
---

# Documents name an active camera; views follow it

A document names the camera its content is meant to be seen through: `Document.activeCamera`, like Blender's scene camera or the camera of USD render settings. A view set with `View.setCameraView()` follows the document: it looks through the shown document's active camera, and through the new document's after a switch. When a document names none, it looks through the first camera in the scene, and shows its own free view when there is no camera. Other views keep their own navigation (ADR-0005) or a scene camera picked by id or name.

The active camera need not be in the scene graph. Most three.js examples never add their camera to the scene, and a presentation camera is not content to pick, frame, export or list. A camera outside the scene is looked through, but not drawn, picked, framed or shown in the scene graph, and no camera helper is drawn for it. A camera the content needs in the scene (a light rides on it, a source adds it) stays there and can be the active camera too.

Before this, the demo host's camera view looked through the first camera found in the scene. That broke when the first camera was machinery: ShadowContact's depth camera under the ground plane, a `CubeCamera`'s faces. It also left the view empty in examples that dropped their source camera, which was most of them.

## Considered Options

- **First scene camera** (the previous rule). It is an accident of scene order, and machinery cameras win.
- **A naming convention** (`Camera`). It is implicit, and loaded files name cameras freely.
- **Only a camera choice per view** (Maya's model panels). The author's intent is lost, nothing is saved with the content, and a document cannot switch cameras itself (an example's `animationView` toggle, cuts on the timeline).
- **Marking machinery cameras** so views skip them. This still says nothing about which camera presents the content.

## Consequences

- `View.getCamera`, `getSourceCamera` and `getWorldPerPixel` take the document, not the scene: a view looks into the document it shows. Input hosts expose `document`.
- Converted examples keep the source's camera as the active camera, outside the scene unless the source adds it, with the aspect of the reference screenshots (400 × 250). The Scene Camera view then reproduces the source's framing. A source's camera switch (`animationView`, an active camera key) becomes a document property that sets `activeCamera`.
- Assigning or editing the active camera reports a `settings` change, so views redraw.
- A camera outside the scene is not serialized with it: the document schema (`document-schema`) stores it.
- Choosing a camera in a view (any scene camera, or a light looked through as a camera) is a view override, like `View.bloom` over `Document.bloom`. The document's active camera stays as it is, so a view can switch back to following it (`view-camera-select` in `three_future_work.plan.md`).
- ADR-0005's planned `lockCameraToView` would move the active camera when navigating a view that follows the document.
