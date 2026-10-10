# Three

The `@io-gui/three` context: WebGPU Three.js viewports wired into Io-Gui's reactive graph. A ThreeEditor owns the document and lifecycle; IoThreeViewport shows it through a per-viewport canvas target, a pipeline and overlays; the RenderScheduler is the only thing that renders. WebGPU only. Architecture decisions: `docs/adr/`. Math editor elements and side-effect EditorConfigs integrate Three types with `@io-gui/editors`.

## Language

**ThreeEditor**:
The app object: one active ThreeDocument (switchable at runtime), editor mode, playback, operators and tools. Viewports read `editor.document`.
_Avoid_: app, scene controller, applet (removed `ThreeApplet`)

**ThreeDocument**:
The content of an editor: the scene of authored objects plus scene render settings. Edited through transactions.
_Avoid_: model, project, file

**Transaction**:
One atomic group of patches: the unit of undo, change notification and sync. Applies edits immediately and records old values.
_Avoid_: change set, batch, command (a command is the intent that runs one)

**Patch**:
The smallest invertible edit, addressed by object uuid: `set` (assign a property path), `copy` (copy into the object a path holds, such as `position`), `insert`, `remove`.
_Avoid_: diff, delta, mutation (core term)

**Operator**:
One action with one transaction (`exec`, or `invoke` + `modal` for interactive ones). Tools and gizmos start operators; they never edit the document themselves.
_Avoid_: action handler, command (the operator's serializable equivalent)

**Command**:
A finished operator run as name + serializable arguments, for repeat, journal and macros (`operators.lastCommand`).
_Avoid_: operator (the runnable thing)

**Tool (ToolDefinition)**:
A persistent mode of interaction registered on the editor, active per view kind + mode; creates behaviors per viewport.
_Avoid_: ToolBase (removed), manipulator

**SelectionModel**:
Session selection of one document: object uuids, the active object, the select domain, component sets per object per domain, a `version` bumped once per committed edit. Owned by the editor per document; never document data.
_Avoid_: selected list, selection set (as the type name)

**Picker**:
Async "what is under the pointer" for a view: `pick` and `pickRect`. `RaycastPicker` for objects; a BVH picker later. Components use a **ComponentPicker** (ID buffer in 3D, CPU in UV space).
_Avoid_: raycaster (as the concept), hit tester

**Domain**:
A selection level: `object`, `point` (welded position), `edge` (unique point pair), `primitive` (triangle or segment), `corner` (triangle corner, where UVs live). The select mode is `selection.domain`.
_Avoid_: vertex (for a welded point; a vertex is a buffer vertex), face (in code; say primitive), component type

**ComponentSet**:
Bitset of selected elements of one domain of one object, sized for one topology.
_Avoid_: index list, selection mask

**Topology**:
Derived connectivity of a `BufferGeometry` (welded points, edges, primitives, corners), cached and rebuilt when positions or the index change.
_Avoid_: mesh data, half-edge (there is none)

**GeometryAdapter**:
Component access for one kind of object (mesh, line segments, points): domains, sizes, element positions, ID-pass triangles.
_Avoid_: mesh wrapper

**ID buffer / ID pass**:
Offscreen float target where each pixel holds edit object slot, primitive index and view depth; read back once per camera/content state for component picking and occlusion.
_Avoid_: GPU picking (alone), color picking

**Edit mode**:
`editor.mode === 'edit'`: the edit set's components are selected instead of objects. Entered with `object.editmode_toggle` (Tab).
_Avoid_: component mode

**uvSync**:
UV view option: on, UV picks select mesh points/edges/faces; off, the UV view keeps its own corner selection over the faces selected in 3D.
_Avoid_: sticky selection

**Click**:
A press and release that moved less than `CLICK_TOLERANCE`; synthesized by the InputRouter after any capture of that press, so click bindings share a button with drag bindings.
_Avoid_: tap, tweak

**Interaction profile**:
`ThreeView.profile`: what a viewport's router installs — `full`, `select`, `navigate`, `none`.
_Avoid_: view mode, read-only

**CanvasTarget**:
Per-viewport render surface the shared renderer draws into. Each `IoThreeViewport` has its own; viewports do not share canvases.
_Avoid_: canvas, framebuffer (as the Io-Gui term)

**Shared renderer**:
The single default `WebGPURenderer` (`getDefaultRenderer()`) reused across viewports and initialized once by the scheduler. Renderer state (tone mapping, clear color, target) is set by each viewport's compositor per draw; a custom renderer may be passed in for renderer-level options. Viewports never dispose the renderer.
_Avoid_: global GL context, IoGl (core 2D shader quad)

**RenderScheduler**:
The singleton that owns the render loop and is the only code that renders. Draws tagged, visible viewports once per frame within a frame budget.
_Avoid_: render loop (as a class name), animation loop

**Dirty tag**:
A typed reason (`content`, `view`, `overlay`, `resize`, `continuous`) that marks a viewport for redraw on the next frame. Tagging never draws.
_Avoid_: needs-render, invalidate

**ChangeBus**:
Per-document queue of typed `DocumentChange`s, drained by the scheduler each frame to tag the viewports that listen to them.
_Avoid_: notifier, event bus

**Playing**:
`ThreeEditor.isPlaying`: whether the scheduler ticks the editor and its active document (`onAnimate(delta, time)`) each frame. Independently, non-visible viewports skip draws via IntersectionObserver.
_Avoid_: animating, running, live

**ThreeView**:
Serializable ReactiveObject holding one view's state: kind, pipeline, overlay flags, profile, navigation, overscan, clear color and tone-mapping overrides. Shown by an IoThreeViewport and outlives it.
_Avoid_: viewport state, ViewCameras (removed)

**View kind**:
`ThreeView.kind`: `3d` (shows the content scene) or `uv` (shows the UV layout of the edit set in 2D). Picks the default pipeline, overlays, gizmos and tools.
_Avoid_: view type, editor type

**ViewPipeline**:
How one view draws its content (forward, post-processed, UV, ...), into its own target in linear color with optional depth. Registered by id; created per viewport; runs only when content, navigation or size changed, or while not converged.
_Avoid_: renderer (the shared WebGPURenderer), render pass, effect composer

**ViewCompositor**:
Per-viewport owner of the pipeline and overlays. Presents the pipeline output to the canvas in one pass with the overlay scene, applying tone mapping; overlay-only redraws reuse the cached output.
_Avoid_: post-processing (that is a pipeline), output pass

**Overlay**:
Something a view draws on top of its pipeline output from its own small scene, never the content scene: grid, selection outline, camera frame (passepartout), gizmos. Switched per view in `ThreeView.overlays`.
_Avoid_: helper (three.js objects added to the scene), decoration

**Edit set**:
The objects edit mode and the UV view work on: selected objects and their descendants that have a geometry adapter.
_Avoid_: active objects, target set

**Gizmo / GizmoGroup**:
A gizmo is an on-screen handle with a screen-space hit test that starts an operator when pressed; a gizmo group (`poll`, `refresh`, `drawPrepare`) shows related gizmos, usually for the active tool. Each viewport's GizmoLayer is both their overlay and their input behavior.
_Avoid_: manipulator, TransformControls, handle (alone)

**ViewNavigation**:
A view's navigation as numbers: target, rotation, distance, projection, fov, clip range, axis view (`free` or an axis) and an optional scene camera (`cameraSource`, by uuid; `ThreeView.setCameraView()` resolves the first scene camera, or a `name:`, to it once the camera is in the scene, and again in each newly shown document). The draw camera is built from it per frame.
_Avoid_: camera rig, camera controller, orbit state

**Axis view**:
An orthographic view looking along a world axis: `top`, `bottom`, `left`, `right`, `front`, `back`.
_Avoid_: ortho camera, named camera

**InputRouter**:
Per-viewport owner of all DOM input listeners and pointer capture. Offers events to behaviors in priority order; the first to want a press captures its pointer stream.
_Avoid_: input manager, event handler, controls

**Behavior**:
Anything that wants viewport input (modal operators, gizmos, tools, navigation, selection), with a priority band. Implements any of `wantsCapture`, `begin`, `update`, `end`, `cancel` (capture), `hover`, `key` and `click`.
_Avoid_: controller, handler, interaction

**Keymap**:
An ordered table of bindings as data (`'Alt+LMB drag'` -> `'view.orbit'`); first match wins, layering is concatenation.
_Avoid_: shortcuts, hotkeys (as the type name)

**NavigationBehavior**:
The router behavior that turns keymap-bound gestures into ViewNavigation edits (orbit, pan, dolly, zoom, frame, axis views).
_Avoid_: OrbitControls (removed), camera controls

**Editor configs (side-effect)**:
Importing `@io-gui/three` runs config registration so Three.js classes get PropertyConfigs/EditorGroups for inspectors. Opting into the package opts into those registrations.
_Avoid_: three editor plugin, manual register list (as the default path)
