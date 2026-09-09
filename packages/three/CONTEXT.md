# Three

The `@io-gui/three` context: WebGPU Three.js viewports wired into Io-Gui's reactive graph. A ThreeApplet owns the scene and lifecycle; IoThreeViewport renders it through a shared renderer and a per-viewport canvas target. Math editor elements and side-effect EditorConfigs integrate Three types with `@io-gui/editors`.

## Language

**ThreeApplet**:
ReactiveObject base for a Three.js application: owns the `Scene`, tone-mapping knobs, optional editor `uiConfig`/`uiGroups`, and lifecycle hooks (`onRendererInitialized`, `onResized`, `onAnimate`).
_Avoid_: scene controller, app, demo host

**CanvasTarget**:
Per-viewport render surface the shared renderer draws into. Each `IoThreeViewport` has its own; viewports do not share canvases.
_Avoid_: canvas, framebuffer (as the Io-Gui term)

**Shared renderer**:
The single default `WebGPURenderer` reused across viewports. Renderer state is reset per viewport draw; a custom renderer may be passed in.
_Avoid_: global GL context, IoGl (core 2D shader quad)

**Playing**:
Whether the viewport runs the animation loop and calls `ThreeApplet.onAnimate`. Off when false; non-visible viewports also skip draws via IntersectionObserver.
_Avoid_: animating, running, live

**ViewCameras**:
ReactiveObject that owns perspective/orthographic cameras for one viewport and switches between them without mutating the scene graph.
_Avoid_: camera rig, camera controller

**ToolBase**:
ReactiveObject base for 3D pointer tools: registers on viewports, builds Pointer3D rays from pointer events, and subclasses implement tool behavior.
_Avoid_: manipulator, gizmo controller

**Editor configs (side-effect)**:
Importing `@io-gui/three` runs config registration so Three.js classes get PropertyConfigs/EditorGroups for inspectors. Opting into the package opts into those registrations.
_Avoid_: three editor plugin, manual register list (as the default path)
