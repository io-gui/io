# Three

The `@io-gui/three` context: WebGPU Three.js viewports wired into Io-Gui's reactive graph. A ThreeApplet owns the scene and lifecycle; IoThreeViewport shows it through a per-viewport canvas target; the RenderScheduler is the only thing that renders. WebGPU only. Architecture decisions: `docs/adr/`. Math editor elements and side-effect EditorConfigs integrate Three types with `@io-gui/editors`.

## Language

**ThreeEditor**:
The app object: one active ThreeDocument (switchable at runtime), editor mode, playback, operators and tools. Viewports read `editor.document`.
_Avoid_: app, scene controller, ThreeApplet (for new code)

**ThreeDocument**:
The content of an editor: the scene of authored objects plus scene render settings. Edited through transactions.
_Avoid_: model, project, file

**Transaction**:
One atomic group of patches: the unit of undo, change notification and sync. Applies edits immediately and records old values.
_Avoid_: change set, batch, command (a command is the intent that runs one)

**Patch**:
The smallest invertible edit, addressed by object uuid: `set` (property path), `insert`, `remove`.
_Avoid_: diff, delta, mutation (core term)

**Operator**:
One action with one transaction (`exec`, or `invoke` + `modal` for interactive ones). Tools and gizmos start operators; they never edit the document themselves.
_Avoid_: action handler, command (the operator's serializable equivalent)

**Command**:
A finished operator run as name + serializable arguments, for repeat, journal and macros (`operators.lastCommand`).
_Avoid_: operator (the runnable thing)

**Tool (ToolDefinition)**:
A persistent mode of interaction registered on the editor, active per view kind + mode; creates behaviors per viewport.
_Avoid_: ToolBase (legacy adapter), manipulator

**SelectionModel**:
Session selection of one document: object uuids, the active object, the select domain, a `version` bumped once per committed edit. Owned by the editor per document; never document data.
_Avoid_: selected list, selection set (as the type name)

**Picker**:
Async "what is under the pointer" for a view: `pick` and `pickRect`. `RaycastPicker` now; BVH and ID-buffer pickers later.
_Avoid_: raycaster (as the concept), hit tester

**Click**:
A press and release that moved less than `CLICK_TOLERANCE`; synthesized by the InputRouter after any capture of that press, so click bindings share a button with drag bindings.
_Avoid_: tap, tweak

**Interaction profile**:
`ThreeView.profile`: what a viewport's router installs — `full`, `select`, `navigate`, `none`.
_Avoid_: view mode, read-only

**ThreeApplet**:
Compatibility shim: a ThreeEditor with one document whose scene and tone-mapping props are bound to the document.
_Avoid_: scene controller, demo host

**CanvasTarget**:
Per-viewport render surface the shared renderer draws into. Each `IoThreeViewport` has its own; viewports do not share canvases.
_Avoid_: canvas, framebuffer (as the Io-Gui term)

**Shared renderer**:
The single default `WebGPURenderer` (`getDefaultRenderer()`) reused across viewports and initialized once by the scheduler. Renderer state is reset per viewport draw; a custom renderer may be passed in for renderer-level options. Viewports never dispose the renderer.
_Avoid_: global GL context, IoGl (core 2D shader quad)

**RenderScheduler**:
The singleton that owns the render loop and is the only code that renders. Draws tagged, visible viewports once per frame within a frame budget.
_Avoid_: render loop (as a class name), animation loop

**Dirty tag**:
A typed reason (`content`, `view`, `overlay`, `resize`, `continuous`) that marks a viewport for redraw on the next frame. Tagging never draws.
_Avoid_: needs-render, invalidate

**ChangeBus**:
Per-applet queue of typed `DocumentChange`s, drained by the scheduler each frame to tag the viewports that listen to them.
_Avoid_: notifier, event bus

**Playing**:
`ThreeApplet.isPlaying`: whether the scheduler ticks the applet (`onAnimate(delta, time)`) each frame. Independently, non-visible viewports skip draws via IntersectionObserver.
_Avoid_: animating, running, live

**ThreeView**:
Serializable ReactiveObject holding one view's state: navigation, overscan and clear color. Shown by an IoThreeViewport and outlives it.
_Avoid_: viewport state, ViewCameras (removed)

**ViewNavigation**:
A view's navigation as numbers: target, rotation, distance, projection, fov, clip range, axis view and an optional scene camera (`cameraSource`, by uuid). The draw camera is built from it per frame.
_Avoid_: camera rig, camera controller, orbit state

**Axis view**:
An orthographic view looking along a world axis: `top`, `bottom`, `left`, `right`, `front`, `back`.
_Avoid_: ortho camera, named camera

**InputRouter**:
Per-viewport owner of all DOM input listeners and pointer capture. Offers events to behaviors in priority order; the first to want a press captures its pointer stream.
_Avoid_: input manager, event handler, controls

**Behavior**:
Anything that wants viewport input (navigation, a tool, later gizmos and modal operators), with a priority band. Implements `wantsCapture`, `begin`, `update`, `end`, `cancel`, and optionally `hover`, `key`.
_Avoid_: controller, handler, interaction

**Keymap**:
An ordered table of bindings as data (`'Alt+LMB drag'` -> `'view.orbit'`); first match wins, layering is concatenation.
_Avoid_: shortcuts, hotkeys (as the type name)

**NavigationBehavior**:
The router behavior that turns keymap-bound gestures into ViewNavigation edits (orbit, pan, dolly, zoom, frame, axis views).
_Avoid_: OrbitControls (removed), camera controls

**ToolBase**:
ReactiveObject base for 3D pointer tools. Registers one behavior at tool priority on each viewport's InputRouter and receives Pointer3D rays; `capturesInput` decides what it leaves to navigation.
_Avoid_: manipulator, gizmo controller

**Editor configs (side-effect)**:
Importing `@io-gui/three` runs config registration so Three.js classes get PropertyConfigs/EditorGroups for inspectors. Opting into the package opts into those registrations.
_Avoid_: three editor plugin, manual register list (as the default path)
