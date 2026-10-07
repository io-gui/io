# Three

The `@io-gui/three` context: WebGPU Three.js viewports wired into Io-Gui's reactive graph. A ThreeApplet owns the scene and lifecycle; IoThreeViewport shows it through a per-viewport canvas target; the RenderScheduler is the only thing that renders. WebGPU only. Architecture decisions: `docs/adr/`. Math editor elements and side-effect EditorConfigs integrate Three types with `@io-gui/editors`.

## Language

**ThreeApplet**:
ReactiveObject base for a Three.js application: owns the `Scene`, tone-mapping knobs, the `isPlaying` flag, and lifecycle hooks (`onRendererInitialized`, `onResized`, `onAnimate`).
_Avoid_: scene controller, app, demo host

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

**ToolBase**:
ReactiveObject base for 3D pointer tools: registers on viewports, builds Pointer3D rays from pointer events, and subclasses implement tool behavior.
_Avoid_: manipulator, gizmo controller

**Editor configs (side-effect)**:
Importing `@io-gui/three` runs config registration so Three.js classes get PropertyConfigs/EditorGroups for inspectors. Opting into the package opts into those registrations.
_Avoid_: three editor plugin, manual register list (as the default path)
