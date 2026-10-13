# @io-gui/three

Three.js integration for Io-Gui with WebGPU viewport and editor configurations.

See [live examples here](https://iogui.dev/io/#path=Demos,Three)

## Overview

```
RenderScheduler (singleton, the only thing that renders)
├── WebGPURenderer (shared default; custom renderers allowed)
├── one requestAnimationFrame loop
└── typed dirty tags per viewport

ThreeViewport (element)
├── CanvasTarget (per viewport)
├── compositor: ViewCompositor
│   ├── pipeline: ViewPipeline ('forward', 'uv', or a registered one such as a PostProcessingPipeline)
│   └── overlays (grid, edit-mode components, selection outline, camera frame, gizmo layer) in one overlay scene
├── inputRouter: InputRouter (gizmos, tool, navigation, selection)
├── componentPicker: the pipeline's, or an ID-buffer picker (edit mode)
└── view: View (object, outlives the element)
    ├── navigation: ViewNavigation (target, rotation, distance, projection, axis view, scene camera)
    ├── kind ('3d' | 'uv'), pipeline, overlays, profile, xray
    └── overscan, clearColor, clearAlpha, toneMapping / toneMappingExposure overrides

ThreeTimeline (element)
├── transport io-buttons (three: icons): start, frame back, play / pause, frame forward, end, loop
└── ThreeTimelineRange (IoGl element): playhead and frame-aligned dividers at any zoom; scrub, zoom, pan

ThreeScenegraph (element, a renderScheduler change listener)
├── ThreeScenegraphItem rows: disclosure triangle, type icon (getObjectIcon), name or <ClassName>, name field
├── disclosure: collapsed objects by uuid (bind to Storage to persist)
└── reveal(object), startRename(object) / endRename(name) (runs object.rename)

Editor (object, one per app)
├── document: Document (switchable at runtime)
│   ├── scene, toneMapping, toneMappingExposure
│   ├── timeline: Timeline (currentTime, duration, frameRate, loop, autoplay, timeNode)
│   ├── onAnimate(delta, time): runs on every change of timeline.currentTime
│   ├── notify(change): queues a typed DocumentChange, drained by renderScheduler each frame
│   └── transact() / begin(): Transaction of invertible patches
├── mode, isPlaying, onAnimate(delta, time), requestRender()
├── selection: SelectionModel (of the active document; objects + component bitsets per domain)
├── operators: OperatorRegistry (run, modal operators, lastCommand; built-ins transform.translate,
│   object.editmode_toggle, mesh.select_mode, object.rename)
└── tools: Registry of ToolDefinitions + activeTools per '<viewKind>:<mode>' (built-in Move tool, not active)

EditorConfigs (configs/*)
└── Property editors for Three.js classes
```

## Elements

### ThreeViewport

WebGPU-powered viewport element for rendering Three.js scenes.

```typescript
type ThreeViewportProps = {
  editor?: Editor; // App object whose active document the viewport shows
  view?: View; // View state and camera; pass one to keep navigation across remounts (default: a perspective view the viewport makes)
  renderer?: WebGPURenderer; // Custom renderer (optional)
  keymap?: Keymap; // Navigation and selection bindings (default: keymaps.default, OrbitControls-like)
};
```

**Key behaviors:**

- Shared WebGPURenderer instance across viewports
- Per-viewport CanvasTarget for independent rendering
- IntersectionObserver for visibility-based rendering
- Automatic resize handling with pixel ratio support
- Drawn by the RenderScheduler only when tagged dirty
- `getViewCamera()` returns the camera it draws and picks with
- Frames an object when its editor dispatches `frame-object` with `{object, overscan?}`
- The camera comes from the view: `view: new View().setAxisView('top')` for an axis view (`'free'` is the default perspective view), or `.setCameraView()` to look through the first scene camera. Pick one of several with `.setCameraView('name:shot')` or `.setCameraView('uuid:<uuid>')`. A scene camera added later (async asset load) is picked up when it appears, then tracked by uuid; until then the view shows its `free` view. Without a uuid, the view looks for the camera again in each document the editor switches to
- All input goes through `viewport.inputRouter` (see Input below)
- Draws through `viewport.compositor`: the view's pipeline, then overlays and `viewport.gizmoLayer` (see Pipelines and Overlays)

**Usage:**

```typescript
import { Register } from "@io-gui/core";
import { ThreeViewport, Editor, EditorProps } from "@io-gui/three";
import { Mesh, BoxGeometry, MeshBasicMaterial } from "three/webgpu";

@Register
class MyEditor extends Editor {
  constructor(args?: EditorProps) {
    super(args);
    this.document.scene.add(
      new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0xff0000 })),
    );
  }
  onAnimate(delta: number, time: number) {
    // Animation logic
  }
}

const viewport = new ThreeViewport({
  editor: new MyEditor({ isPlaying: true }),
});
```

### ThreeTimeline

Playback controls for the timeline of the editor's document: transport buttons (jump to start, previous frame, play / pause, next frame, jump to end, loop), a `ThreeTimelineRange`, and the current time and duration in seconds. It follows `editor.document`, so switching documents shows the new document's timeline. Scrubbing pauses playback until the pointer is released.

```typescript
threeTimeline({ editor });
```

`ThreeTimelineRange` is the scrubbable range on its own, an `IoGl` element showing one `Timeline`:

```typescript
type ThreeTimelineRangeProps = {
  timeline?: Timeline; // the timeline it shows and edits (default: its own)
  viewStart?: number; // time at the left edge, in seconds
  viewEnd?: number; // time at the right edge
};
```

- One shader draws the range, the playhead and three levels of dividers; positions are computed in double precision on the CPU, so long timelines stay exact
- Divider steps are frame counts that divide a second, then 1, 2, 5, 10, 15 and 30 seconds, minutes and hours; each level lands on the finer one. Labels on major dividers: `1.5`, `2+05` (seconds and frames), `1:30`
- Drag scrubs, snapped to frames (`scrubbing` is true meanwhile); the wheel zooms around the pointer; horizontal wheel or Shift+wheel pans; arrow keys step frames (Shift: ten), Home and End jump
- The view refits when the timeline or its duration changes

The transport icons are registered in the `three` icon namespace (`three:play`, `three:pause`, `three:skip_start`, `three:skip_end`, `three:frame_back`, `three:frame_forward`, `three:loop`) when the package loads.

### ThreeScenegraph

A collapsible tree of the scene of the editor's document. Each row shows the object's type icon and its name, or `<ClassName>` when it has none. The whole tree starts expanded.

```typescript
import { Storage } from '@io-gui/core';

threeScenegraph({
  editor,
  // Optional: keep what is collapsed across reloads, by object uuid.
  disclosure: Storage<Record<string, boolean>>({ key: 'three-scenegraph-disclosure', storage: 'local', value: {} }),
});
```

- Rows highlight the editor's selection, the active object strongest. Clicking a row selects its object the way a viewport click does (Shift toggles, Ctrl removes); clicking its triangle collapses or expands it
- A new active object, selected anywhere (a viewport click, box select, another document), is revealed: its collapsed ancestors expand and its row scrolls into view. `reveal(object)` does the same on request
- Double-click a row, or press F2, to rename its object: Enter or leaving the field applies the name through the `object.rename` operator (one transaction, recorded as the last command), Escape cancels. `startRename(object)` / `endRename(name | null)` do the same from code
- Keys: Up / Down / Home / End move between rows; Right expands, then moves to the first child; Left collapses, then moves to the parent; Enter or Space selects; F2 renames
- Deep or long rows make the tree scroll horizontally rather than cut their names
- `disclosure` holds only collapsed objects, `{[uuid]: false}`, and keeps the 1000 most recent entries (`DISCLOSURE_LIMIT`). Objects that get new uuids on every load (most examples) start expanded again after a reload
- It follows `editor.document` and refreshes on the document's `structure` changes and renames. Content added outside transactions, such as a model loaded asynchronously, must be reported with `notify({kind: 'structure'})`, as for viewports
- `isExpanded(object)` / `setExpanded(object, expanded)` read and change disclosure

Icons come from `getObjectIcon(object)`: the icon of the nearest class in the object's prototype chain with one registered. Every `Object3D` class in three.js has one in the `three` namespace (`three:mesh`, `three:skinned_mesh`, `three:spot_light`, `three:grid_helper`, ...). Register icons for your own classes:

```typescript
registerObjectIcon(Character, 'app:character'); // Character and its subclasses
```

## Objects

### Editor and Document

The app object and its content ([ADR-0002](./docs/adr/0002-app-view-frame-layers.md)). Viewports show `editor.document`; assigning a new document switches every viewport, and each view remembers its camera per document. A view seeing a document for the first time keeps its axis view (top, front, ...) and frames the new scene.

```typescript
const editor = new Editor({ isPlaying: false });
editor.document.scene.add(mesh);
threeViewport({ editor });

editor.document = new Document(); // switch; switching back restores each view's camera
```

**Lifecycle methods** (override in a subclass):

| Method                            | Description                          |
| --------------------------------- | ------------------------------------ |
| `onRendererInitialized(renderer)` | Called when WebGPU renderer is ready |
| `onAnimate(delta, time)`          | Called each frame while `isPlaying`, on the scheduler clock |

A `Document` subclass has its own `onRendererInitialized(renderer)`. It runs once per renderer, before that renderer first draws the document, including for a document opened after the renderer was ready. GPU setup that belongs to the content, such as a compute pass that fills a texture, goes there, so the document works in any editor.

Its `onAnimate(delta, time)` runs on every change of `document.timeline.currentTime`: each frame while the editor plays (after the editor's own `onAnimate`), and whenever the timeline is scrubbed, stepped or set. `time` is the timeline's current time and `delta` the change, negative when time goes back (scrubbing back, a loop wrap). Derive time-driven state from `time`; advance what can only integrate, such as an `AnimationMixer`, by `delta`.

### Timeline

A document's clock, `document.timeline`: `currentTime` within `[0, duration]` seconds, the `frameRate` of frame stepping and scrubbing (playback itself is continuous, paced by the display), `loop` (wrap at the end or stop there), and `autoplay`. The editor does not read `autoplay`; whatever opens the document sets `editor.isPlaying = document.timeline.autoplay`. While playing, the editor advances the timeline by each frame's delta; a timeline that stops at its end pauses the editor, and playing it again starts from the beginning.

```typescript
class SpinDocument extends Document {
  mesh = new Mesh(new BoxGeometry(), new MeshNormalMaterial());
  constructor(args?: DocumentProps) {
    super({ timeline: new Timeline({ autoplay: true, duration: 20 }), ...args });
    this.scene.add(this.mesh);
  }
  override onAnimate(delta: number, time: number) {
    this.mesh.rotation.y = (time / 20) * Math.PI * 2; // time-driven: scrubs and loops seamlessly
    // A mixer can only integrate: this.mixer.update(delta)
  }
}

document.timeline.stepFrames(1); // next frame
document.timeline.currentTime = 0; // runs onAnimate(-previousTime, 0)
```

`timeline.timeNode` is `currentTime` as a TSL uniform. Shader animation built on it pauses and scrubs with the timeline; TSL's global `time` keeps running while paused:

```typescript
this.scene.backgroundNode = hue(color(0x66bbff), this.timeline.timeNode.mul(0.1));
```

**Edits go through transactions** of invertible patches ([ADR-0008](./docs/adr/0008-commands-transactions-and-patches.md)). Edits apply immediately and redraw the views; the old values are recorded, so a transaction can be rolled back, reverted or re-applied. Writes to the same path coalesce. `set` assigns a property (assigning a read-only one such as `position` throws); `copy` copies into the object a property holds, keeping its identity.

```typescript
editor.document.transact((tx) => {
  tx.copy(mesh, "position", new Vector3(1, 2, 3)); // copies into mesh.position (read-only in Three.js)
  tx.set(mesh.uuid, "material", material); // assigns; undo restores the previous material itself
  tx.insert(group, mesh, 0);
}, "Move mesh");

const drag = editor.document.begin("Drag"); // long-running: commit() or rollback()
```

The undo stack and multi-user sync are planned on top of `document.history`, `revert()` / `reapply()` and the document's `commit` event (`detail` is the transaction).

### Operators

One action, one transaction. `exec` for instant actions; `invoke` returning `'running'` plus `modal` for interactive ones, which then receive every event in the viewport (Escape cancels and rolls back).

```typescript
editor.operators.register({ id: "object.hide", label: "Hide", create: (props) => ({
  exec: (ctx) => { ctx.transaction.set(props.id as string, "visible", false); return "finished"; },
}) });
editor.operators.run("object.hide", { id: mesh.uuid });
editor.operators.run("object.slide", {}, { host: viewport, event }); // modal in that viewport
editor.operators.lastCommand; // { name: "object.hide", args: {...} }
```

Built in: `transform.translate` moves the selected objects (objects with a selected ancestor move with it, once). Interactive runs are modal: drag along an axis or in the view plane, X / Y / Z switch the axis constraint (again to release it), release or Enter confirms, Escape or right click cancels. A finished run records `{axis, delta}` as its command, and `exec` applies a `delta` directly:

```typescript
editor.operators.run("transform.translate", { delta: [1, 0, 0] }); // repeat without a viewport
```

`object.rename` sets an object's name, `{id, name}`; a run that keeps the name is cancelled and records nothing. The scene graph renames through it.

```typescript
editor.operators.run("object.rename", { id: mesh.uuid, name: "Crate" });
```

### Tools

A tool is a definition registered on the editor and active per view kind + mode. Each viewport whose view `profile` allows it gets its own behaviors from `createBehaviors`.

```typescript
editor.tools.register({ id: "slide", label: "Slide", viewKinds: ["3d"], modes: ["object"],
  createBehaviors: ({ editor, host }) => [mySlideBehavior(editor, host)] });
editor.setActiveTool("3d", "object", "slide");
viewport.view.profile = "navigate"; // 'full' | 'select' | 'navigate' | 'none'
```

Tools can also show gizmos with `createGizmoGroups`. The built-in Move tool (`transform.translate`) shows the translate gizmo on the selection: X / Y / Z arrows and a center handle for the view plane, at the median of the selected objects and at a constant screen size. Pressing a handle runs the `transform.translate` operator modally, so the gizmo, navigation and click selection share the viewport:

```typescript
editor.setActiveTool("3d", "object", "transform.translate");
```

A gizmo group (`GizmoGroup`, after Blender's gizmo group types) has `poll` (show it in this view?), `refresh` (follow the selection), `drawPrepare` (follow the camera) and `gizmos`. Each `Gizmo` has an `object` drawn as an overlay, a screen-space `hitTest(ctx, x, y)` in pixels, a `highlight` flag and `invoke(ctx, event)`, which starts an operator. Each viewport's `GizmoLayer` hit-tests them in the gizmo band of its router; hovering redraws only overlays. Gizmos need the `full` profile and can be hidden with `view.setOverlay("gizmos", false)`.

### Selection

`editor.selection` is the selection of the active document ([ADR-0007](./docs/adr/0007-selection-by-object-id-and-attribute-domain.md)). It is session state: each document keeps its own, and it never syncs to other users. It stores object uuids and an active object; one committed edit bumps `version` once and sends one `'selection'` change. Objects removed through transactions leave the selection.

```typescript
editor.selection.set([a.uuid, b.uuid]); // b becomes active
editor.selection.edit().toggle(c.uuid).remove(a.uuid).commit();
editor.selection.getObjects(); // objects still in the document
editor.selection.getActiveObject();
```

Bind UI to `selection.active` / `selection.version`. Viewports with profile `full` or `select` install a `SelectBehavior`:

| Action | default | blender | maya |
| --- | --- | --- | --- |
| Select (click; Shift toggles, Ctrl removes) | LMB click | LMB click | LMB click |
| Box select | Alt+LMB drag | LMB drag (Shift extend, Ctrl subtract) | LMB drag (Shift toggle, Ctrl subtract) |
| All / none / invert | Ctrl+A / Escape / - | A / Alt+A / Ctrl+I | - / - / Ctrl+Shift+I |
| Frame selected | F | Numpad . | F |

Clicks are presses that moved less than `CLICK_TOLERANCE` (4 px); the router offers them after any drag binding on the same button, so LMB can both orbit and select. Presses that start a modal operator (a gizmo drag) are never clicks. Selected objects are outlined in 3D views (active brighter); selection changes redraw only overlays. Picking goes through the async `Picker` interface; `RaycastPicker` is the default (box select tests projected bounds). Mark helpers with `object.userData.selectable = false` to keep them out of picking.

### Edit Mode and Components

Tab (every keymap preset) runs `object.editmode_toggle`: the editor's `mode` becomes `'edit'` and the selected meshes, line segments and point clouds (and their descendants) form the edit set. The same select bindings then select components; 1 / 2 / 3 run `mesh.select_mode` to switch between points, edges and faces. Switching converts the selection like Blender: going down (faces → edges → points) keeps everything touched, going up keeps elements whose points are all selected.

Components are stored per object per domain as bitsets (`ComponentSet`), inside the same `SelectionModel` and the same `edit()` transactions:

```typescript
const edit = editor.selection.edit();
edit.components(mesh.uuid, "point", topology.pointCount).add(0).add(3);
edit.setDomain("point").commit();
editor.selection.getComponents(mesh.uuid, "point")?.toArray(); // [0, 3]
```

Domains come from a cached topology per `BufferGeometry` (`getTopology(geometry, kind)`): `point` welds vertices with identical positions (`BoxGeometry` has 24 vertices, 8 points), `edge` is a unique point pair, `primitive` is a triangle (or a line segment), `corner` is a triangle corner (where UVs live). Indices are valid for one topology; sets made for another size are ignored and replaced. Quads are two triangles: their diagonals are edges. A `GeometryAdapter` per object type (`MeshAdapter`, `LineSegmentsAdapter`, `PointsAdapter`; `registerGeometryAdapter` for more) provides domains, sizes, element positions and the triangles for the ID pass.

Picking in 3D views (`IdComponentPicker`) draws an ID buffer: the edit set's triangles carrying their index, every other visible mesh as an occluder, with view depth, at CSS-pixel size, read back once and cached until the camera, size, edit set or content changes. Faces come from the buffer (front-most under the pointer); points and edges are projected on the CPU within 10 px and kept only where the buffer's depth shows them. With `view.xray = true` nothing is occluded. Deformation (skinning, morph targets) is not applied: components are picked on the rest shape. The `components` overlay draws the wire, points (point mode) and selected faces of the edit set; the selection outline is hidden in edit mode.

### View

Serializable state of one view ([ADR-0002](./docs/adr/0002-app-view-frame-layers.md), [ADR-0005](./docs/adr/0005-navigation-is-view-state-camera-built-per-draw.md)). Navigation is stored as numbers in `view.navigation`; the camera is built from it for each draw and pick.

```typescript
const view = new View({ overscan: 1.1, clearColor: 0x000000 });
view.setAxisView("top"); // orthographic axis view, or "free" for the perspective view (leaves any scene camera)
view.setCameraView(`uuid:${sceneCamera.uuid}`); // look through a scene camera (never mutated); 'name:<name>' also works, no id = first scene camera
view.frame(object); // fit an object
view.getCamera(width, height, scene); // camera for this size
view.toJSON(); // persist with a layout; restore with applyJSON()

threeViewport({ editor, view }); // the view survives the element being remounted
```

**Key behaviors:**

- Viewport aspect and overscan are applied at draw time, never stored
- Scene cameras are copied, never mutated
- A new view frames its scene once; restored views keep their navigation
- After changing `view.navigation` directly, call `view.markNavigationChanged()`. It dispatches `navigation-changed` to the view's parents (its viewports) and is not a reactive mutation; listen to that event to follow camera moves
- Navigation is done by the viewport's `NavigationBehavior`, which edits `view.navigation`

### Pipelines and Overlays

Each view draws through a `ViewPipeline` and then `Overlay`s ([ADR-0006](./docs/adr/0006-content-scene-holds-only-content.md)). The content scene holds only content: grids, outlines, camera frames, helpers and gizmos live in a per-viewport overlay scene.

- A **pipeline** draws the content into its own target in linear color (`output.color`, plus `output.depth` when it has one). It runs only when content, navigation or size changed, or while it reports `{converged: false}`.
- The viewport then **presents** that output to its canvas in one pass with the overlays, writing the pipeline's depth so overlays can be hidden behind content. Tone mapping is applied here: `view.toneMapping` if set, else the pipeline's, else the document's.
- Changes that only affect overlays (selection, gizmo hover) skip the pipeline and reuse its output.

```typescript
new View({ pipeline: "traa" }); // a registered pipeline; '' uses the kind's default ('forward' / 'uv')
view.setOverlay("grid", true); // every overlay is off until the view turns it on
view.toneMapping = NoToneMapping; // per-view override; null uses the document's

pipelineTypes.register({ id: "traa", create: (renderer) => new PostProcessingPipeline(renderer, (scenePass, camera) => {
  scenePass.setMRT(mrt({ output, velocity }));
  return traa(scenePass.getTextureNode("output"), scenePass.getTextureNode("depth"), scenePass.getTextureNode("velocity"), camera);
}, { convergeFrames: 32 }) }); // accumulates for 32 frames after each change, then stops drawing
```

Custom pipelines implement `ViewPipeline` (`output`, `setSize`, `render(ctx)`, optional `toneMapping`, `picker`, `listens`) or extend `RenderTargetPipeline`. Custom overlays implement `Overlay` (`root`, `prepare(ctx)`, `dispose`) and are registered with `overlayTypes.register({id, viewKinds, create})`. Overlay ids are typed (`OverlayId`, the keys of `ViewOverlays`), so a custom overlay declares its flag first: `declare module '@io-gui/three' { interface ViewOverlays { heatmap?: boolean } }`. Full-screen overlays use `createScreenQuad(material)`.

All overlays are off by default; a view lists the ones it draws (`new View({overlays: {grid: true, selection: true, gizmos: true}})`), whatever its kind. An overlay's `viewKinds` only says which kinds it is made for: turning it on in another kind still creates it, and warns in debug builds.

| Overlay | |
| --- | --- |
| `grid` | Floor grid with axes; on the plane facing axis views; spacing follows zoom |
| `components` | Edit mode: wire, points and selected faces of the edit set |
| `selection` | Outline of selected meshes and lines (mask of proxies sharing their geometry) |
| `cameraFrame` | Darkens what lies outside a scene camera's frame when looking through it |
| `cameraHelpers` | Frustum of each shown scene camera, except the one the view looks through |
| `lightHelpers` | Point, directional and hemisphere light icons at a constant screen size; spot cones and rect area panels at their real size |
| `skeletonHelpers` | Bones of each shown skeleton, also while its meshes are hidden |
| `gizmos` | The active tool's gizmos (`full` profile only) |

Helper overlays (`HelperOverlay` with a `HelperKind`) draw three.js helpers for content objects without adding them to the scene, so they are not exported, framed or picked. Helpers of selected objects take the outline colors.

### UV View

A view with `kind: 'uv'` shows the UV layout of the selected meshes (the edit set) over the 0–1 grid, with the active object's color texture behind it, active brighter. It uses the `uv` pipeline, which never draws the content scene. Navigation is 2D (orbit gestures pan; frame keys show the UV square). Picking hits the layouts and selects their meshes, so a `select` profile UV view works as a selection view.

```typescript
threeViewport({ editor, view: new View({ kind: "uv", profile: "select" }) });
```

In edit mode the UV view edits UVs (`UVComponentPicker`, on the CPU in UV space). With `selection.uvSync` off (default, like Blender) it shows only the faces selected in 3D and keeps its own `corner` selection: a UV vertex selects every shown corner of one buffer vertex, a face its three corners. With `uvSync` on it shows every face and picks map to the mesh's points, edges and faces, so both views select the same components.

## Input

Each viewport has one `InputRouter` ([ADR-0004](./docs/adr/0004-input-arbitrated-by-priority-capture-router.md)). It owns the viewport's pointer, wheel and context-menu listeners and pointer capture, and offers events to `Behavior`s in priority order: the first whose `wantsCapture(event)` returns true owns the pointer stream until release. Only captured events are `preventDefault`ed and stopped. Key events go to the viewport under the pointer, else to the focused one.

| Band | Priority | Today |
| --- | --- | --- |
| Modal operator | 1000 | Running modal operators (`transform.translate`) |
| Gizmos | 800 | `GizmoLayer` (active tool's gizmo groups) |
| Tool | 500 | Behaviors of the editor's active tool |
| Navigation | 300 | `NavigationBehavior` |
| Fallback selection | 100 | `SelectBehavior` (objects; components in edit mode; Tab, 1 / 2 / 3) |

**Navigation** (and selection) is driven by a keymap (data); `keymaps.default | blender | maya` combine both. Navigation alone: `navigationKeymaps.default` (OrbitControls-like: LMB orbit, RMB / Shift+LMB pan, MMB dolly, wheel zoom, Home frame all), `.blender` (MMB orbit, Shift+MMB pan, Ctrl+MMB dolly, numpad axis views) and `.maya` (Alt+LMB/MMB/RMB). Two-finger touch pans and pinch-dollies. Axis views pan instead of orbit. Navigation is off while looking through a scene camera.

```typescript
threeViewport({ editor, keymap: keymaps.blender });
const keymap = Keymap.layer(myBindings, navigationKeymaps.default); // first match wins
```

**Tools**: a tool definition (`editor.tools.register({id, viewKinds, modes, createBehaviors, createGizmoGroups?})`) gives each viewport its behaviors at tool priority while it is active (`editor.setActiveTool(viewKind, mode, id)`).

## Editor Configurations

The package includes `EditorConfig` and `EditorGroups` for most Three.js classes, enabling automatic property inspection via `IoPropertyEditor`, `IoObject` or `IoInspector`.

### Custom Configuration

Extend or override configurations for your classes:

```typescript
import { registerEditorConfig, registerEditorGroups } from "@io-gui/editors";
import { MyCustomObject } from "./MyCustomObject";

registerEditorConfig(MyCustomObject, [
  ["speed", ioNumberSlider({ min: 0, max: 100 })],
  ["color", ioColorPicker()],
]);

registerEditorGroups(MyCustomObject, {
  Main: ["speed", "color"],
  Hidden: ["_internalState"],
});
```

## Render Loop

`renderScheduler` runs one `requestAnimationFrame` loop and is the only code that renders ([ADR-0003](./docs/adr/0003-redraw-is-a-dirty-tag-consumed-by-one-scheduler.md)). Viewports never draw on their own; they are tagged dirty and drawn on the next frame.

```typescript
editor.isPlaying = true; // advances the document timeline every frame, redraws its viewports
editor.isPlaying = false;

editor.requestRender(); // redraw viewports showing the active document once
editor.notify({kind: 'transform', ids: [mesh.uuid]}); // same, with a typed change
```

**Each frame:**

1. Tick playing editors (one shared three.js `Timer`): the editor's `onAnimate(delta, time)`, then advance its document's timeline by `delta`, which runs the document's `onAnimate`.
2. Drain the changes queued on each shown document; tag viewports whose `listens(change)` is true, then hand the drained changes to the document's change listeners (`renderScheduler.addListener({document, onDocumentChanges})`), UI that follows a document without drawing it, such as `ThreeScenegraph`.
3. Update each scene's world matrices once, then draw tagged, visible viewports in priority order (focused, hovered, other) within a frame budget (`renderScheduler.frameBudget`, 12 ms). Views not reached draw next frame. A view tagged only `overlay` presents its cached pipeline output with fresh overlays.

Plain Three.js edits made outside `onAnimate` must call `editor.requestRender()` (or `viewport.tag('content')`), or nothing redraws.

## Edge Cases

### WebGPU Only

The package requires WebGPU ([ADR-0001](./docs/adr/0001-webgpu-only-one-renderer-canvas-target-per-viewport.md)). If a renderer ends up on a non-WebGPU backend, its viewports show an error message instead of rendering.

### Shared Renderer

All `ThreeViewport` instances share a single `WebGPURenderer` by default (`getDefaultRenderer()`). Tone mapping, exposure, clear color and render target are set for every draw by the viewport's compositor; nothing should rely on them between draws. A viewport may be given its own `renderer` for renderer-level options such as `logarithmicDepthBuffer`; GPU resources are then not shared with other renderers.

### Visibility Optimization

Viewports not intersecting the viewport (scrolled out of view) skip rendering entirely. The `visible` property tracks this state.

### Renderer Initialization

The renderer initializes asynchronously. The scheduler initializes each renderer once and draws its viewports when it is ready. Editors get `onRendererInitialized(renderer)` before their first draw, and documents get it once per renderer before it first draws them. Renderer-dependent setup goes there.

### Dispose Cleanup

Disposing a viewport unregisters it from the scheduler, disposes its CanvasTarget and the view it created (a view passed in is not disposed), and unregisters its tool. The renderer (shared or custom) is never disposed by the viewport.

## Packaging

Published `dist/index.js` is a bundled ES module. All `@io-gui/*` packages and `three` (including `three/webgpu`, `three/tsl`, and `three/addons`) are peer dependencies and stay external — install them alongside this package. The bundle does not inline Three.js.
